"""US-006: edit and deactivate users (AC-015, AC-016, NFR-005, NFR-014)."""

import pytest
from sqlalchemy import inspect, text

from app.models import User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
LOGIN_FAIL = {"detail": "Incorrect email or password"}


@pytest.fixture(autouse=True)
def _clean(db_session):
    for t in ("password_reset_tokens", "password_resets"):
        if inspect(db_session.bind).has_table(t):
            db_session.execute(text(f"DELETE FROM {t}"))
    db_session.query(UserSession).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


def mk(db, email, role="Employee", name=None, **kw):
    u = User(
        full_name=name or email.split("@")[0],
        email=email,
        role=role,
        time_zone="Europe/London",
        password_hash=hash_password(PW),
        **kw,
    )
    db.add(u)
    db.commit()
    return u


def login(client, email, password=PW):
    return client.post("/api/auth/login", json={"email": email, "password": password}, headers=H)


def sign_in(client, email):
    r = login(client, email)
    assert r.status_code == 200
    return {"Authorization": "Bearer " + r.json()["token"]}


@pytest.fixture
def admin(client, db_session):
    u = mk(db_session, "us006admin@example.com", "System Admin", "Ann Admin")
    return u, sign_in(client, u.email)


def patch(client, c, uid, body):
    return client.patch(f"/api/admin/users/{uid}", json=body, headers={**c, **H})


def deactivate(client, c, uid):
    return client.post(f"/api/admin/users/{uid}/deactivate", headers={**c, **H})


def fields(r):
    return [d["loc"] for d in r.json()["detail"]]


# ---------- AC-015: edits are stored and apply from the next request ----------


