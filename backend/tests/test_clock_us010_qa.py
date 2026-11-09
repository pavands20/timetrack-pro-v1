"""QA for US-010 clock API (AC-025..AC-027, AC-018/AC-024 via US-007, NFR-007/009/014).

Runs against the real PostgreSQL. Time is controlled by replacing the `datetime` name in
app.routers.clock; no sleeping.
NFR-006 (EU hosting), NFR-008 (retention), NFR-012 (phone layout) and NFR-015 (500-user load)
cannot be tested in this backend suite.
"""

import threading
from datetime import UTC, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import engine
from app.main import app
from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.routers import clock as clock_module
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
ALREADY = "You are already clocked in since {at}. Clock out before starting a new entry."
NOT_IN = "You are not clocked in, so there is nothing to clock out of."


def utc(*a):
    return datetime(*a, tzinfo=UTC)


@pytest.fixture(autouse=True)
def _clean(db_session):
    """Commits inside a test may outlive its rollback; start from empty tables."""
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db_session.query(model).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


@pytest.fixture
def at(monkeypatch):
    """Call at(dt) to set 'now' for the clock router."""
    state = {"now": utc(2026, 1, 15, 9, 0)}

    class FakeDT(datetime):
        @classmethod
        def now(cls, tz=None):
            return state["now"]

    monkeypatch.setattr(clock_module, "datetime", FakeDT)

    def setter(value):
        state["now"] = value

    return setter


def mk_user(db, email, tz="Europe/London", role="Employee"):
    u = User(
        full_name=email.split("@")[0],
        email=email,
        role=role,
        time_zone=tz,
        password_hash=hash_password(PW),
    )
    db.add(u)
    db.commit()
    return u


def sign_in(client, email):
    r = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H)
    assert r.status_code == 200
    return {"Authorization": "Bearer " + r.json()["token"], **H}


def catalogue(db, tag="a"):
    c = Client(name=f"Clock Client {tag}")
    db.add(c)
    db.flush()
    p = Project(client_id=c.id, name=f"Proj {tag}", bill_rate=10)
    db.add(p)
    db.flush()
    t = Task(project_id=p.id, name=f"Task {tag}")
    db.add(t)
    db.commit()
    return c, p, t


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "clk.emp@example.com")
    c, p, t = catalogue(db_session)
    return u, sign_in(client, u.email), c, p, t


def body(p, t, billable=True):
    return {"project_id": p.id, "task_id": t.id, "billable": billable}


def open_count(db, uid):
    return db.query(TimeEntry).filter(TimeEntry.user_id == uid, TimeEntry.end_at.is_(None)).count()


def total(db, uid):
    return db.query(TimeEntry).filter(TimeEntry.user_id == uid).count()


# ---------- AC-025 ----------


def test_ac025_clock_in_creates_running_entry_and_status_returns_it(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 9, 5))
    r = client.post("/api/clock/in", json=body(p, t, False), headers=h)
    assert r.status_code == 201, r.text
    assert open_count(db_session, u.id) == 1
    s = client.get("/api/clock/status", headers=h)
    assert s.status_code == 200
    e = s.json()["entry"]
    assert e["project_id"] == p.id and e["project_name"] == p.name
    assert e["task_id"] == t.id and e["task_name"] == t.name
    assert e["client_name"] == c.name
    assert e["billable"] is False
    assert e["start_at"] == "2026-01-15T09:05:00Z"
    assert e["on_break"] is False


def test_ac025_status_idle_is_entry_null(client, world):
    _, h, *_ = world
    r = client.get("/api/clock/status", headers=h)
    assert r.status_code == 200 and r.json() == {"entry": None}


# ---------- AC-026 ----------


