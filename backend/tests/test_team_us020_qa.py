"""QA for US-020 team endpoints and reporting-line access (AC-052..AC-063).

Real PostgreSQL through conftest. No application code is modified.
"""

from datetime import UTC, datetime

import pytest
from sqlalchemy import text

from app.main import app
from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
LIST = "/api/team/members"


def utc(*a):
    return datetime(*a, tzinfo=UTC)


def week_url(uid, week="2026-01-12"):
    return f"/api/team/members/{uid}/timesheets/{week}"


@pytest.fixture(autouse=True)
def _clean(db_session):
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db_session.query(model).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


def mk(db, email, role="Employee", tz="Europe/London", **kw):
    u = User(
        full_name=email.split("@")[0],
        email=email,
        role=role,
        time_zone=tz,
        password_hash=hash_password(PW),
        **kw,
    )
    db.add(u)
    db.commit()
    return u


def sign_in(client, email):
    r = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H)
    assert r.status_code == 200
    return {"Authorization": "Bearer " + r.json()["token"], **H}


@pytest.fixture
def cat(db_session):
    c = Client(name="Team Client")
    db_session.add(c)
    db_session.flush()
    p = Project(client_id=c.id, name="Team Proj", bill_rate=10)
    db_session.add(p)
    db_session.flush()
    t = Task(project_id=p.id, name="Team Task")
    db_session.add(t)
    db_session.commit()
    return p, t


def entry(db, u, cat, start, end, billable=True):
    p, t = cat
    e = TimeEntry(
        user_id=u.id,
        project_id=p.id,
        task_id=t.id,
        billable=billable,
        start_at=start,
        end_at=end,
    )
    db.add(e)
    db.commit()
    return e


@pytest.fixture
def org(client, db_session):
    mgr = mk(db_session, "tm.mgr@example.com", "Manager")
    mgr2 = mk(db_session, "tm.mgr2@example.com", "Manager")
    r1 = mk(db_session, "tm.r1@example.com", manager_id=mgr.id)
    r2 = mk(db_session, "tm.r2@example.com", manager_id=mgr.id, tz="Asia/Tokyo")
    other = mk(db_session, "tm.other@example.com", manager_id=mgr2.id)
    loner = mk(db_session, "tm.loner@example.com")
    return {
        "mgr": mgr,
        "mgr2": mgr2,
        "r1": r1,
        "r2": r2,
        "other": other,
        "loner": loner,
        "h": sign_in(client, mgr.email),
    }


def snap(db):
    db.expire_all()
    return (
        db.execute(text("SELECT * FROM time_entries ORDER BY id")).all(),
        db.execute(text("SELECT * FROM breaks ORDER BY id")).all(),
    )


# ---------- AC-052 / AC-054 ----------


def test_ac052_lists_only_active_direct_reports_with_name_and_time_zone(client, org):
    r = client.get(LIST, headers=org["h"])
    assert r.status_code == 200
    rows = r.json()
    assert {x["id"] for x in rows} == {org["r1"].id, org["r2"].id}
    by = {x["id"]: x for x in rows}
    assert by[org["r1"].id]["name"] == org["r1"].full_name
    assert by[org["r1"].id]["time_zone"] == "Europe/London"
    assert by[org["r2"].id]["time_zone"] == "Asia/Tokyo"
    assert org["other"].email not in r.text and org["loner"].email not in r.text


def test_ac054_manager_without_active_reports_gets_empty_list(client, db_session, org):
    mk(db_session, "tm.empty@example.com", "Manager")
    r = client.get(LIST, headers=sign_in(client, "tm.empty@example.com"))
    assert r.status_code == 200 and r.json() == []
    # a Manager whose only report is deactivated also gets an empty list
    org["other"].is_active = False
    db_session.commit()
    r = client.get(LIST, headers=sign_in(client, org["mgr2"].email))
    assert r.status_code == 200 and r.json() == []


# ---------- AC-053 / AC-062 / AC-061 ----------


def deactivate(client, db_session, uid):
    mk(db_session, f"tm.adm{uid}@example.com", "System Admin")
    a = sign_in(client, f"tm.adm{uid}@example.com")
    r = client.post(f"/api/admin/users/{uid}/deactivate", headers=a)
    assert r.status_code == 200
    return a


def test_ac053_ac062_deactivated_report_gone_from_list_and_403_on_timesheet(
    client, db_session, org
):
    h = org["h"]
    assert client.get(week_url(org["r1"].id), headers=h).status_code == 200
    deactivate(client, db_session, org["r1"].id)
    r = client.get(LIST, headers=h)
    assert r.status_code == 200
    assert [x["id"] for x in r.json()] == [org["r2"].id]
    r = client.get(week_url(org["r1"].id), headers=h)
    assert r.status_code == 403 and org["r1"].email not in r.text


