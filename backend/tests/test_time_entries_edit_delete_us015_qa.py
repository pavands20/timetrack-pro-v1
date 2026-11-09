"""QA for US-015: PATCH/DELETE /api/time-entries/{id} (AC-039, AC-040, AC-041, NFR-003/007).

Real PostgreSQL via conftest. NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user
load) are deployment concerns and cannot be tested here.
"""

from datetime import UTC, datetime

import pytest
from sqlalchemy import text

from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
WEEK = "2026-01-12"
NEXT_WEEK = "2026-01-19"
NOT_FOUND = {"detail": "Time entry not found."}


def utc(*a):
    return datetime(*a, tzinfo=UTC)


@pytest.fixture(autouse=True)
def _clean(db_session):
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db_session.query(model).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


def mk_user(db, email, role="Employee"):
    u = User(
        full_name=email.split("@")[0],
        email=email,
        role=role,
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


def catalogue(db, tag="a"):
    c = Client(name=f"ED Client {tag}")
    db.add(c)
    db.flush()
    p = Project(client_id=c.id, name=f"ED Proj {tag}", bill_rate=10)
    db.add(p)
    db.flush()
    t = Task(project_id=p.id, name=f"ED Task {tag}")
    db.add(t)
    db.commit()
    return c, p, t


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "ed.emp@example.com")
    c, p, t = catalogue(db_session)
    return u, sign_in(client, u.email), c, p, t


def put(client, h, p, t, day, minutes, billable=True, extra=()):
    """PUT /cells replaces the whole week, so send every cell of a test in one call."""
    cells = [
        {"project_id": pp.id, "task_id": tt.id, "billable": billable, "date": d, "minutes": m}
        for pp, tt, d, m in [(p, t, day, minutes), *extra]
    ]
    r = client.put("/api/timesheets/cells", json={"week_start": WEEK, "cells": cells}, headers=h)
    assert r.status_code == 200, r.text
    return r


def week(client, h, w=WEEK):
    r = client.get(f"/api/timesheets/{w}", headers=h)
    assert r.status_code == 200
    return r.json()


def manual(client, h, p, t, day="2026-01-12", minutes=120, billable=True, extra=()):
    put(client, h, p, t, day, minutes, billable, extra)
    return next(
        e
        for e in week(client, h)["entries"]
        if e["date"] == day and e["project_id"] == p.id and e["task_id"] == t.id
    )


def clocked(db, u, p, t, start, end, breaks=(), open_=False):
    e = TimeEntry(
        user_id=u.id,
        project_id=p.id,
        task_id=t.id,
        billable=True,
        start_at=start,
        end_at=None if open_ else end,
    )
    db.add(e)
    db.flush()
    for bs, be in breaks:
        db.add(Break(time_entry_id=e.id, start_at=bs, end_at=be))
    db.commit()
    return e


def patch(client, h, eid, body):
    return client.patch(f"/api/time-entries/{eid}", json=body, headers=h)


def rows(db):
    db.expire_all()
    return db.execute(text("SELECT * FROM time_entries ORDER BY id")).all()


def has_msg(r, field):
    return any(
        x["loc"] == ["body", field] and isinstance(x["msg"], str) and len(x["msg"]) > 5
        for x in r.json()["detail"]
    )


# ---------- AC-039 ----------


def test_ac039_patch_hours_and_day_recalculate_totals(client, world):
    _, h, c, p, t = world
    e = manual(client, h, p, t, "2026-01-12", 120)
    r = patch(client, h, e["id"], {"minutes": 90, "work_date": "2026-01-14"})
    assert r.status_code == 200, r.text
    assert r.json() == {
        "id": e["id"],
        "project_id": p.id,
        "task_id": t.id,
        "billable": True,
        "source": "manual",
        "work_date": "2026-01-14",
        "minutes": 90,
    }
    b = week(client, h)
    assert b["day_totals_minutes"] == [0, 0, 90, 0, 0, 0, 0]
    assert b["week_total_minutes"] == 90
    assert [(x["id"], x["date"], x["minutes"]) for x in b["entries"]] == [
        (e["id"], "2026-01-14", 90)
    ]


