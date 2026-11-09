"""QA for US-013 timesheet API (AC-033..AC-038, NFR-007/009/010/013).

Runs against the real PostgreSQL through the conftest fixtures.
NFR-006 (EU hosting), NFR-008 (retention), NFR-012 (phone layout) and NFR-015 (500-user load)
cannot be tested in this backend suite.
"""

from datetime import UTC, datetime

import pytest

from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
WEEK = "2026-01-12"  # Monday
SUMMER = "2026-07-06"
SPRING = "2026-03-23"  # contains 29 March
AUTUMN = "2026-10-19"  # contains 25 October


def utc(*a):
    return datetime(*a, tzinfo=UTC)


@pytest.fixture(autouse=True)
def _clean(db_session):
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db_session.query(model).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


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
    c = Client(name=f"TS Client {tag}")
    db.add(c)
    db.flush()
    p = Project(client_id=c.id, name=f"TS Proj {tag}", bill_rate=10)
    db.add(p)
    db.flush()
    t = Task(project_id=p.id, name=f"TS Task {tag}")
    db.add(t)
    db.commit()
    return c, p, t


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "ts.emp@example.com")
    c, p, t = catalogue(db_session)
    return u, sign_in(client, u.email), p, t


def cell(p, t, day, minutes, billable=True):
    return {
        "project_id": p.id,
        "task_id": t.id,
        "billable": billable,
        "date": day,
        "minutes": minutes,
    }


def put(client, h, cells, week=WEEK):
    return client.put("/api/timesheets/cells", json={"week_start": week, "cells": cells}, headers=h)


def get(client, h, week=WEEK):
    return client.get(f"/api/timesheets/{week}", headers=h)


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


def day_of(body, date, row=0):
    return next(d for d in body["rows"][row]["days"] if d["date"] == date)


# ---------- AC-033 ----------


def test_ac033_put_then_get_returns_hours_and_totals(client, world):
    _, h, p, t = world
    r = put(client, h, [cell(p, t, "2026-01-12", 120), cell(p, t, "2026-01-14", 90)])
    assert r.status_code == 200, r.text
    b = get(client, h).json()
    assert day_of(b, "2026-01-12")["manual_minutes"] == 120
    assert day_of(b, "2026-01-14")["manual_minutes"] == 90
    assert b["day_totals_minutes"] == [120, 0, 90, 0, 0, 0, 0]
    assert b["week_total_minutes"] == 210
    assert r.json() == b


def test_ac033_reput_replaces_not_adds(client, world, db_session):
    u, h, p, t = world
    put(client, h, [cell(p, t, "2026-01-12", 120)])
    put(client, h, [cell(p, t, "2026-01-12", 45)])
    b = get(client, h).json()
    assert day_of(b, "2026-01-12")["manual_minutes"] == 45
    assert b["week_total_minutes"] == 45
    assert db_session.query(TimeEntry).filter_by(user_id=u.id).count() == 1


# ---------- AC-034 ----------


@pytest.mark.parametrize("minutes", [-1, "abc", 1441, 99999, None, 1.5, True, [], "60"])
def test_ac034_bad_minutes_422_field_level_nothing_saved(client, world, minutes):
    _, h, p, t = world
    put(client, h, [cell(p, t, "2026-01-13", 60)])
    before = get(client, h).json()
    r = put(client, h, [cell(p, t, "2026-01-12", minutes)])
    assert r.status_code == 422
    d = r.json()["detail"]
    assert any(x["loc"][-1] == "minutes" and x["msg"] for x in d)
    assert get(client, h).json() == before


def test_ac034_day_total_over_24h_with_manual_and_clocked_422(client, world, db_session):
    u, h, p, t = world
    clocked(db_session, u, p, t, utc(2026, 1, 12, 8, 0), utc(2026, 1, 12, 18, 0))  # 600
    before = get(client, h).json()
    r = put(client, h, [cell(p, t, "2026-01-12", 900)])  # 1500 > 1440
    assert r.status_code == 422
    assert any(x["loc"][-1] == "minutes" and x["msg"] for x in r.json()["detail"])
    assert get(client, h).json() == before
    assert put(client, h, [cell(p, t, "2026-01-12", 840)]).status_code == 200  # exactly 1440


def test_ac034_day_total_across_two_rows_over_24h_422(client, world, db_session):
    u, h, p, t = world
    _, p2, t2 = catalogue(db_session, "b")
    r = put(client, h, [cell(p, t, "2026-01-12", 800), cell(p2, t2, "2026-01-12", 700)])
    assert r.status_code == 422
    assert get(client, h).json()["rows"] == []