def test_ac026_clock_out_nets_break_time(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 10, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    entry = db_session.query(TimeEntry).filter_by(user_id=u.id).one()
    db_session.add(
        Break(
            time_entry_id=entry.id,
            start_at=utc(2026, 1, 15, 10, 30),
            end_at=utc(2026, 1, 15, 10, 45),
        )
    )
    db_session.commit()
    at(utc(2026, 1, 15, 12, 0))
    r = client.post("/api/clock/out", headers=h)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["duration_minutes"] == 105
    assert j["start_at"] == "2026-01-15T10:00:00Z" and j["end_at"] == "2026-01-15T12:00:00Z"
    assert j["work_date"] == "2026-01-15"
    assert open_count(db_session, u.id) == 0
    assert client.get("/api/clock/status", headers=h).json() == {"entry": None}


def test_ac026_open_break_is_closed_at_clock_out(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 10, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    entry = db_session.query(TimeEntry).filter_by(user_id=u.id).one()
    db_session.add(Break(time_entry_id=entry.id, start_at=utc(2026, 1, 15, 11, 30), end_at=None))
    db_session.commit()
    at(utc(2026, 1, 15, 11, 45))
    s = client.get("/api/clock/status", headers=h).json()["entry"]
    assert s["on_break"] is True
    at(utc(2026, 1, 15, 12, 0))
    r = client.post("/api/clock/out", headers=h)
    assert r.status_code == 200
    assert r.json()["duration_minutes"] == 90  # 120 minus 30 of open break
    db_session.expire_all()
    b = db_session.query(Break).filter_by(time_entry_id=entry.id).one()
    assert b.end_at is not None and b.end_at.astimezone(UTC) == utc(2026, 1, 15, 12, 0)


def test_ac026_work_date_is_start_date_in_user_time_zone(client, db_session, at):
    u = mk_user(db_session, "clk.tokyo@example.com", tz="Asia/Tokyo")
    c, p, t = catalogue(db_session, "tokyo")
    h = sign_in(client, u.email)
    at(utc(2026, 1, 15, 20, 0))  # 05:00 on the 16th in Tokyo
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 1, 15, 22, 0))  # still the 16th locally
    r = client.post("/api/clock/out", headers=h)
    assert r.json()["work_date"] == "2026-01-16" and r.json()["duration_minutes"] == 120


# ---------- AC-027 ----------


def test_ac027_second_clock_in_409_leaves_one_open_entry(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 9, 5))
    assert client.post("/api/clock/in", json=body(p, t), headers=h).status_code == 201
    at(utc(2026, 1, 15, 9, 30))
    r = client.post("/api/clock/in", json=body(p, t), headers=h)
    assert r.status_code == 409
    assert r.json() == {"detail": ALREADY.format(at="09:05")}
    assert open_count(db_session, u.id) == 1 and total(db_session, u.id) == 1


def test_ac027_message_uses_users_local_time(client, db_session, at):
    u = mk_user(db_session, "clk.paris@example.com", tz="Europe/Paris")
    c, p, t = catalogue(db_session, "paris")
    h = sign_in(client, u.email)
    at(utc(2026, 1, 15, 9, 5))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    r = client.post("/api/clock/in", json=body(p, t), headers=h)
    assert r.status_code == 409 and r.json()["detail"] == ALREADY.format(at="10:05")


def test_ac027_concurrent_clock_ins_leave_one_open_entry():
    """Real commits from separate sessions; cleaned up afterwards."""
    with Session(engine) as s:
        u = mk_user(s, "clk.race@example.com")
        c, p, t = catalogue(s, "race")
        ids = (u.id, c.id, p.id, t.id)
    try:
        tc = TestClient(app)
        h = sign_in(tc, "clk.race@example.com")
        results = []
        barrier = threading.Barrier(2)

        def go():
            cl = TestClient(app)
            barrier.wait()
            results.append(cl.post("/api/clock/in", json=body(p, t), headers=h).status_code)

        threads = [threading.Thread(target=go) for _ in range(2)]
        for th in threads:
            th.start()
        for th in threads:
            th.join()
        assert sorted(results) == [201, 409], results
        with Session(engine) as s:
            assert open_count(s, ids[0]) == 1 and total(s, ids[0]) == 1
    finally:
        with Session(engine) as s:
            s.query(TimeEntry).filter_by(user_id=ids[0]).delete()
            s.query(UserSession).filter_by(user_id=ids[0]).delete()
            s.query(Task).filter_by(id=ids[3]).delete()
            s.query(Project).filter_by(id=ids[2]).delete()
            s.query(Client).filter_by(id=ids[1]).delete()
            s.query(User).filter_by(id=ids[0]).delete()
            s.commit()