def test_ac039_move_to_another_week(client, world):
    _, h, c, p, t = world
    e = manual(client, h, p, t, "2026-01-12", 60)
    assert patch(client, h, e["id"], {"work_date": "2026-01-20"}).status_code == 200
    assert week(client, h)["week_total_minutes"] == 0
    assert week(client, h)["entries"] == []
    nxt = week(client, h, NEXT_WEEK)
    assert nxt["week_total_minutes"] == 60 and nxt["entries"][0]["id"] == e["id"]


def test_ac039_patch_project_task_billable(client, world, db_session):
    _, h, c, p, t = world
    p2 = Project(client_id=c.id, name="ED Proj 2", bill_rate=5)
    db_session.add(p2)
    db_session.flush()
    t2 = Task(project_id=p2.id, name="ED Task 2")
    db_session.add(t2)
    db_session.commit()
    e = manual(client, h, p, t)
    r = patch(client, h, e["id"], {"project_id": p2.id, "task_id": t2.id, "billable": False})
    assert r.status_code == 200, r.text
    assert (r.json()["project_id"], r.json()["task_id"], r.json()["billable"]) == (
        p2.id,
        t2.id,
        False,
    )
    got = week(client, h)["entries"][0]
    assert got["project_name"] == "ED Proj 2" and got["task_name"] == "ED Task 2"
    assert got["billable"] is False


def test_ac039_clocked_entry_accepts_project_task_billable(client, world, db_session):
    u, h, c, p, t = world
    t2 = Task(project_id=p.id, name="ED Task B")
    db_session.add(t2)
    db_session.commit()
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 11, 0))
    r = patch(client, h, e.id, {"task_id": t2.id, "billable": False})
    assert r.status_code == 200, r.text
    assert r.json()["source"] == "clock" and r.json()["task_id"] == t2.id
    assert r.json()["billable"] is False and r.json()["minutes"] == 120


@pytest.mark.parametrize(
    "body,field", [({"work_date": "2026-01-14"}, "work_date"), ({"minutes": 30}, "minutes")]
)
def test_ac039_clocked_entry_422_on_date_or_minutes(client, world, db_session, body, field):
    u, h, c, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 11, 0))
    before = rows(db_session)
    r = patch(client, h, e.id, body)
    assert r.status_code == 422
    assert has_msg(r, field)
    assert rows(db_session) == before


@pytest.mark.parametrize("field", ["work_date", "minutes", "project_id", "task_id"])
def test_ac039_running_entry_409(client, world, db_session, field):
    u, h, c, p, t = world
    t2 = Task(project_id=p.id, name="ED Task R")
    db_session.add(t2)
    db_session.commit()
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), None, open_=True)
    before = rows(db_session)
    body = {
        "work_date": {"work_date": "2026-01-14"},
        "minutes": {"minutes": 30},
        "project_id": {"project_id": p.id},
        "task_id": {"task_id": t2.id},
    }[field]
    r = patch(client, h, e.id, body)
    assert r.status_code == 409
    assert r.json() == {"detail": "Clock out before editing this entry."}
    assert rows(db_session) == before


def test_ac039_running_entry_accepts_billable(client, world, db_session):
    u, h, c, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), None, open_=True)
    r = patch(client, h, e.id, {"billable": False})
    assert r.status_code == 200, r.text
    assert r.json()["billable"] is False
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).billable is False


@pytest.mark.parametrize(
    "body,field",
    [
        ({"minutes": -1}, "minutes"),
        ({"minutes": 1441}, "minutes"),
        ({"minutes": "abc"}, "minutes"),
        ({"work_date": "not-a-date"}, "work_date"),
        ({"billable": "maybe"}, "billable"),
        ({"project_id": 999999}, "project_id"),
        ({"task_id": 999999}, "task_id"),
    ],
)
def test_ac039_bad_values_422_field_level_nothing_changed(client, world, db_session, body, field):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    before = rows(db_session)
    r = patch(client, h, e["id"], body)
    assert r.status_code == 422, r.text
    assert has_msg(r, field)
    assert rows(db_session) == before


def test_ac039_empty_body_422(client, world, db_session):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    before = rows(db_session)
    assert patch(client, h, e["id"], {}).status_code == 422
    assert rows(db_session) == before


def test_ac039_task_of_other_project_422(client, world, db_session):
    _, h, c, p, t = world
    _, p2, t2 = catalogue(db_session, "other")
    e = manual(client, h, p, t)
    before = rows(db_session)
    assert patch(client, h, e["id"], {"task_id": t2.id}).status_code == 422
    assert rows(db_session) == before


