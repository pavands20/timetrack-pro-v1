"""QA for US-016 weekly dashboard API (AC-042, AC-043, NFR-007, NFR-010).

Real PostgreSQL via conftest. Time is frozen by replacing `datetime` in app.routers.dashboard.
NFR-006 (EU hosting), NFR-008 (retention), NFR-012 (phone layout; see e2e) and NFR-015
(500-user load) cannot be tested in this backend suite.
"""

from datetime import UTC, datetime

import pytest

from app.database import engine
from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.routers import dashboard as dash_module
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
URL = "/api/dashboard/week"


# On SQLite the partial unique index on open entries becomes a full unique index on user_id,
# so a user can hold only one entry; tests with several entries per user need PostgreSQL.
needs_postgres = pytest.mark.skipif(
    engine.dialect.name != "postgresql",
    reason="several entries per user need PostgreSQL; this run is on " + engine.dialect.name,
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
    state = {"now": utc(2026, 1, 14, 12, 0)}  # Wednesday

    class FakeDT(datetime):
        @classmethod
        def now(cls, tz=None):
            return state["now"] if tz is None else state["now"].astimezone(tz)

    monkeypatch.setattr(dash_module, "datetime", FakeDT)

    def setter(v):
        state["now"] = v

    return setter


def mk_user(db, email, tz="Europe/London"):
    u = User(
        full_name=email.split("@")[0],
        email=email,
        role="Employee",
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
    c = Client(name=f"Dash Client {tag}")
    db.add(c)
    db.flush()
    p = Project(client_id=c.id, name=f"Dash Proj {tag}", bill_rate=10)
    db.add(p)
    db.flush()
    t = Task(project_id=p.id, name=f"Dash Task {tag}")
    db.add(t)
    db.commit()
    return p, t


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "dash.emp@example.com")
    p, t = catalogue(db_session)
    return u, sign_in(client, u.email), p, t


def clocked(db, u, p, t, start, end, breaks=(), billable=True, open_=False):
    e = TimeEntry(
        user_id=u.id,
        project_id=p.id,
        task_id=t.id,
        billable=billable,
        start_at=start,
        end_at=None if open_ else end,
    )
    db.add(e)
    db.flush()
    for bs, be in breaks:
        db.add(Break(time_entry_id=e.id, start_at=bs, end_at=be))
    db.commit()
    return e


def manual(client, h, p, t, week, cells):
    body = {
        "week_start": week,
        "cells": [
            {
                "project_id": p.id,
                "task_id": t.id,
                "billable": b,
                "date": d,
                "minutes": m,
            }
            for d, m, b in cells
        ],
    }
    r = client.put("/api/timesheets/cells", json=body, headers=h)
    assert r.status_code == 200, r.text


def get(client, h):
    r = client.get(URL, headers=h)
    assert r.status_code == 200, r.text
    return r.json()


@needs_postgres
def test_ac042_mixed_manual_and_clocked_totals_split_and_monday_first(
    client, db_session, world, at
):
    u, h, p, t = world
    at(utc(2026, 1, 14, 12, 0))
    manual(client, h, p, t, "2026-01-12", [("2026-01-12", 120, True), ("2026-01-14", 60, False)])
    clocked(
        db_session,
        u,
        p,
        t,
        utc(2026, 1, 13, 9, 0),
        utc(2026, 1, 13, 17, 0),
        breaks=[(utc(2026, 1, 13, 12, 0), utc(2026, 1, 13, 12, 30))],
    )  # 480 - 30 = 450 billable
    j = get(client, h)
    assert j["week_start"] == "2026-01-12" and j["week_end"] == "2026-01-18"
    assert j["time_zone"] == "Europe/London"
    assert [d["date"] for d in j["days"]] == [f"2026-01-{n}" for n in range(12, 19)]
    assert j["billable_minutes"] == 570 and j["non_billable_minutes"] == 60
    assert j["total_minutes"] == 630 and j["has_entries"] is True
    by = {d["date"]: d for d in j["days"]}
    assert by["2026-01-12"]["billable_minutes"] == 120
    assert by["2026-01-13"]["total_minutes"] == 450
    assert by["2026-01-14"]["non_billable_minutes"] == 60
    assert by["2026-01-18"]["total_minutes"] == 0
    for d in j["days"]:
        assert d["total_minutes"] == d["billable_minutes"] + d["non_billable_minutes"]


def test_ac042_running_entry_excluded(client, db_session, world, at):
    u, h, p, t = world
    clocked(db_session, u, p, t, utc(2026, 1, 14, 9, 0), None, open_=True)
    j = get(client, h)
    assert j["total_minutes"] == 0 and j["has_entries"] is False


def test_ac042_other_users_hours_excluded(client, db_session, world, at):
    u, h, p, t = world
    other = mk_user(db_session, "dash.other@example.com")
    clocked(db_session, other, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 17, 0))
    ho = sign_in(client, other.email)
    j = get(client, h)
    assert j["total_minutes"] == 0 and j["has_entries"] is False
    assert get(client, ho)["total_minutes"] == 480