def test_ac027_clock_out_with_nothing_running_409(client, db_session, world):
    u, h, *_ = world
    r = client.post("/api/clock/out", headers=h)
    assert r.status_code == 409 and r.json() == {"detail": NOT_IN}
    assert total(db_session, u.id) == 0


def test_ac027_second_clock_out_409(client, world, at):
    u, h, c, p, t = world
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 1, 15, 9, 30))
    assert client.post("/api/clock/out", headers=h).status_code == 200
    assert client.post("/api/clock/out", headers=h).status_code == 409


# ---------- AC-018 / AC-024 ----------


def _admin(client, db_session):
    mk_user(db_session, "clk.admin@example.com", role="System Admin")
    return sign_in(client, "clk.admin@example.com")


def test_ac018_archived_client_refuses_clock_in_and_keeps_history(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 1, 15, 10, 0))
    assert client.post("/api/clock/out", headers=h).status_code == 200
    before = [
        (e.id, e.start_at, e.end_at, e.project_id, e.task_id)
        for e in db_session.query(TimeEntry).filter_by(user_id=u.id)
    ]
    adm = _admin(client, db_session)
    r = client.patch(f"/api/admin/clients/{c.id}", json={"is_archived": True}, headers=adm)
    assert r.status_code == 200
    r = client.post("/api/clock/in", json=body(p, t), headers=h)
    assert r.status_code == 422
    assert any(d["loc"] == ["body", "project_id"] and d["msg"] for d in r.json()["detail"])
    db_session.expire_all()
    after = [
        (e.id, e.start_at, e.end_at, e.project_id, e.task_id)
        for e in db_session.query(TimeEntry).filter_by(user_id=u.id)
    ]
    assert after == before and open_count(db_session, u.id) == 0
    listed = client.get("/api/admin/clients", headers=adm).json()
    row = next(x for x in listed if x["id"] == c.id)
    assert row["is_archived"] is True and [x["id"] for x in row["projects"]] == [p.id]


def test_ac024_archived_task_refuses_clock_in_and_keeps_history(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 1, 15, 10, 0))
    client.post("/api/clock/out", headers=h)
    before = [
        (e.id, e.start_at, e.end_at, e.task_id)
        for e in db_session.query(TimeEntry).filter_by(user_id=u.id)
    ]
    adm = _admin(client, db_session)
    r = client.patch(f"/api/admin/tasks/{t.id}", json={"is_archived": True}, headers=adm)
    assert r.status_code == 200
    r = client.post("/api/clock/in", json=body(p, t), headers=h)
    assert r.status_code == 422
    assert any(d["loc"] == ["body", "task_id"] and d["msg"] for d in r.json()["detail"])
    db_session.expire_all()
    after = [
        (e.id, e.start_at, e.end_at, e.task_id)
        for e in db_session.query(TimeEntry).filter_by(user_id=u.id)
    ]
    assert after == before and open_count(db_session, u.id) == 0
    listed = client.get("/api/admin/clients", headers=adm).json()
    row = next(x for x in listed if x["id"] == c.id)
    tasks = row["projects"][0]["tasks"]
    assert [x["id"] for x in tasks] == [t.id] and tasks[0]["is_archived"] is True


# ---------- NFR-009 ----------


def test_nfr009_summer_late_utc_entry_has_next_local_work_date(client, db_session, world, at):
    u, h, c, p, t = world  # Europe/London, BST in July
    at(utc(2026, 7, 10, 23, 30))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    entry = db_session.query(TimeEntry).filter_by(user_id=u.id).one()
    stored = entry.start_at
    stored = stored if stored.tzinfo else stored.replace(tzinfo=UTC)
    assert stored.astimezone(UTC) == utc(2026, 7, 10, 23, 30)
    assert client.get("/api/clock/status", headers=h).json()["entry"]["start_at"] == (
        "2026-07-10T23:30:00Z"
    )
    at(utc(2026, 7, 11, 0, 30))
    r = client.post("/api/clock/out", headers=h)
    assert r.json()["work_date"] == "2026-07-11"
    assert r.json()["duration_minutes"] == 60
    assert r.json()["end_at"].endswith("Z")