def test_ac039_archived_task_and_client_422(client, world, db_session):
    _, h, c, p, t = world
    t2 = Task(project_id=p.id, name="Archived T", is_archived=True)
    db_session.add(t2)
    c2 = Client(name="Archived C", is_archived=True)
    db_session.add(c2)
    db_session.flush()
    p3 = Project(client_id=c2.id, name="Arch Proj", bill_rate=1)
    db_session.add(p3)
    db_session.flush()
    t3 = Task(project_id=p3.id, name="Arch Proj Task")
    db_session.add(t3)
    db_session.commit()
    e = manual(client, h, p, t)
    before = rows(db_session)
    r = patch(client, h, e["id"], {"task_id": t2.id})
    assert r.status_code == 422 and has_msg(r, "task_id")
    r = patch(client, h, e["id"], {"project_id": p3.id, "task_id": t3.id})
    assert r.status_code == 422 and has_msg(r, "project_id")
    assert rows(db_session) == before


def test_ac039_day_over_24h_422_nothing_changed(client, world, db_session):
    _, h, c, p, t = world
    t2 = Task(project_id=p.id, name="ED Task C")
    db_session.add(t2)
    db_session.commit()
    e = manual(client, h, p, t, "2026-01-13", 600, extra=[(p, t2, "2026-01-12", 1000)])
    before = rows(db_session)
    r = patch(client, h, e["id"], {"work_date": "2026-01-12"})
    assert r.status_code == 422 and has_msg(r, "minutes")
    assert rows(db_session) == before


def test_ac039_cell_collision_409_nothing_changed(client, world, db_session):
    _, h, c, p, t = world
    e2 = manual(client, h, p, t, "2026-01-13", 30, extra=[(p, t, "2026-01-12", 60)])
    before = rows(db_session)
    r = patch(client, h, e2["id"], {"work_date": "2026-01-12"})
    assert r.status_code == 409 and isinstance(r.json()["detail"], str)
    assert rows(db_session) == before


def test_ac039_boundaries_0_and_1440_accepted(client, world):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    assert patch(client, h, e["id"], {"minutes": 1440}).status_code == 200
    assert patch(client, h, e["id"], {"minutes": 0}).status_code == 200


# ---------- AC-040 ----------


def test_ac040_delete_manual_204_totals_and_entries_update(client, world, db_session):
    _, h, c, p, t = world
    e = manual(client, h, p, t, "2026-01-12", 120, extra=[(p, t, "2026-01-13", 30)])
    keep = next(x for x in week(client, h)["entries"] if x["date"] == "2026-01-13")
    r = client.delete(f"/api/time-entries/{e['id']}", headers=h)
    assert r.status_code == 204 and r.content == b""
    b = week(client, h)
    assert [x["id"] for x in b["entries"]] == [keep["id"]]
    assert b["week_total_minutes"] == 30
    db_session.expire_all()
    assert db_session.get(TimeEntry, e["id"]) is None


def test_ac040_delete_clocked_entry_removes_its_breaks(client, world, db_session):
    u, h, c, p, t = world
    e = clocked(
        db_session,
        u,
        p,
        t,
        utc(2026, 1, 13, 9, 0),
        utc(2026, 1, 13, 17, 0),
        breaks=[(utc(2026, 1, 13, 12, 0), utc(2026, 1, 13, 12, 30))],
    )
    eid = e.id
    assert db_session.query(Break).filter_by(time_entry_id=eid).count() == 1
    assert client.delete(f"/api/time-entries/{eid}", headers=h).status_code == 204
    db_session.expire_all()
    assert db_session.query(Break).filter_by(time_entry_id=eid).count() == 0
    assert db_session.get(TimeEntry, eid) is None
    b = week(client, h)
    assert b["week_total_minutes"] == 0 and b["entries"] == []


def test_ac040_running_entry_409_nothing_deleted(client, world, db_session):
    u, h, c, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), None, open_=True)
    r = client.delete(f"/api/time-entries/{e.id}", headers=h)
    assert r.status_code == 409 and r.json() == {"detail": "Clock out before deleting this entry."}
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id) is not None


def test_ac040_second_delete_404(client, world):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    assert client.delete(f"/api/time-entries/{e['id']}", headers=h).status_code == 204
    r = client.delete(f"/api/time-entries/{e['id']}", headers=h)
    assert r.status_code == 404 and r.json() == NOT_FOUND


