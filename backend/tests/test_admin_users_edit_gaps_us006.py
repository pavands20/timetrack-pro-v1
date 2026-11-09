"""US-006 QA gap tests: combined next-request effect, byte-identical login refusal,
record and manager link kept on deactivation, and no-data refusals on PATCH/deactivate."""

import pytest
from sqlalchemy import inspect, text

from app.models import User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"


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
    u = mk(db_session, "gapadmin@example.com", "System Admin", "Ann Admin")
    return u, sign_in(client, u.email)


def test_ac015_demotion_and_all_fields_show_on_next_request_same_session(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "gapm@example.com", "Manager", "Mia Manager")
    target = mk(db_session, "gapt@example.com", "System Admin", "Before Name")
    tc = sign_in(client, target.email)
    assert client.get("/api/admin/users", headers=tc).status_code == 200
    r = client.patch(
        f"/api/admin/users/{target.id}",
        json={
            "full_name": "After Name",
            "role": "Payroll Admin",
            "manager_id": mgr.id,
            "time_zone": "Europe/Lisbon",
        },
        headers={**c, **H},
    )
    assert r.status_code == 200
    denied = client.get("/api/admin/users", headers=tc)
    assert denied.status_code == 403
    assert "gapadmin@example.com" not in denied.text
    me = client.get("/api/auth/me", headers=tc)
    assert me.status_code == 200
    assert me.json()["full_name"] == "After Name"
    assert me.json()["role"] == "Payroll Admin"
    assert me.json()["time_zone"] == "Europe/Lisbon"
    db_session.refresh(target)
    assert target.manager_id == mgr.id


def test_ac016_deactivated_login_refusal_is_byte_identical_to_bad_password(
    client, db_session, admin
):
    _, c = admin
    e = mk(db_session, "gape@example.com")
    bad = login(client, e.email, "wrong-password-123")
    assert client.post(f"/api/admin/users/{e.id}/deactivate", headers={**c, **H}).status_code == 200
    # Correct password, deactivated account.
    off = login(client, e.email)
    assert off.status_code == bad.status_code == 401
    assert off.content == bad.content
    assert "token" not in off.text


def test_ac016_nfr014_deactivated_row_keeps_its_own_manager_and_reports(client, db_session, admin):
    _, c = admin
    boss = mk(db_session, "gapboss@example.com", "Manager", "Big Boss")
    mid = mk(db_session, "gapmid@example.com", "Manager", "Mid Manager", manager_id=boss.id)
    rep = mk(db_session, "gaprep@example.com", manager_id=mid.id)
    r = client.post(f"/api/admin/users/{mid.id}/deactivate", headers={**c, **H})
    assert r.status_code == 200
    assert r.json()["manager_id"] == boss.id and r.json()["is_active"] is False
    rows = {u["id"]: u for u in client.get("/api/admin/users", headers=c).json()}
    assert rows[mid.id]["is_active"] is False
    assert rows[mid.id]["manager_id"] == boss.id
    assert rows[rep.id]["manager_id"] == mid.id
    db_session.refresh(mid)
    db_session.refresh(rep)
    assert (mid.manager_id, rep.manager_id) == (boss.id, mid.id)


def test_ac016_deactivated_manager_message_present_on_patch_and_create(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "gapdm@example.com", "Manager")
    e = mk(db_session, "gapde@example.com")
    client.post(f"/api/admin/users/{mgr.id}/deactivate", headers={**c, **H})
    r = client.patch(f"/api/admin/users/{e.id}", json={"manager_id": mgr.id}, headers={**c, **H})
    assert r.status_code == 422
    assert r.json()["detail"][0]["loc"] == ["body", "manager_id"] and r.json()["detail"][0]["msg"]
    body = {
        "full_name": "X Y",
        "email": "gapnew@example.com",
        "role": "Employee",
        "time_zone": "Europe/London",
        "manager_id": mgr.id,
    }
    r = client.post("/api/admin/users", json=body, headers={**c, **H})
    assert r.status_code == 422 and r.json()["detail"][0]["msg"]


def test_nfr007_patch_and_deactivate_no_session_401_and_non_admin_403_without_data(
    client, db_session
):
    target = mk(db_session, "gapvictim@example.com", name="Hidden Victim")
    anon = [
        client.patch(f"/api/admin/users/{target.id}", json={"full_name": "Z"}, headers=H),
        client.post(f"/api/admin/users/{target.id}/deactivate", headers=H),
    ]
    for r in anon:
        assert r.status_code == 401
        assert "Hidden Victim" not in r.text
    for role in ("Employee", "Manager", "Payroll Admin"):
        mk(db_session, f"gap{role[:3].lower()}@example.com", role)
        c = sign_in(client, f"gap{role[:3].lower()}@example.com")
        hdrs = {**c, **H}
        for r in (
            client.patch(f"/api/admin/users/{target.id}", json={"role": "Manager"}, headers=hdrs),
            client.post(f"/api/admin/users/{target.id}/deactivate", headers=hdrs),
        ):
            assert r.status_code == 403
            assert "Hidden Victim" not in r.text and "gapvictim@example.com" not in r.text
    db_session.refresh(target)
    assert target.role == "Employee" and target.is_active


# NFR-006 (hosting region), NFR-008 (time-record retention) and NFR-015 (500-user load) cannot
# be tested here; no time_entries table exists yet, so NFR-014 is shown on users rows only.