def test_ac015_all_four_fields_changed_together_are_stored(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager", "Mia Manager")
    e = mk(db_session, "us006e@example.com", name="Old Name")
    r = patch(
        client,
        c,
        e.id,
        {
            "full_name": "  New Name ",
            "role": "Payroll Admin",
            "manager_id": mgr.id,
            "time_zone": "Europe/Berlin",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["full_name"] == "New Name"
    assert body["role"] == "Payroll Admin"
    assert body["manager_id"] == mgr.id
    assert body["time_zone"] == "Europe/Berlin"
    assert body["email"] == "us006e@example.com" and body["is_active"] is True
    assert "password_hash" not in body
    db_session.refresh(e)
    assert (e.full_name, e.role, e.manager_id, e.time_zone) == (
        "New Name",
        "Payroll Admin",
        mgr.id,
        "Europe/Berlin",
    )
    listed = client.get("/api/admin/users", headers=c).json()
    row = next(u for u in listed if u["id"] == e.id)
    assert row["full_name"] == "New Name" and row["time_zone"] == "Europe/Berlin"


def test_ac015_partial_patch_leaves_other_fields_alone(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager")
    e = mk(db_session, "us006e@example.com", name="Keep Me", manager_id=mgr.id)
    r = patch(client, c, e.id, {"time_zone": "Europe/Paris"})
    assert r.status_code == 200
    db_session.refresh(e)
    assert e.time_zone == "Europe/Paris"
    assert (e.full_name, e.role, e.manager_id) == ("Keep Me", "Employee", mgr.id)


def test_ac015_manager_can_be_cleared(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager")
    e = mk(db_session, "us006e@example.com", manager_id=mgr.id)
    r = patch(client, c, e.id, {"manager_id": None})
    assert r.status_code == 200 and r.json()["manager_id"] is None
    db_session.refresh(e)
    assert e.manager_id is None


def test_ac015_name_and_time_zone_show_on_the_users_next_request(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com", name="Before")
    ec = sign_in(client, e.email)
    before = client.get("/api/auth/me", headers=ec).json()
    assert before["full_name"] == "Before" and before["time_zone"] == "Europe/London"
    edit = {"full_name": "After", "time_zone": "Europe/Dublin"}
    assert patch(client, c, e.id, edit).status_code == 200
    # Same token, no new sign-in.
    after = client.get("/api/auth/me", headers=ec)
    assert after.status_code == 200
    assert after.json()["full_name"] == "After"
    assert after.json()["time_zone"] == "Europe/Dublin"


def test_ac015_promotion_applies_on_the_next_request_without_new_sign_in(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com")
    ec = sign_in(client, e.email)
    assert client.get("/api/admin/users", headers=ec).status_code == 403
    assert patch(client, c, e.id, {"role": "System Admin"}).status_code == 200
    assert client.get("/api/admin/users", headers=ec).status_code == 200
    assert client.get("/api/auth/me", headers=ec).json()["role"] == "System Admin"


def test_ac015_demotion_removes_admin_access_on_the_next_request(client, db_session, admin):
    _, c = admin
    second = mk(db_session, "us006admin2@example.com", "System Admin")
    sc = sign_in(client, second.email)
    assert client.get("/api/admin/users", headers=sc).status_code == 200
    assert patch(client, c, second.id, {"role": "Employee"}).status_code == 200
    r = client.get("/api/admin/users", headers=sc)
    assert r.status_code == 403
    assert "us006admin@example.com" not in r.text


@pytest.mark.parametrize(
    "body,field",
    [
        ({"time_zone": "Mars/Olympus"}, "time_zone"),
        ({"role": "Superuser"}, "role"),
        ({"full_name": ""}, "full_name"),
        ({"full_name": None}, "full_name"),
    ],
)
def test_ac015_invalid_values_422_and_nothing_stored(client, db_session, admin, body, field):
    _, c = admin
    e = mk(db_session, "us006e@example.com", name="Untouched")
    r = patch(client, c, e.id, body)
    assert r.status_code == 422
    assert ["body", field] in fields(r)
    db_session.refresh(e)
    assert (e.full_name, e.role, e.time_zone) == ("Untouched", "Employee", "Europe/London")


def test_ac015_invalid_manager_in_a_combined_edit_stores_nothing(client, db_session, admin):
    _, c = admin
    notmgr = mk(db_session, "us006n@example.com", "Employee")
    e = mk(db_session, "us006e@example.com", name="Untouched")
    r = patch(client, c, e.id, {"full_name": "Changed", "manager_id": notmgr.id})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    db_session.refresh(e)
    assert e.full_name == "Untouched" and e.manager_id is None


def test_ac015_unknown_user_404(client, admin):
    _, c = admin
    r = patch(client, c, 999999, {"full_name": "X"})
    assert r.status_code == 404


# ---------- AC-016: deactivation ----------


def test_ac016_deactivated_user_cannot_sign_in_and_message_is_generic(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com")
    assert login(client, e.email).status_code == 200
    r = deactivate(client, c, e.id)
    assert r.status_code == 200
    assert r.json()["is_active"] is False and r.json()["id"] == e.id
    again = login(client, e.email)
    assert again.status_code == 401
    assert again.json() == LOGIN_FAIL
    assert "token" not in again.text
    # Indistinguishable from a wrong password (NFR-002 / NFR-005).
    assert login(client, e.email, "wrong-password-123").json() == again.json()


def test_ac016_every_existing_session_is_revoked_immediately(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com")
    tokens = [sign_in(client, e.email) for _ in range(3)]
    assert all(client.get("/api/auth/me", headers=t).status_code == 200 for t in tokens)
    deactivate(client, c, e.id)
    for t in tokens:
        assert client.get("/api/auth/me", headers=t).status_code == 401
    assert db_session.query(UserSession).filter_by(user_id=e.id, revoked_at=None).count() == 0
    assert db_session.query(UserSession).filter_by(user_id=e.id).count() == 3


def test_ac016_deactivating_one_user_does_not_touch_another_users_sessions(
    client, db_session, admin
):
    _, c = admin
    a = mk(db_session, "us006a@example.com")
    b = mk(db_session, "us006b@example.com")
    bc = sign_in(client, b.email)
    deactivate(client, c, a.id)
    assert client.get("/api/auth/me", headers=bc).status_code == 200


def test_ac016_record_is_kept_and_still_listed_as_deactivated(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager", "Mia Manager")
    report = mk(db_session, "us006r@example.com", manager_id=mgr.id)
    deactivate(client, c, mgr.id)
    listed = client.get("/api/admin/users", headers=c).json()
    row = next(u for u in listed if u["id"] == mgr.id)
    assert row["is_active"] is False and row["full_name"] == "Mia Manager"
    assert row["email"] == "us006m@example.com" and row["role"] == "Manager"
    db_session.refresh(report)
    # Reports keep their manager; the record is not deleted or cascaded (NFR-014).
    assert report.manager_id == mgr.id
    assert db_session.get(User, mgr.id) is not None


def test_ac016_deactivated_user_cannot_be_assigned_as_manager_by_patch(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager")
    e = mk(db_session, "us006e@example.com")
    deactivate(client, c, mgr.id)
    r = patch(client, c, e.id, {"manager_id": mgr.id})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    db_session.refresh(e)
    assert e.manager_id is None


def test_ac016_deactivated_user_cannot_be_assigned_as_manager_on_create(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "us006m@example.com", "Manager")
    deactivate(client, c, mgr.id)
    body = {
        "full_name": "Fresh",
        "email": "us006fresh@example.com",
        "role": "Employee",
        "time_zone": "Europe/London",
        "manager_id": mgr.id,
    }
    r = client.post("/api/admin/users", json=body, headers={**c, **H})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    assert db_session.query(User).filter_by(email="us006fresh@example.com").count() == 0


def test_ac016_deactivated_user_can_still_be_edited_by_the_admin(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com", name="Leaver")
    deactivate(client, c, e.id)
    r = patch(client, c, e.id, {"full_name": "Leaver Renamed"})
    assert r.status_code == 200
    assert r.json()["full_name"] == "Leaver Renamed" and r.json()["is_active"] is False
    assert login(client, e.email).status_code == 401


def test_ac016_editing_a_user_does_not_reactivate_them(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com")
    deactivate(client, c, e.id)
    patch(client, c, e.id, {"role": "Manager", "time_zone": "Europe/Paris"})
    db_session.refresh(e)
    assert e.is_active is False


def test_ac016_deactivate_unknown_user_404(client, admin):
    _, c = admin
    assert deactivate(client, c, 999999).status_code == 404


def test_ac016_deactivated_admin_loses_admin_access_with_their_old_token(client, db_session, admin):
    _, c = admin
    second = mk(db_session, "us006admin2@example.com", "System Admin")
    sc = sign_in(client, second.email)
    assert deactivate(client, c, second.id).status_code == 200
    assert client.get("/api/admin/users", headers=sc).status_code == 401
    assert patch(client, sc, second.id, {"role": "Employee"}).status_code == 401


# ---------- Access control on the two endpoints (NFR-007) ----------


@pytest.mark.parametrize("role", ["Employee", "Manager", "Payroll Admin"])
def test_nfr007_non_admins_cannot_edit_or_deactivate(client, db_session, role):
    target = mk(db_session, "us006t@example.com", name="Target")
    mk(db_session, "us006x@example.com", role)
    c = sign_in(client, "us006x@example.com")
    edit = {"full_name": "Hacked", "role": "System Admin"}
    assert patch(client, c, target.id, edit).status_code == 403
    assert deactivate(client, c, target.id).status_code == 403
    db_session.refresh(target)
    assert target.full_name == "Target" and target.role == "Employee" and target.is_active


def test_nfr005_edit_and_deactivate_need_the_csrf_header(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "us006e@example.com", name="Same")
    r1 = client.patch(f"/api/admin/users/{e.id}", json={"full_name": "Nope"}, headers=c)
    r2 = client.post(f"/api/admin/users/{e.id}/deactivate", headers=c)
    assert r1.status_code == 403 and r2.status_code == 403
    db_session.refresh(e)
    assert e.full_name == "Same" and e.is_active