def test_ac040_unknown_id_404_for_patch_and_delete(client, world):
    _, h, *_ = world
    r = client.delete("/api/time-entries/999999", headers=h)
    assert r.status_code == 404 and r.json() == NOT_FOUND
    r = patch(client, h, 999999, {"billable": True})
    assert r.status_code == 404 and r.json() == NOT_FOUND


# ---------- AC-041 / NFR-003 / NFR-007 ----------


@pytest.fixture
def other(client, db_session):
    u = mk_user(db_session, "ed.other@example.com")
    return u, sign_in(client, u.email)


def test_ac041_nfr003_other_employee_gets_identical_404_and_entry_unchanged(
    client, world, other, db_session
):
    _, h, c, p, t = world
    _, oh = other
    e = manual(client, h, p, t, "2026-01-12", 120)
    before = rows(db_session)
    unknown = client.delete("/api/time-entries/999999", headers=oh)
    r1 = patch(client, oh, e["id"], {"minutes": 5, "billable": False})
    r2 = client.delete(f"/api/time-entries/{e['id']}", headers=oh)
    assert r1.status_code == 404 and r2.status_code == 404
    assert r1.json() == NOT_FOUND and r2.json() == NOT_FOUND
    assert r2.content == unknown.content
    assert rows(db_session) == before
    assert week(client, h)["entries"][0]["minutes"] == 120
    assert week(client, oh)["entries"] == []


def test_ac041_other_users_clocked_and_running_entries_also_404(client, world, other, db_session):
    u, h, c, p, t = world
    _, oh = other
    closed = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    third = mk_user(db_session, "ed.third@example.com")
    running = clocked(db_session, third, p, t, utc(2026, 1, 14, 9, 0), None, open_=True)
    before = rows(db_session)
    for e in (closed, running):
        assert patch(client, oh, e.id, {"billable": False}).status_code == 404
        assert client.delete(f"/api/time-entries/{e.id}", headers=oh).status_code == 404
    assert rows(db_session) == before


def test_ac041_401_without_session_and_nothing_changes(client, world, db_session):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    before = rows(db_session)
    r1 = client.patch(f"/api/time-entries/{e['id']}", json={"minutes": 1}, headers=H)
    r2 = client.delete(f"/api/time-entries/{e['id']}", headers=H)
    assert r1.status_code == 401 and r2.status_code == 401
    assert "ED Proj" not in r1.text + r2.text
    assert rows(db_session) == before


def test_ac041_403_without_csrf_header_and_nothing_changes(client, world, db_session):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    before = rows(db_session)
    bearer = {"Authorization": h["Authorization"]}
    r1 = client.patch(f"/api/time-entries/{e['id']}", json={"minutes": 1}, headers=bearer)
    r2 = client.delete(f"/api/time-entries/{e['id']}", headers=bearer)
    assert r1.status_code == 403 and r2.status_code == 403
    assert rows(db_session) == before


@pytest.mark.parametrize("role", ["Manager", "Payroll Admin", "System Admin"])
def test_ac041_nfr003_other_roles_get_no_extra_access(client, world, db_session, role):
    _, h, c, p, t = world
    e = manual(client, h, p, t)
    mk_user(db_session, "ed.role@example.com", role)
    rh = sign_in(client, "ed.role@example.com")
    before = rows(db_session)
    r1 = patch(client, rh, e["id"], {"minutes": 5})
    r2 = client.delete(f"/api/time-entries/{e['id']}", headers=rh)
    assert r1.status_code == 404 and r1.json() == NOT_FOUND
    assert r2.status_code == 404 and r2.json() == NOT_FOUND
    assert rows(db_session) == before


# ---------- Regression ----------


def test_existing_patch_billable_and_timesheet_still_work(client, world, db_session):
    u, h, c, p, t = world
    e = clocked(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    r = patch(client, h, e.id, {"billable": False})
    assert r.status_code == 200 and r.json()["billable"] is False
    b = week(client, h)
    assert b["week_total_minutes"] == 60
    assert set(b) >= {"rows", "day_totals_minutes", "week_total_minutes", "entries"}
    assert b["entries"][0]["source"] == "clock" and b["entries"][0]["minutes"] == 60
