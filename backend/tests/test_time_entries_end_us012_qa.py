"""QA for US-012 entry recovery: PATCH /api/time-entries/{id}/end.

Covers AC-031, AC-032, NFR-009 and NFR-013.

Real PostgreSQL. NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user load) are
deployment concerns and cannot be tested in this suite; NFR-007 is shown by the 401/404 tests.
"""

from datetime import UTC, datetime, timedelta

import pytest

from app.models import Break, Client, Project, Task, TimeEntry, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
AFTER_START = "End time must be after the start time."


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


@pytest.fixture
def world(client, db_session):
    u = mk_user(db_session, "rec.emp@example.com")
    c = Client(name="Rec Client")
    db_session.add(c)
    db_session.flush()
    p = Project(client_id=c.id, name="Rec Proj", bill_rate=10)
    db_session.add(p)
    db_session.flush()
    t = Task(project_id=p.id, name="Rec Task")
    db_session.add(t)
    db_session.commit()
    return u, sign_in(client, u.email), p, t


def entry(db, u, p, t, start, end=None, breaks=()):
    e = TimeEntry(
        user_id=u.id, project_id=p.id, task_id=t.id, billable=True, start_at=start, end_at=end
    )
    db.add(e)
    db.flush()
    for bs, be in breaks:
        db.add(Break(time_entry_id=e.id, start_at=bs, end_at=be))
    db.commit()
    return e


def iso(dt):
    return dt.isoformat()


def patch(client, h, eid, end_at):
    return client.patch(f"/api/time-entries/{eid}/end", json={"end_at": end_at}, headers=h)


def still_open(db, eid):
    db.expire_all()
    return db.get(TimeEntry, eid).end_at is None


def yesterday_start():
    return (datetime.now(UTC) - timedelta(days=1)).replace(microsecond=0, second=0)


def test_ac031_stale_entry_closed_net_of_breaks(client, db_session, world):
    u, h, p, t = world
    start = utc(2026, 1, 13, 9, 0)
    e = entry(
        db_session, u, p, t, start, breaks=[(utc(2026, 1, 13, 12, 0), utc(2026, 1, 13, 12, 30))]
    )
    r = patch(client, h, e.id, iso(utc(2026, 1, 13, 17, 0)))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["duration_minutes"] == 450
    assert j["work_date"] == "2026-01-13"
    assert j["end_at"] == "2026-01-13T17:00:00Z"
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).end_at.astimezone(UTC) == utc(2026, 1, 13, 17, 0)
    assert client.get("/api/clock/status", headers=h).json() == {"entry": None}


def test_ac031_open_break_closed_at_end_at(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0), breaks=[(utc(2026, 1, 13, 15, 0), None)])
    r = patch(client, h, e.id, iso(utc(2026, 1, 13, 16, 0)))
    assert r.status_code == 200, r.text
    assert r.json()["duration_minutes"] == 360  # 7h less the 1h break
    db_session.expire_all()
    b = db_session.query(Break).one()
    assert b.end_at is not None and b.end_at.astimezone(UTC) == utc(2026, 1, 13, 16, 0)
    assert db_session.query(Break).filter(Break.end_at.is_(None)).count() == 0


def test_ac031_offset_end_at_is_converted_to_utc(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    r = patch(client, h, e.id, "2026-01-13T18:00:00+01:00")
    assert r.status_code == 200 and r.json()["end_at"] == "2026-01-13T17:00:00Z"


@pytest.mark.parametrize("delta", [timedelta(0), timedelta(minutes=-5), timedelta(days=-1)])
def test_ac032_end_not_after_start_422_entry_stays_open(client, db_session, world, delta):
    u, h, p, t = world
    start = utc(2026, 1, 13, 9, 0)
    e = entry(db_session, u, p, t, start)
    r = patch(client, h, e.id, iso(start + delta))
    assert r.status_code == 422
    d = r.json()["detail"][0]
    assert d["loc"] == ["body", "end_at"] and d["msg"] == AFTER_START
    assert still_open(db_session, e.id)


def test_ac032_future_end_422_entry_stays_open(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, yesterday_start())
    r = patch(client, h, e.id, iso(datetime.now(UTC) + timedelta(hours=2)))
    assert r.status_code == 422
    d = r.json()["detail"][0]
    assert d["loc"] == ["body", "end_at"] and "future" in d["msg"]
    assert still_open(db_session, e.id)


def test_ac032_end_before_last_break_422_nothing_changed(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0), breaks=[(utc(2026, 1, 13, 14, 0), None)])
    r = patch(client, h, e.id, iso(utc(2026, 1, 13, 13, 0)))
    assert r.status_code == 422
    d = r.json()["detail"][0]
    assert d["loc"] == ["body", "end_at"] and "break" in d["msg"]
    assert still_open(db_session, e.id)
    assert db_session.query(Break).one().end_at is None


