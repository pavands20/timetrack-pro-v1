"""QA for US-017 times stored in UTC, shown in the user's zone (AC-045, AC-046, NFR-009).

Runs against the real PostgreSQL. Time is controlled by replacing the `datetime` name in
app.routers.clock; no sleeping. The raw stored value is read back with SQL, not the ORM.
The browser display of the same instants is covered by Home.timezone.test.tsx and the
e2e spec timezone.spec.ts.
NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user load) cannot be tested here.
"""

from datetime import UTC, datetime
from zoneinfo import ZoneInfo

import pytest
from sqlalchemy import text

from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.routers import clock as clock_module
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
LONDON = ZoneInfo("Europe/London")


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


def mk_world(client, db, tz="Europe/London", tag="tz"):
    u = User(
        full_name=tag,
        email=f"{tag}@example.com",
        role="Employee",
        time_zone=tz,
        password_hash=hash_password(PW),
    )
    db.add(u)
    c = Client(name=f"TZ Client {tag}")
    db.add(c)
    db.flush()
    p = Project(client_id=c.id, name=f"TZ Proj {tag}", bill_rate=10)
    db.add(p)
    db.flush()
    t = Task(project_id=p.id, name=f"TZ Task {tag}")
    db.add(t)
    db.commit()
    r = client.post("/api/auth/login", json={"email": u.email, "password": PW}, headers=H)
    assert r.status_code == 200
    h = {"Authorization": "Bearer " + r.json()["token"], **H}
    return u, h, {"project_id": p.id, "task_id": t.id, "billable": True}


def stored_utc(db, entry_id, column="start_at"):
    """The stored instant read with raw SQL (bypassing the ORM), as naive UTC wall-clock time.

    PostgreSQL returns an aware value; SQLite (used when no DATABASE_URL is set) returns
    text or a naive value that the app wrote in UTC.
    """
    raw = db.execute(
        text(f"SELECT {column} FROM time_entries WHERE id = :i"), {"i": entry_id}
    ).scalar_one()
    if isinstance(raw, str):
        raw = datetime.fromisoformat(raw)
    if raw.tzinfo is not None:
        raw = raw.astimezone(UTC)
    return raw.replace(tzinfo=None)


def local_hhmm(iso: str, tz: str) -> str:
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(ZoneInfo(tz)).strftime("%H:%M")


# ---------- AC-045 ----------


def test_ac045_summer_0900_london_is_stored_as_0800_utc_and_displays_0900(
    client, db_session, at
):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 7, 1, 8, 0))  # 09:00 BST
    r = client.post("/api/clock/in", json=b, headers=h)
    assert r.status_code == 201, r.text
    assert r.json()["start_at"] == "2026-07-01T08:00:00Z"
    assert stored_utc(db_session, r.json()["id"]) == datetime(2026, 7, 1, 8, 0)
    status = client.get("/api/clock/status", headers=h).json()
    assert status["entry"]["start_at"] == "2026-07-01T08:00:00Z"
    assert local_hhmm(status["entry"]["start_at"], u.time_zone) == "09:00"


def test_ac045_winter_0900_london_is_stored_as_0900_utc(client, db_session, at):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 1, 15, 9, 0))  # GMT: local and UTC agree
    r = client.post("/api/clock/in", json=b, headers=h)
    assert r.json()["start_at"] == "2026-01-15T09:00:00Z"
    assert stored_utc(db_session, r.json()["id"]) == datetime(2026, 1, 15, 9, 0)


def test_ac045_stored_instant_is_the_same_whatever_the_profile_zone(client, db_session, at):
    """Zone only changes the display: 08:00 UTC is 10:00 in Paris in summer."""
    u, h, b = mk_world(client, db_session, tz="Europe/Paris", tag="paris")
    at(utc(2026, 7, 1, 8, 0))
    r = client.post("/api/clock/in", json=b, headers=h)
    assert r.json()["start_at"] == "2026-07-01T08:00:00Z"
    assert stored_utc(db_session, r.json()["id"]) == datetime(2026, 7, 1, 8, 0)
    assert local_hhmm(r.json()["start_at"], u.time_zone) == "10:00"


