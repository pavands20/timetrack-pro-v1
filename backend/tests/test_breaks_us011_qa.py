"""QA for US-011 breaks (AC-028, AC-029, AC-030) through the HTTP API on the real PostgreSQL.

Complements test_clock_us010_qa.py, which covers the single-break happy path: these tests
cover several breaks on one entry, the stored break rows, and what a refused request leaves
behind. Time is controlled by replacing `datetime` in app.routers.clock.
NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user load) cannot be tested here.
"""

from datetime import UTC, datetime

import pytest

from app.database import engine
from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.routers import clock as clock_module
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"


# ux_breaks_one_open_per_entry has only a postgresql_where, so on SQLite it is a full unique
# index and a second break on one entry is rejected. Only PostgreSQL has the partial index.
needs_postgres = pytest.mark.skipif(
    engine.dialect.name != "postgresql",
    reason="several breaks per entry need the PostgreSQL partial unique index; this run is on "
    + engine.dialect.name,
)


def utc(*a):
    return datetime(*a, tzinfo=UTC)


@pytest.fixture(autouse=True)
def _clean(db_session):
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db_session.query(model).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


@pytest.fixture
def at(monkeypatch):
    state = {"now": utc(2026, 1, 15, 9, 0)}

    class FakeDT(datetime):
        @classmethod
        def now(cls, tz=None):
            return state["now"]

    monkeypatch.setattr(clock_module, "datetime", FakeDT)

    def setter(value):
        state["now"] = value

    return setter


def mk_user(db, email):
    u = User(
        full_name=email.split("@")[0],
        email=email,
        role="Employee",
        time_zone="Europe/London",
        password_hash=hash_password(PW),
    )
    db.add(u)
    db.commit()
    return u


def sign_in(client, email):
    r = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H)
    assert r.status_code == 200
    return {"Authorization": "Bearer " + r.json()["token"], **H}


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "brk.emp@example.com")
    c = Client(name="Brk Client")
    db_session.add(c)
    db_session.flush()
    p = Project(client_id=c.id, name="Brk Proj", bill_rate=10)
    db_session.add(p)
    db_session.flush()
    t = Task(project_id=p.id, name="Brk Task")
    db_session.add(t)
    db_session.commit()
    return u, sign_in(client, u.email), p, t


def clock_in(client, h, p, t):
    r = client.post(
        "/api/clock/in",
        json={"project_id": p.id, "task_id": t.id, "billable": True},
        headers=h,
    )
    assert r.status_code == 201, r.text


def start(client, h):
    return client.post("/api/clock/breaks/start", headers=h)


def end(client, h):
    return client.post("/api/clock/breaks/end", headers=h)


def out(client, h):
    return client.post("/api/clock/out", headers=h)


def test_ac028_break_row_has_start_and_end_times(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 12, 0))
    assert start(client, h).status_code in (200, 201)
    at(utc(2026, 1, 15, 12, 45))
    assert end(client, h).status_code == 200
    db_session.expire_all()
    b = db_session.query(Break).one()
    entry = db_session.query(TimeEntry).filter_by(user_id=u.id).one()
    assert b.time_entry_id == entry.id
    assert b.start_at.astimezone(UTC) == utc(2026, 1, 15, 12, 0)
    assert b.end_at.astimezone(UTC) == utc(2026, 1, 15, 12, 45)