def test_ac062_role_change_away_from_manager_is_403_next_request(client, db_session, org):
    h = org["h"]
    assert client.get(LIST, headers=h).status_code == 200
    db_session.query(User).filter_by(id=org["mgr"].id).update({"role": "Employee"})
    db_session.commit()
    for url in (LIST, week_url(org["r1"].id)):
        r = client.get(url, headers=h)
        assert r.status_code == 403 and org["r1"].email not in r.text


def test_ac062_deactivated_manager_is_401_next_request(client, db_session, org):
    h = org["h"]
    assert client.get(LIST, headers=h).status_code == 200
    deactivate(client, db_session, org["mgr"].id)
    assert client.get(LIST, headers=h).status_code == 401
    assert client.get(week_url(org["r1"].id), headers=h).status_code == 401


def test_ac061_reassignment_moves_access_with_same_sessions(client, db_session, org):
    ha = org["h"]
    hb = sign_in(client, org["mgr2"].email)
    assert client.get(week_url(org["r1"].id), headers=ha).status_code == 200
    assert client.get(week_url(org["r1"].id), headers=hb).status_code == 403
    mk(db_session, "tm.admin@example.com", "System Admin")
    a = sign_in(client, "tm.admin@example.com")
    r = client.patch(
        f"/api/admin/users/{org['r1'].id}", json={"manager_id": org["mgr2"].id}, headers=a
    )
    assert r.status_code == 200
    r = client.get(week_url(org["r1"].id), headers=ha)
    assert r.status_code == 403 and org["r1"].email not in r.text
    assert org["r1"].id not in [x["id"] for x in client.get(LIST, headers=ha).json()]
    assert client.get(week_url(org["r1"].id), headers=hb).status_code == 200
    assert org["r1"].id in [x["id"] for x in client.get(LIST, headers=hb).json()]


# ---------- AC-055 / AC-056 ----------


def test_ac055_week_shape_and_billable_split(client, db_session, org, cat):
    entry(db_session, org["r1"], cat, utc(2026, 1, 12, 9, 0), utc(2026, 1, 12, 11, 0), True)
    entry(db_session, org["r1"], cat, utc(2026, 1, 14, 9, 0), utc(2026, 1, 14, 9, 30), False)
    r = client.get(week_url(org["r1"].id), headers=org["h"])
    assert r.status_code == 200
    j = r.json()
    assert j["week_start"] == "2026-01-12" and j["week_end"] == "2026-01-18"
    assert len(j["day_totals_minutes"]) == 7
    assert "rows" in j and "entries" in j
    assert j["week_total_minutes"] == 150 == sum(j["day_totals_minutes"])
    assert j["billable_minutes"] == 120 and j["non_billable_minutes"] == 30
    assert j["billable_minutes"] + j["non_billable_minutes"] == j["week_total_minutes"]
    assert j["day_totals_minutes"][0] == 120 and j["day_totals_minutes"][2] == 30


@pytest.mark.parametrize("week", ["2026-01-13", "2026-01-18", "garbage"])
def test_ac055_non_monday_week_start_422(client, org, week):
    assert client.get(week_url(org["r1"].id, week), headers=org["h"]).status_code == 422


def test_ac056_report_time_zone_drives_response_and_day_attribution(client, db_session, org, cat):
    # Manager is London; report r2 is Tokyo. 20:00 UTC Wed = 05:00 Thu in Tokyo.
    entry(db_session, org["r2"], cat, utc(2026, 1, 14, 20, 0), utc(2026, 1, 14, 21, 0))
    j = client.get(week_url(org["r2"].id), headers=org["h"]).json()
    assert j["time_zone"] == "Asia/Tokyo"
    assert j["day_totals_minutes"][2] == 0 and j["day_totals_minutes"][3] == 60


def test_ac056_late_utc_sunday_entry_lands_in_next_local_week(client, db_session, org, cat):
    # Sun 12 Jul 23:30 UTC = Mon 13 Jul 08:30 in Tokyo.
    entry(db_session, org["r2"], cat, utc(2026, 7, 12, 23, 30), utc(2026, 7, 13, 0, 30))
    prev = client.get(week_url(org["r2"].id, "2026-07-06"), headers=org["h"]).json()
    nxt = client.get(week_url(org["r2"].id, "2026-07-13"), headers=org["h"]).json()
    assert prev["week_total_minutes"] == 0
    assert nxt["day_totals_minutes"][0] == 60