@needs_postgres
def test_ac042_previous_and_next_week_excluded(client, db_session, world, at):
    u, h, p, t = world
    clocked(db_session, u, p, t, utc(2026, 1, 11, 9, 0), utc(2026, 1, 11, 10, 0))  # Sun before
    clocked(db_session, u, p, t, utc(2026, 1, 19, 9, 0), utc(2026, 1, 19, 10, 0))  # Mon after
    assert get(client, h)["total_minutes"] == 0


def test_ac042_week_boundary_uses_user_time_zone(client, db_session, at):
    u = mk_user(db_session, "dash.tokyo@example.com", tz="Asia/Tokyo")
    p, t = catalogue(db_session, "tokyo")
    h = sign_in(client, u.email)
    # Sunday 18 Jan 23:00 UTC is Monday 19 Jan 08:00 in Tokyo: the new week.
    at(utc(2026, 1, 18, 23, 30))
    clocked(db_session, u, p, t, utc(2026, 1, 18, 23, 0), utc(2026, 1, 18, 23, 20))
    j = get(client, h)
    assert j["week_start"] == "2026-01-19" and j["time_zone"] == "Asia/Tokyo"
    assert j["total_minutes"] == 20
    assert j["days"][0]["date"] == "2026-01-19" and j["days"][0]["total_minutes"] == 20


def test_ac042_spring_forward_week(client, db_session, world, at):
    u, h, p, t = world  # London; clocks change Sun 29 March 2026
    at(utc(2026, 3, 29, 12, 0))
    clocked(db_session, u, p, t, utc(2026, 3, 29, 0, 30), utc(2026, 3, 29, 1, 30))  # 60 min
    j = get(client, h)
    assert j["week_start"] == "2026-03-23" and j["week_end"] == "2026-03-29"
    assert len(j["days"]) == 7
    assert j["days"][6]["date"] == "2026-03-29" and j["days"][6]["total_minutes"] == 60
    # 22:30 UTC on Sunday 29 March is 23:30 BST: still Sunday, still this week.
    at(utc(2026, 3, 30, 12, 0))
    assert get(client, h)["week_start"] == "2026-03-30"
    assert get(client, h)["total_minutes"] == 0


@needs_postgres
def test_ac042_dst_late_utc_entry_lands_on_next_local_week(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 3, 30, 12, 0))
    clocked(db_session, u, p, t, utc(2026, 3, 29, 23, 30), utc(2026, 3, 30, 0, 30))  # Mon local
    j = get(client, h)
    assert j["week_start"] == "2026-03-30"
    assert j["total_minutes"] == 60 and j["days"][0]["total_minutes"] == 60


def test_ac042_autumn_change_week(client, db_session, world, at):
    u, h, p, t = world
    at(utc(2026, 10, 25, 12, 0))
    clocked(db_session, u, p, t, utc(2026, 10, 24, 23, 30), utc(2026, 10, 25, 2, 30))  # 180
    j = get(client, h)
    assert j["week_start"] == "2026-10-19" and j["week_end"] == "2026-10-25"
    assert len(j["days"]) == 7 and j["days"][6]["total_minutes"] == 180


def test_ac042_401_without_session(client, world):
    r = client.get(URL)
    assert r.status_code == 401 and isinstance(r.json()["detail"], str)
    assert "dash.emp" not in r.text
    assert client.get(URL, headers={"Authorization": "Bearer nonsense"}).status_code == 401


def test_ac043_empty_week_zeros_and_has_entries_false(client, world, at):
    _, h, *_ = world
    j = get(client, h)
    assert j["total_minutes"] == 0 and j["billable_minutes"] == 0
    assert j["non_billable_minutes"] == 0 and j["has_entries"] is False
    assert len(j["days"]) == 7
    assert all(d["total_minutes"] == 0 for d in j["days"])


def test_nfr010_week_is_monday_to_sunday_on_every_weekday(client, world, at):
    _, h, *_ = world
    for day in range(12, 19):  # Mon 12 .. Sun 18 January 2026
        at(utc(2026, 1, day, 12, 0))
        j = get(client, h)
        assert j["week_start"] == "2026-01-12" and j["week_end"] == "2026-01-18"
        assert datetime.fromisoformat(j["days"][0]["date"]).weekday() == 0
        assert datetime.fromisoformat(j["days"][6]["date"]).weekday() == 6


def test_nfr007_zero_minute_manual_cell_is_not_an_entry_and_no_leak(client, world, at):
    _, h, *_ = world
    j = get(client, h)
    assert set(j) == {
        "week_start",
        "week_end",
        "time_zone",
        "total_minutes",
        "billable_minutes",
        "non_billable_minutes",
        "has_entries",
        "days",
    }