def test_ac028_response_reports_break_and_status_reflects_it(client, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    started = start(client, h).json()
    assert started["on_break"] is True
    assert started["break_started_at"] == "2026-01-15T10:00:00Z"
    at(utc(2026, 1, 15, 10, 30))
    ended = end(client, h).json()
    assert ended["on_break"] is False
    assert ended["break_started_at"] is None
    assert ended["break_minutes"] == 30
    status = client.get("/api/clock/status", headers=h).json()["entry"]
    assert status["on_break"] is False and status["break_minutes"] == 30


@needs_postgres
def test_ac028_several_breaks_are_all_subtracted(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 8, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    start(client, h)
    at(utc(2026, 1, 15, 10, 15))
    end(client, h)
    # a second break after the first has ended is allowed
    at(utc(2026, 1, 15, 12, 0))
    assert start(client, h).status_code in (200, 201)
    at(utc(2026, 1, 15, 12, 45))
    assert end(client, h).status_code == 200
    at(utc(2026, 1, 15, 16, 0))
    r = out(client, h)
    assert r.status_code == 200
    assert r.json()["duration_minutes"] == 8 * 60 - 60  # 8 h less 15 + 45 min of break
    assert db_session.query(Break).filter(Break.end_at.is_not(None)).count() == 2


def test_ac028_break_does_not_change_entry_start(client, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 9, 30))
    start(client, h)
    at(utc(2026, 1, 15, 9, 40))
    end(client, h)
    entry = client.get("/api/clock/status", headers=h).json()["entry"]
    assert entry["start_at"] == "2026-01-15T09:00:00Z"


def test_ac029_clock_out_on_break_ends_break_at_clock_out_time(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 11, 0))
    start(client, h)
    at(utc(2026, 1, 15, 11, 20))
    r = out(client, h)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["end_at"] == "2026-01-15T11:20:00Z"
    assert j["duration_minutes"] == 120  # 2h20 elapsed less the 20 min break
    db_session.expire_all()
    b = db_session.query(Break).one()
    assert b.end_at is not None and b.end_at.astimezone(UTC) == utc(2026, 1, 15, 11, 20)
    entry = db_session.query(TimeEntry).filter_by(user_id=u.id).one()
    assert entry.end_at is not None and entry.end_at.astimezone(UTC) == utc(2026, 1, 15, 11, 20)
    assert db_session.query(Break).filter(Break.end_at.is_(None)).count() == 0


def test_ac029_after_clock_out_status_is_idle_and_break_calls_refused(
    client, db_session, world, at
):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    start(client, h)
    at(utc(2026, 1, 15, 10, 10))
    assert out(client, h).status_code == 200
    assert client.get("/api/clock/status", headers=h).json() == {"entry": None}
    assert end(client, h).status_code == 409
    assert start(client, h).status_code == 409
    assert db_session.query(Break).count() == 1


@needs_postgres
def test_ac029_clock_out_on_second_break_keeps_first_break_untouched(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    start(client, h)
    at(utc(2026, 1, 15, 10, 30))
    end(client, h)
    at(utc(2026, 1, 15, 12, 0))
    start(client, h)
    at(utc(2026, 1, 15, 12, 30))
    r = out(client, h)
    assert r.json()["duration_minutes"] == 3 * 60 + 30 - 60  # 3h30 elapsed less 30 + 30
    db_session.expire_all()
    ends = sorted(b.end_at.astimezone(UTC) for b in db_session.query(Break))
    assert ends == [utc(2026, 1, 15, 10, 30), utc(2026, 1, 15, 12, 30)]


def test_ac030_second_start_while_on_break_refused_and_original_kept(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    assert start(client, h).status_code in (200, 201)
    at(utc(2026, 1, 15, 10, 10))
    r = start(client, h)
    assert r.status_code == 409
    assert isinstance(r.json()["detail"], str) and r.json()["detail"]
    db_session.expire_all()
    b = db_session.query(Break).one()  # still exactly one row
    assert b.end_at is None and b.start_at.astimezone(UTC) == utc(2026, 1, 15, 10, 0)
    status = client.get("/api/clock/status", headers=h).json()["entry"]
    assert status["on_break"] is True
    assert status["break_started_at"] == "2026-01-15T10:00:00Z"


def test_ac030_refusal_does_not_stop_break_being_ended_normally(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    clock_in(client, h, p, t)
    at(utc(2026, 1, 15, 10, 0))
    start(client, h)
    at(utc(2026, 1, 15, 10, 5))
    assert start(client, h).status_code == 409
    at(utc(2026, 1, 15, 10, 30))
    assert end(client, h).status_code == 200
    at(utc(2026, 1, 15, 11, 0))
    r = out(client, h)
    assert r.json()["duration_minutes"] == 90  # 2h less the single 30 min break


def test_ac030_start_break_without_running_entry_refused(client, db_session, world):
    u, h, p, t = world
    r = start(client, h)
    assert r.status_code == 409
    assert db_session.query(Break).count() == 0
