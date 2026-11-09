"""US-006 QA: deactivating or editing a user keeps their time entries (AC-016, AC-015, NFR-014).

The earlier US-006 tests ran before the time_entries table existed, so they only showed that the
users row is kept. These tests check the entries themselves.
"""

from datetime import UTC, datetime

import pytest

from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"


def utc(*a):
    return datetime(*a, tzinfo=UTC)


def _wipe(db):
    db.rollback()
    for model in (Break, TimeEntry, Task, Project, Client, UserSession):
        db.query(model).delete()
    db.query(User).update({"manager_id": None})
    db.query(User).delete()
    db.commit()


@pytest.fixture(autouse=True)
def _clean(db_session):
    _wipe(db_session)
    yield
    _wipe(db_session)


def mk(db, email, role="Employee", name=None):
    u = User(
        full_name=name or email.split("@")[0],
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


@pytest.fixture
def world(client, db_session):
    admin = mk(db_session, "te006admin@example.com", "System Admin", "Ann Admin")
    worker = mk(db_session, "te006worker@example.com", name="Wendy Worker")
    c = Client(name="TE006 Client")
    db_session.add(c)
    db_session.flush()
    p = Project(client_id=c.id, name="TE006 Project", bill_rate=55)
    db_session.add(p)
    db_session.flush()
    t = Task(project_id=p.id, name="TE006 Task")
    db_session.add(t)
    db_session.flush()
    open_ = TimeEntry(
        user_id=worker.id,
        project_id=p.id,
        task_id=t.id,
        billable=False,
        start_at=utc(2026, 1, 13, 9, 0),
        end_at=None,
    )
    db_session.add(open_)
    db_session.flush()
    brk = Break(
        time_entry_id=open_.id, start_at=utc(2026, 1, 13, 12, 0), end_at=utc(2026, 1, 13, 12, 30)
    )
    db_session.add(brk)
    db_session.commit()
    return admin, sign_in(client, admin.email), worker, open_, brk


def snapshot(db, user_id):
    db.expire_all()
    rows = db.query(TimeEntry).filter(TimeEntry.user_id == user_id).order_by(TimeEntry.id).all()
    entries = [(e.id, e.project_id, e.task_id, e.billable, e.start_at, e.end_at) for e in rows]
    breaks = [
        (b.id, b.time_entry_id, b.start_at, b.end_at)
        for b in db.query(Break)
        .filter(Break.time_entry_id.in_([e.id for e in rows]))
        .order_by(Break.id)
        .all()
    ]
    return entries, breaks


def test_ac016_nfr014_deactivating_keeps_every_time_entry_and_break_unchanged(
    client, db_session, world
):
    _, c, worker, open_, _ = world
    before = snapshot(db_session, worker.id)
    assert len(before[0]) == 1 and len(before[1]) == 1

    r = client.post(f"/api/admin/users/{worker.id}/deactivate", headers=c)
    assert r.status_code == 200 and r.json()["is_active"] is False

    after = snapshot(db_session, worker.id)
    assert after == before
    # The still-open entry (and its break) is neither closed nor deleted by deactivation.
    assert db_session.get(TimeEntry, open_.id).end_at is None


def test_ac016_deactivated_user_cannot_use_old_token_or_sign_in_but_entries_remain(
    client, db_session, world
):
    _, c, worker, _, _ = world
    worker_headers = sign_in(client, worker.email)
    assert client.get("/api/clock/status", headers=worker_headers).status_code == 200

    assert client.post(f"/api/admin/users/{worker.id}/deactivate", headers=c).status_code == 200

    assert client.get("/api/clock/status", headers=worker_headers).status_code == 401
    r = client.post("/api/auth/login", json={"email": worker.email, "password": PW}, headers=H)
    assert r.status_code == 401
    assert len(snapshot(db_session, worker.id)[0]) == 1


def test_ac016_deactivating_one_user_leaves_another_users_entries_alone(client, db_session, world):
    _, c, worker, entry, _ = world
    other = mk(db_session, "te006other@example.com", name="Olive Other")
    db_session.add(
        TimeEntry(
            user_id=other.id,
            project_id=entry.project_id,
            task_id=entry.task_id,
            billable=True,
            start_at=utc(2026, 1, 14, 9, 0),
            end_at=utc(2026, 1, 14, 10, 0),
        )
    )
    db_session.commit()
    before = snapshot(db_session, other.id)

    assert client.post(f"/api/admin/users/{worker.id}/deactivate", headers=c).status_code == 200
    assert snapshot(db_session, other.id) == before
    assert other.is_active


def test_ac015_nfr014_editing_name_role_and_time_zone_keeps_time_entries(client, db_session, world):
    _, c, worker, _, _ = world
    before = snapshot(db_session, worker.id)
    r = client.patch(
        f"/api/admin/users/{worker.id}",
        json={"full_name": "Wendy Renamed", "role": "Payroll Admin", "time_zone": "Europe/Paris"},
        headers=c,
    )
    assert r.status_code == 200
    assert r.json()["full_name"] == "Wendy Renamed"
    assert r.json()["time_zone"] == "Europe/Paris"
    assert snapshot(db_session, worker.id) == before


def test_ac015_manager_change_applies_on_next_request_and_keeps_time_entries(
    client, db_session, world
):
    _, c, worker, _, _ = world
    boss = mk(db_session, "te006boss@example.com", "Manager", "Bea Boss")
    before = snapshot(db_session, worker.id)
    r = client.patch(f"/api/admin/users/{worker.id}", json={"manager_id": boss.id}, headers=c)
    assert r.status_code == 200 and r.json()["manager_id"] == boss.id
    listed = {u["id"]: u for u in client.get("/api/admin/users", headers=c).json()}
    assert listed[worker.id]["manager_id"] == boss.id
    assert snapshot(db_session, worker.id) == before