def test_ac056_dst_week_follows_report_zone(client, db_session, org, cat):
    # London spring-forward Sun 29 Mar 2026 01:00 UTC. Report in London, manager elsewhere.
    mgr = mk(db_session, "tm.ny@example.com", "Manager", tz="America/New_York")
    rep = mk(db_session, "tm.lon@example.com", manager_id=mgr.id, tz="Europe/London")
    entry(db_session, rep, cat, utc(2026, 3, 28, 23, 30), utc(2026, 3, 29, 0, 30))
    entry(db_session, rep, cat, utc(2026, 3, 29, 0, 30), utc(2026, 3, 29, 1, 30))
    h = sign_in(client, mgr.email)
    j = client.get(week_url(rep.id, "2026-03-23"), headers=h).json()
    assert j["time_zone"] == "Europe/London"
    assert j["week_end"] == "2026-03-29"
    assert j["day_totals_minutes"][5] == 60 and j["day_totals_minutes"][6] == 60
    assert j["week_total_minutes"] == 120


# ---------- AC-058 ----------


def test_ac058_manager_writes_to_foreign_entries_are_403_and_change_nothing(
    client, db_session, org, cat
):
    e = entry(db_session, org["r1"], cat, utc(2026, 1, 12, 9, 0), utc(2026, 1, 12, 10, 0))
    openr = entry(db_session, org["r2"], cat, utc(2026, 1, 13, 9, 0), None)
    before = snap(db_session)
    h = org["h"]
    p, t = cat
    resps = [
        client.patch(f"/api/time-entries/{e.id}", json={"billable": False}, headers=h),
        client.delete(f"/api/time-entries/{e.id}", headers=h),
        client.patch(
            f"/api/time-entries/{openr.id}/end",
            json={"end_at": "2026-01-13T10:00:00Z"},
            headers=h,
        ),
        client.put(
            "/api/timesheets/cells",
            json={
                "week_start": "2026-01-12",
                "user_id": org["r1"].id,
                "cells": [
                    {
                        "project_id": p.id,
                        "task_id": t.id,
                        "billable": True,
                        "date": "2026-01-12",
                        "minutes": 60,
                    }
                ],
            },
            headers=h,
        ),
        client.post(
            "/api/clock/in",
            json={
                "project_id": p.id,
                "task_id": t.id,
                "billable": True,
                "user_id": org["r1"].id,
            },
            headers=h,
        ),
    ]
    for r in resps:
        assert r.status_code == 403, r.text
    assert snap(db_session) == before


def test_ac058_no_write_method_under_api_team(client, org):
    for route in app.routes:
        path = getattr(route, "path", "")
        if path.startswith("/api/team"):
            assert set(route.methods) <= {"GET", "HEAD"}, path
    for m in ("post", "put", "patch", "delete"):
        r = getattr(client, m)(LIST, headers=org["h"])
        assert r.status_code in (404, 405)


# ---------- AC-059 ----------


@pytest.mark.parametrize("who", ["other", "loner", "mgr2", "mgr"])
def test_ac059_non_report_is_403_without_data(client, org, who):
    r = client.get(week_url(org[who].id), headers=org["h"])
    assert r.status_code == 403
    assert org[who].email not in r.text and org[who].full_name not in r.text


def test_ac059_unknown_id_is_403(client, org):
    r = client.get(week_url(999999), headers=org["h"])
    assert r.status_code == 403 and "time_zone" not in r.text


# ---------- AC-060 / AC-063 ----------


@pytest.mark.parametrize("role", ["Employee", "Payroll Admin", "System Admin"])
def test_ac060_other_roles_get_403_on_both_team_endpoints(client, db_session, org, role):
    mk(db_session, "tm.x@example.com", role)
    h = sign_in(client, "tm.x@example.com")
    for url in (LIST, week_url(org["r1"].id)):
        r = client.get(url, headers=h)
        assert r.status_code == 403
        assert org["r1"].email not in r.text and "time_zone" not in r.text


def test_ac060_no_session_is_401(client, org):
    for url in (LIST, week_url(org["r1"].id)):
        assert client.get(url).status_code == 401


def test_ac063_employee_keeps_own_view_and_404_for_foreign_entry(client, db_session, org, cat):
    e_other = entry(db_session, org["r2"], cat, utc(2026, 1, 12, 9, 0), utc(2026, 1, 12, 10, 0))
    h = sign_in(client, org["r1"].email)
    mine = entry(db_session, org["r1"], cat, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    before = snap(db_session)
    j = client.get("/api/timesheets/2026-01-12", headers=h).json()
    assert j["week_total_minutes"] == 60
    assert client.get(LIST, headers=h).status_code == 403
    assert client.get(week_url(org["r2"].id), headers=h).status_code == 403
    r = client.patch(f"/api/time-entries/{e_other.id}", json={"billable": False}, headers=h)
    assert r.status_code == 404
    assert client.delete(f"/api/time-entries/{e_other.id}", headers=h).status_code == 404
    assert snap(db_session) == before
    r = client.patch(f"/api/time-entries/{mine.id}", json={"billable": False}, headers=h)
    assert r.status_code == 200