def test_ac045_conflict_message_shows_the_start_in_the_users_zone(client, db_session, at):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 7, 1, 8, 0))
    client.post("/api/clock/in", json=b, headers=h)
    again = client.post("/api/clock/in", json=b, headers=h)
    assert again.status_code == 409
    assert "since 09:00" in again.json()["detail"]  # not 08:00


def test_ac045_clock_out_returns_utc_instants_and_local_work_date(client, db_session, at):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 7, 1, 23, 30))  # 00:30 on 2 July in London
    client.post("/api/clock/in", json=b, headers=h)
    at(utc(2026, 7, 2, 0, 30))
    r = client.post("/api/clock/out", headers=h).json()
    assert r["start_at"] == "2026-07-01T23:30:00Z" and r["end_at"] == "2026-07-02T00:30:00Z"
    assert r["work_date"] == "2026-07-02"
    assert r["duration_minutes"] == 60


# ---------- AC-046 ----------


def test_ac046_entry_across_spring_forward_shows_correct_duration_and_local_times(
    client, db_session, at
):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 3, 28, 23, 30))  # 23:30 GMT on Saturday
    entry_id = client.post("/api/clock/in", json=b, headers=h).json()["id"]
    at(utc(2026, 3, 29, 2, 30))  # 03:30 BST on Sunday: the clocks lost an hour
    out = client.post("/api/clock/out", headers=h).json()
    assert out["duration_minutes"] == 180  # elapsed time, not 04:00 - 23:30 wall-clock
    assert out["work_date"] == "2026-03-28"
    assert local_hhmm(out["start_at"], u.time_zone) == "23:30"
    assert local_hhmm(out["end_at"], u.time_zone) == "03:30"
    assert stored_utc(db_session, entry_id, "end_at") == datetime(2026, 3, 29, 2, 30)

    week = client.get("/api/timesheets/2026-03-23", headers=h).json()
    days = week["rows"][0]["days"]
    assert days[5]["clocked_minutes"] == 180  # Saturday 28 March
    assert days[6]["clocked_minutes"] == 0
    assert week["day_totals_minutes"][5] == 180


def test_ac046_entry_across_autumn_change_shows_correct_duration_and_local_times(
    client, db_session, at
):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 10, 24, 22, 30))  # 23:30 BST on Saturday
    client.post("/api/clock/in", json=b, headers=h)
    at(utc(2026, 10, 25, 2, 30))  # 02:30 GMT on Sunday: the clocks gained an hour
    out = client.post("/api/clock/out", headers=h).json()
    assert out["duration_minutes"] == 240  # four real hours, not three on the wall clock
    assert out["work_date"] == "2026-10-24"
    assert local_hhmm(out["start_at"], u.time_zone) == "23:30"
    assert local_hhmm(out["end_at"], u.time_zone) == "02:30"

    week = client.get("/api/timesheets/2026-10-19", headers=h).json()
    days = week["rows"][0]["days"]
    assert days[5]["clocked_minutes"] == 240
    assert week["week_total_minutes"] == 240


def test_ac046_entry_starting_after_the_change_lands_on_the_sunday(client, db_session, at):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 3, 29, 1, 0))  # first instant of BST: 02:00 local
    client.post("/api/clock/in", json=b, headers=h)
    at(utc(2026, 3, 29, 3, 0))  # 04:00 BST
    out = client.post("/api/clock/out", headers=h).json()
    assert out["duration_minutes"] == 120
    assert out["work_date"] == "2026-03-29"
    assert local_hhmm(out["start_at"], u.time_zone) == "02:00"
    days = client.get("/api/timesheets/2026-03-23", headers=h).json()["rows"][0]["days"]
    assert days[6]["clocked_minutes"] == 120


def test_ac046_timesheet_places_a_late_utc_entry_on_the_next_local_day(client, db_session, at):
    u, h, b = mk_world(client, db_session)
    at(utc(2026, 7, 1, 23, 30))  # Wed 1 July UTC, 00:30 Thu 2 July in London
    client.post("/api/clock/in", json=b, headers=h)
    at(utc(2026, 7, 2, 0, 0))
    client.post("/api/clock/out", headers=h)
    week = client.get("/api/timesheets/2026-06-29", headers=h).json()
    days = week["rows"][0]["days"]
    assert days[2]["clocked_minutes"] == 0  # Wednesday
    assert days[3]["clocked_minutes"] == 30  # Thursday
    assert week["time_zone"] == "Europe/London"