def test_ac034_one_bad_cell_saves_none(client, world):
    _, h, p, t = world
    r = put(client, h, [cell(p, t, "2026-01-12", 60), cell(p, t, "2026-01-13", -5)])
    assert r.status_code == 422
    assert get(client, h).json()["rows"] == []


def test_ac034_boundaries_0_and_1440_accepted(client, world):
    _, h, p, t = world
    assert put(client, h, [cell(p, t, "2026-01-12", 0)]).status_code == 200
    assert put(client, h, [cell(p, t, "2026-01-13", 1440)]).status_code == 200


# ---------- AC-035 / NFR-010 ----------


def test_ac035_get_returns_seven_days_monday_to_sunday(client, world):
    _, h, p, t = world
    put(client, h, [cell(p, t, "2026-01-18", 30)])
    b = get(client, h).json()
    dates = [d["date"] for d in b["rows"][0]["days"]]
    assert dates == [f"2026-01-{n}" for n in range(12, 19)]
    assert len(b["day_totals_minutes"]) == 7
    assert b["week_start"] == WEEK and b["week_end"] == "2026-01-18"
    assert b["day_totals_minutes"][6] == 30


def test_ac035_empty_week_has_seven_totals(client, world):
    _, h, *_ = world
    b = get(client, h).json()
    assert b["rows"] == [] and b["day_totals_minutes"] == [0] * 7
    assert b["week_total_minutes"] == 0


@pytest.mark.parametrize("week", ["2026-01-13", "2026-01-18", "2026-01-11"])
def test_ac035_non_monday_422_on_get_and_put(client, world, week):
    _, h, p, t = world
    r = get(client, h, week)
    assert r.status_code == 422 and r.json()["detail"][0]["msg"]
    r = put(client, h, [cell(p, t, "2026-01-13", 60)], week=week)
    assert r.status_code == 422
    assert any(x["loc"][-1] == "week_start" and x["msg"] for x in r.json()["detail"])


def test_ac035_garbage_week_422(client, world):
    _, h, *_ = world
    assert get(client, h, "not-a-date").status_code == 422


# ---------- AC-036 ----------


def test_ac036_clocked_entry_net_of_break_beside_manual(client, world, db_session):
    u, h, p, t = world
    clocked(
        db_session,
        u,
        p,
        t,
        utc(2026, 1, 13, 9, 0),
        utc(2026, 1, 13, 12, 0),
        breaks=[(utc(2026, 1, 13, 10, 0), utc(2026, 1, 13, 10, 30))],
    )
    assert put(client, h, [cell(p, t, "2026-01-13", 60)]).status_code == 200
    b = get(client, h).json()
    assert len(b["rows"]) == 1
    d = day_of(b, "2026-01-13")
    assert d["clocked_minutes"] == 150 and d["manual_minutes"] == 60
    assert b["day_totals_minutes"][1] == 210


def test_ac036_summer_late_utc_entry_lands_on_next_local_day(client, world, db_session):
    u, h, p, t = world  # Europe/London, BST
    clocked(db_session, u, p, t, utc(2026, 7, 10, 23, 30), utc(2026, 7, 11, 0, 30))
    b = get(client, h, SUMMER).json()
    assert day_of(b, "2026-07-11")["clocked_minutes"] == 60
    assert day_of(b, "2026-07-10")["clocked_minutes"] == 0
    assert b["day_totals_minutes"] == [0, 0, 0, 0, 0, 60, 0]


def test_ac036_running_entry_excluded(client, world, db_session):
    u, h, p, t = world
    clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), None, open_=True)
    b = get(client, h).json()
    assert b["rows"] == [] and b["week_total_minutes"] == 0


def test_ac036_other_users_entries_not_in_my_week(client, world, db_session):
    u, h, p, t = world
    o = mk_user(db_session, "ts.other0@example.com")
    clocked(db_session, o, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    assert get(client, h).json()["rows"] == []


# ---------- AC-037 ----------


def test_ac037_patch_billable_on_clocked_entry(client, world, db_session):
    u, h, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    r = client.patch(f"/api/time-entries/{e.id}", json={"billable": False}, headers=h)
    assert r.status_code == 200 and r.json()["billable"] is False
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).billable is False
    assert get(client, h).json()["rows"][0]["billable"] is False