def test_nfr009_duration_across_spring_forward_is_elapsed_utc_time(client, world, at):
    u, h, c, p, t = world
    at(utc(2026, 3, 29, 0, 30))  # last Sunday in March: London jumps 01:00 UTC
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 3, 29, 1, 30))
    r = client.post("/api/clock/out", headers=h)
    assert r.json()["duration_minutes"] == 60
    assert r.json()["work_date"] == "2026-03-29"


def test_nfr009_duration_across_autumn_change(client, world, at):
    u, h, c, p, t = world
    at(utc(2026, 10, 24, 23, 30))  # BST: 00:30 on the 25th locally
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 10, 25, 2, 30))
    r = client.post("/api/clock/out", headers=h)
    assert r.json()["duration_minutes"] == 180
    assert r.json()["work_date"] == "2026-10-25"


# ---------- NFR-014 ----------


def test_nfr014_deactivating_user_keeps_time_entries(client, db_session, world, at):
    u, h, c, p, t = world
    at(utc(2026, 1, 15, 9, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    at(utc(2026, 1, 15, 10, 0))
    client.post("/api/clock/out", headers=h)
    at(utc(2026, 1, 16, 9, 0))
    client.post("/api/clock/in", json=body(p, t), headers=h)
    assert total(db_session, u.id) == 2
    adm = _admin(client, db_session)
    r = client.post(f"/api/admin/users/{u.id}/deactivate", headers=adm)
    assert r.status_code == 200
    assert total(db_session, u.id) == 2
    assert client.get("/api/clock/status", headers=h).status_code == 401


# ---------- NFR-007 ----------

ROUTES = [("get", "/api/clock/status"), ("post", "/api/clock/in"), ("post", "/api/clock/out")]


@pytest.mark.parametrize(("method", "path"), ROUTES)
def test_nfr007_every_clock_route_401_without_session(client, db_session, world, method, path):
    u, h, c, p, t = world
    kw = {"json": body(p, t)} if path.endswith("/in") else {}
    r = getattr(client, method)(path, headers=H, **kw)
    assert r.status_code == 401
    assert total(db_session, u.id) == 0


def test_nfr007_user_never_sees_or_closes_another_users_entry(client, db_session, world, at):
    a, ha, c, p, t = world
    b = mk_user(db_session, "clk.other@example.com")
    hb = sign_in(client, b.email)
    at(utc(2026, 1, 15, 9, 0))
    assert client.post("/api/clock/in", json=body(p, t), headers=ha).status_code == 201
    assert client.get("/api/clock/status", headers=hb).json() == {"entry": None}
    r = client.post("/api/clock/out", headers=hb)
    assert r.status_code == 409
    assert open_count(db_session, a.id) == 1
    # B can clock in independently, and A's entry stays open when B clocks out.
    at(utc(2026, 1, 15, 9, 10))
    assert client.post("/api/clock/in", json=body(p, t), headers=hb).status_code == 201
    at(utc(2026, 1, 15, 9, 40))
    assert client.post("/api/clock/out", headers=hb).status_code == 200
    assert open_count(db_session, a.id) == 1
    assert client.get("/api/clock/status", headers=ha).json()["entry"]["start_at"] == (
        "2026-01-15T09:00:00Z"
    )


def test_ac025_unknown_project_and_mismatched_task_422_no_row(client, db_session, world):
    u, h, c, p, t = world
    _, p2, t2 = catalogue(db_session, "other")
    r = client.post(
        "/api/clock/in", json={"project_id": 999999, "task_id": t.id, "billable": True}, headers=h
    )
    assert r.status_code == 422
    r = client.post(
        "/api/clock/in", json={"project_id": p.id, "task_id": t2.id, "billable": True}, headers=h
    )
    assert r.status_code == 422
    assert total(db_session, u.id) == 0


_ = timedelta