@pytest.mark.parametrize(
    "value",
    ["not a date", "", "2026-01-13T17:00:00", "2026-13-45T10:00:00Z", 12345, None, [], True],
)
def test_ac032_malformed_value_422_field_level(client, db_session, world, value):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    r = patch(client, h, e.id, value)
    assert r.status_code == 422
    d = r.json()["detail"][0]
    assert d["loc"] == ["body", "end_at"] and isinstance(d["msg"], str) and len(d["msg"]) > 5
    assert still_open(db_session, e.id)


def test_ac032_missing_body_field_422(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    r = client.patch(f"/api/time-entries/{e.id}/end", json={}, headers=h)
    assert r.status_code == 422
    assert still_open(db_session, e.id)


def test_ac031_already_closed_409_unchanged(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    r = patch(client, h, e.id, iso(utc(2026, 1, 13, 18, 0)))
    assert r.status_code == 409 and isinstance(r.json()["detail"], str)
    db_session.expire_all()
    assert db_session.get(TimeEntry, e.id).end_at.astimezone(UTC) == utc(2026, 1, 13, 10, 0)


def test_ac031_second_patch_409(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    assert patch(client, h, e.id, iso(utc(2026, 1, 13, 10, 0))).status_code == 200
    assert patch(client, h, e.id, iso(utc(2026, 1, 13, 11, 0))).status_code == 409


def test_nfr007_unknown_entry_404(client, world):
    _, h, _, _ = world
    r = patch(client, h, 999999, iso(utc(2026, 1, 13, 10, 0)))
    assert r.status_code == 404


def test_nfr007_other_users_entry_404_no_data_and_unchanged(client, db_session, world):
    u, h, p, t = world
    other = mk_user(db_session, "rec.other@example.com")
    e = entry(db_session, other, p, t, utc(2026, 1, 13, 9, 0))
    r = patch(client, h, e.id, iso(utc(2026, 1, 13, 10, 0)))
    assert r.status_code == 404
    assert "rec.other" not in r.text and "Rec Proj" not in r.text and "2026" not in r.text
    assert still_open(db_session, e.id)


def test_nfr007_other_users_closed_entry_also_404_not_409(client, db_session, world):
    u, h, p, t = world
    other = mk_user(db_session, "rec.other2@example.com")
    e = entry(db_session, other, p, t, utc(2026, 1, 13, 9, 0), utc(2026, 1, 13, 10, 0))
    assert patch(client, h, e.id, iso(utc(2026, 1, 13, 11, 0))).status_code == 404


def test_nfr007_401_without_session(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    r = client.patch(
        f"/api/time-entries/{e.id}/end", json={"end_at": iso(utc(2026, 1, 13, 10, 0))}, headers=H
    )
    assert r.status_code == 401
    assert still_open(db_session, e.id)


def test_nfr009_spring_forward_recovery_local_times_and_duration(client, db_session, world):
    u, h, p, t = world  # Europe/London: clocks go forward at 01:00 UTC on 2025-03-30
    e = entry(db_session, u, p, t, utc(2025, 3, 30, 0, 30))
    r = patch(client, h, e.id, "2025-03-30T03:30:00+01:00")  # 03:30 BST local = 02:30 UTC
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["end_at"] == "2025-03-30T02:30:00Z"
    assert j["duration_minutes"] == 120  # elapsed time, not wall-clock difference of 3h
    assert j["work_date"] == "2025-03-30"


def test_nfr009_autumn_change_recovery_work_date_and_duration(client, db_session, world):
    u, h, p, t = world  # 23:30 UTC on the 25th is 00:30 BST on the 26th; clocks go back 01:00 UTC
    e = entry(db_session, u, p, t, utc(2025, 10, 25, 23, 30))
    r = patch(client, h, e.id, "2025-10-26T02:30:00+00:00")
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["duration_minutes"] == 180
    assert j["work_date"] == "2025-10-26"


def test_nfr009_late_utc_start_gets_next_local_work_date_in_summer(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2025, 7, 10, 23, 30))
    r = patch(client, h, e.id, iso(utc(2025, 7, 11, 0, 30)))
    assert r.status_code == 200
    assert r.json()["work_date"] == "2025-07-11" and r.json()["duration_minutes"] == 60


def test_nfr013_messages_are_field_level_english(client, db_session, world):
    u, h, p, t = world
    e = entry(db_session, u, p, t, utc(2026, 1, 13, 9, 0))
    for value in (
        iso(utc(2026, 1, 13, 8, 0)),
        "garbage",
        iso(datetime.now(UTC) + timedelta(days=1)),
    ):
        r = patch(client, h, e.id, value)
        assert r.status_code == 422
        d = r.json()["detail"]
        assert d[0]["loc"] == ["body", "end_at"]
        assert d[0]["msg"].endswith(".") and d[0]["msg"][0].isupper()