def test_ac037_patch_billable_on_manual_entry(client, world, db_session):
    u, h, p, t = world
    put(client, h, [cell(p, t, "2026-01-12", 60, True)])
    b = get(client, h).json()
    eid = day_of(b, "2026-01-12")["manual_entry_id"]
    r = client.patch(f"/api/time-entries/{eid}", json={"billable": False}, headers=h)
    assert r.status_code == 200 and r.json()["billable"] is False
    b = get(client, h).json()
    assert b["rows"][0]["billable"] is False
    assert day_of(b, "2026-01-12")["manual_minutes"] == 60


def test_ac037_collision_409_nothing_changed(client, world, db_session):
    u, h, p, t = world
    put(client, h, [cell(p, t, "2026-01-12", 60, True), cell(p, t, "2026-01-12", 30, False)])
    rows = {r["billable"]: r for r in get(client, h).json()["rows"]}
    eid = rows[True]["days"][0]["manual_entry_id"]
    r = client.patch(f"/api/time-entries/{eid}", json={"billable": False}, headers=h)
    assert r.status_code == 409 and r.json()["detail"]
    db_session.expire_all()
    assert db_session.get(TimeEntry, eid).billable is True


def test_ac037_other_users_entry_404_no_data(client, world, db_session):
    u, h, p, t = world
    o = mk_user(db_session, "ts.other@example.com")
    e = clocked(db_session, o, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    r = client.patch(f"/api/time-entries/{e.id}", json={"billable": False}, headers=h)
    assert r.status_code == 404
    assert "ts.other" not in r.text and str(e.start_at.year) not in r.text
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).billable is True


def test_ac037_unknown_entry_404(client, world):
    _, h, *_ = world
    r = client.patch("/api/time-entries/999999", json={"billable": True}, headers=h)
    assert r.status_code == 404


def test_ac037_non_boolean_billable_422(client, world, db_session):
    u, h, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    r = client.patch(f"/api/time-entries/{e.id}", json={"billable": "maybe"}, headers=h)
    assert r.status_code == 422


# ---------- AC-038 ----------


def test_ac038_missing_billable_422_nothing_saved(client, world):
    _, h, p, t = world
    c = cell(p, t, "2026-01-12", 60)
    del c["billable"]
    r = put(client, h, [c])
    assert r.status_code == 422
    assert any(x["loc"][-1] == "billable" and x["msg"] for x in r.json()["detail"])
    assert get(client, h).json()["rows"] == []


def test_ac038_null_billable_422(client, world):
    _, h, p, t = world
    c = cell(p, t, "2026-01-12", 60)
    c["billable"] = None
    assert put(client, h, [c]).status_code == 422


def test_ac038_different_billable_listed_as_separate_rows(client, world):
    _, h, p, t = world
    r = put(client, h, [cell(p, t, "2026-01-12", 60, True), cell(p, t, "2026-01-12", 30, False)])
    assert r.status_code == 200
    rows = get(client, h).json()["rows"]
    assert len(rows) == 2
    assert {r_["billable"] for r_ in rows} == {True, False}
    assert {r_["billable"]: r_["days"][0]["manual_minutes"] for r_ in rows} == {True: 60, False: 30}


# ---------- NFR-007 ----------

ROUTES = [
    ("get", "/api/timesheets/2026-01-12"),
    ("put", "/api/timesheets/cells"),
    ("patch", "/api/time-entries/1"),
]


@pytest.mark.parametrize(("method", "path"), ROUTES)
def test_nfr007_every_route_401_without_session(client, world, db_session, method, path):
    u, _, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    kw = {} if method == "get" else {"json": {"week_start": WEEK, "cells": [], "billable": False}}
    path = path.replace("/1", f"/{e.id}") if method == "patch" else path
    r = getattr(client, method)(path, headers=H, **kw)
    assert r.status_code == 401
    assert "TS Proj" not in r.text
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).billable is True


def test_nfr007_users_never_see_or_change_each_others_hours(client, world, db_session):
    a, ha, p, t = world
    b = mk_user(db_session, "ts.bee@example.com")
    hb = sign_in(client, b.email)
    put(client, ha, [cell(p, t, "2026-01-12", 100)])
    assert get(client, hb).json()["rows"] == []
    put(client, hb, [cell(p, t, "2026-01-12", 5)])
    assert day_of(get(client, ha).json(), "2026-01-12")["manual_minutes"] == 100
    assert day_of(get(client, hb).json(), "2026-01-12")["manual_minutes"] == 5
    assert db_session.query(TimeEntry).filter_by(user_id=a.id).count() == 1
    eid = day_of(get(client, ha).json(), "2026-01-12")["manual_entry_id"]
    r = client.patch(f"/api/time-entries/{eid}", json={"billable": False}, headers=hb)
    assert r.status_code == 404 and "100" not in r.text
    assert get(client, ha).json()["rows"][0]["billable"] is True


def test_nfr007_day_total_limit_ignores_other_users_hours(client, world, db_session):
    a, ha, p, t = world
    b = mk_user(db_session, "ts.bee2@example.com")
    hb = sign_in(client, b.email)
    assert put(client, ha, [cell(p, t, "2026-01-12", 1000)]).status_code == 200
    assert put(client, hb, [cell(p, t, "2026-01-12", 1000)]).status_code == 200


# ---------- NFR-009 ----------


def test_nfr009_spring_forward_week_attribution_and_duration(client, world, db_session):
    u, h, p, t = world
    # Sunday 29 March: London jumps at 01:00 UTC. Entry 00:30-01:30 UTC = 60 elapsed minutes.
    clocked(db_session, u, p, t, utc(2026, 3, 29, 0, 30), utc(2026, 3, 29, 1, 30))
    # Sat 28 March 23:30 UTC is still 28th locally (GMT).
    clocked(db_session, u, p, t, utc(2026, 3, 28, 23, 30), utc(2026, 3, 29, 0, 0))
    b = get(client, h, SPRING).json()
    assert day_of(b, "2026-03-29")["clocked_minutes"] == 60
    assert day_of(b, "2026-03-28")["clocked_minutes"] == 30
    assert len(b["rows"][0]["days"]) == 7


def test_nfr009_autumn_change_week_attribution_and_duration(client, world, db_session):
    u, h, p, t = world
    clocked(
        db_session,
        u,
        p,
        t,
        utc(2026, 10, 24, 23, 30),  # 00:30 BST on the 25th
        utc(2026, 10, 25, 2, 30),
        breaks=[(utc(2026, 10, 25, 1, 0), utc(2026, 10, 25, 1, 30))],
    )
    b = get(client, h, AUTUMN).json()
    assert day_of(b, "2026-10-25")["clocked_minutes"] == 150
    assert day_of(b, "2026-10-24")["clocked_minutes"] == 0


def test_nfr009_manual_hours_on_dst_days_keep_minutes(client, world):
    _, h, p, t = world
    assert put(client, h, [cell(p, t, "2026-03-29", 480)], week=SPRING).status_code == 200
    b = get(client, h, SPRING).json()
    assert day_of(b, "2026-03-29")["manual_minutes"] == 480
    assert b["week_total_minutes"] == 480


def test_nfr009_week_boundary_uses_user_time_zone(client, db_session):
    u = mk_user(db_session, "ts.tokyo@example.com", tz="Asia/Tokyo")
    _, p, t = catalogue(db_session, "tokyo")
    h = sign_in(client, u.email)
    # Sun 2026-01-18 15:30 UTC = Mon 19th 00:30 in Tokyo: belongs to the next week.
    clocked(db_session, u, p, t, utc(2026, 1, 18, 15, 30), utc(2026, 1, 18, 16, 30))
    assert get(client, h, WEEK).json()["rows"] == []
    b = get(client, h, "2026-01-19").json()
    assert day_of(b, "2026-01-19")["clocked_minutes"] == 60


# ---------- NFR-013 ----------


def test_nfr013_422_bodies_are_field_level_english(client, world):
    _, h, p, t = world
    bad = [
        cell(p, t, "2026-01-12", -1),
        cell(p, t, "2026-01-12", 2000),
        cell(p, t, "2026-01-12", "x"),
    ]
    for c in bad:
        r = put(client, h, [c])
        assert r.status_code == 422
        d = r.json()["detail"][0]
        assert d["loc"][:2] == ["body", "cells"] and d["loc"][-1] == "minutes"
        assert isinstance(d["msg"], str) and len(d["msg"]) > 8 and d["msg"][0].isupper()
    r = put(client, h, [{}])
    assert {x["loc"][-1] for x in r.json()["detail"]} >= {
        "project_id",
        "task_id",
        "billable",
        "date",
        "minutes",
    }
    assert all(x["msg"] for x in r.json()["detail"])
    r = get(client, h, "2026-01-13")
    assert "Monday" in r.json()["detail"][0]["msg"]
