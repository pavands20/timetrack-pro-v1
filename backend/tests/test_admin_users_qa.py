"""QA for US-004: admin user administration. Skips as PENDING until the code exists."""

import importlib
import re

import pytest
from sqlalchemy import inspect, text

from app.main import app
from app.models import User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
NEW_PW = "brand-new-password-1"
DENIED = {"detail": "You do not have access to this resource."}
DUP = {"detail": "An account with this email already exists."}
NOT_FOUND = {"detail": "User not found."}


@pytest.fixture(autouse=True)
def _clean(db_session):
    for t in ("password_reset_tokens", "password_resets"):
        if inspect(db_session.bind).has_table(t):
            db_session.execute(text(f"DELETE FROM {t}"))
    db_session.query(UserSession).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


@pytest.fixture(autouse=True)
def _need_routes():
    if not any(getattr(r, "path", "") == "/api/admin/users" for r in app.routes):
        pytest.skip("PENDING: /api/admin/users routes not present yet")


class FakeMailer:
    def __init__(self):
        self.sent = []

    def __getattr__(self, name):
        if name.startswith("_"):
            raise AttributeError(name)

        def record(*a, **k):
            self.sent.append(" ".join([str(x) for x in a] + [f"{kk}={v}" for kk, v in k.items()]))

        return record


@pytest.fixture
def mailer(client):
    try:
        dep = importlib.import_module("app.mailer").get_mailer
    except (ImportError, AttributeError):
        pytest.skip("PENDING: app.mailer.get_mailer not present yet")
    fake = FakeMailer()
    app.dependency_overrides[dep] = lambda: fake
    yield fake
    app.dependency_overrides.pop(dep, None)


def mk(db, email, role="Employee", name=None, **kw):
    u = User(
        full_name=name or email.split("@")[0],
        email=email,
        role=role,
        time_zone="Europe/London",
        password_hash=kw.pop("password_hash", hash_password(PW)),
        **kw,
    )
    db.add(u)
    db.commit()
    return u


def sign_in(client, email):
    r = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H)
    assert r.status_code == 200
    return {"Cookie": "session=" + r.cookies["session"]}


@pytest.fixture
def admin(client, db_session):
    u = mk(db_session, "admin@example.com", "System Admin", "Ann Admin")
    return u, sign_in(client, u.email)


def new_body(**kw):
    b = {
        "full_name": "New Person",
        "email": "new@example.com",
        "role": "Employee",
        "time_zone": "Europe/Paris",
    }
    b.update(kw)
    return b


def fields(r):
    return [d["loc"] for d in r.json()["detail"]]


# ---------- AC-004 ----------


@pytest.mark.parametrize("role", ["Employee", "Manager", "Payroll Admin"])
def test_ac004_non_admin_roles_get_403_no_data(client, db_session, role):
    target = mk(db_session, "victim@example.com", "Employee", "Secret Victim")
    mk(db_session, "x@example.com", role)
    c = sign_in(client, "x@example.com")
    calls = [
        client.get("/api/admin/users", headers=c),
        client.post("/api/admin/users", json=new_body(), headers={**c, **H}),
        client.patch(f"/api/admin/users/{target.id}", json={"full_name": "Z"}, headers={**c, **H}),
        client.post(f"/api/admin/users/{target.id}/deactivate", headers={**c, **H}),
    ]
    for r in calls:
        assert r.status_code == 403
        assert r.json() == DENIED
        assert "Secret Victim" not in r.text and "victim@example.com" not in r.text
    assert db_session.query(User).filter_by(email="new@example.com").count() == 0
    db_session.refresh(target)
    assert target.full_name == "Secret Victim" and target.is_active


def test_ac004_no_session_401(client, db_session):
    target = mk(db_session, "victim@example.com")
    calls = [
        client.get("/api/admin/users"),
        client.post("/api/admin/users", json=new_body(), headers=H),
        client.patch(f"/api/admin/users/{target.id}", json={"full_name": "Z"}, headers=H),
        client.post(f"/api/admin/users/{target.id}/deactivate", headers=H),
    ]
    for r in calls:
        assert r.status_code == 401
        assert r.json() == {"detail": "Not signed in"}


# ---------- AC-005 ----------


def _helper():
    for modname in ("app.access", "app.auth_deps", "app.permissions", "app.authz"):
        try:
            mod = importlib.import_module(modname)
        except ImportError:
            continue
        for n in dir(mod):
            if re.search(r"(own|self|access|can_)", n) and callable(getattr(mod, n)):
                if n not in ("require_role", "get_current_user", "find_session"):
                    return getattr(mod, n)
    pytest.skip("PENDING: own-records access helper not present yet")


def test_ac005_employee_only_own_records(db_session):
    helper = _helper()
    a = mk(db_session, "a@example.com")
    b = mk(db_session, "b@example.com")
    from fastapi import HTTPException

    def allowed(actor, owner_id):
        try:
            res = helper(actor, owner_id)
        except HTTPException as e:
            assert e.status_code == 403
            return False
        except PermissionError:
            return False
        return res is not False

    assert allowed(a, a.id)
    assert not allowed(a, b.id)


# ---------- AC-006 ----------


def test_ac006_list_and_patch_persist(client, db_session, admin):
    _, c = admin
    mk(db_session, "zed@example.com", name="Zed")
    u = mk(db_session, "bob@example.com", name="Bob")
    r = client.get("/api/admin/users", headers=c)
    assert r.status_code == 200
    names = [x["full_name"] for x in r.json()]
    assert names == sorted(names)
    assert set(r.json()[0]) == {
        "id",
        "full_name",
        "email",
        "role",
        "time_zone",
        "manager_id",
        "is_active",
    }
    r = client.patch(
        f"/api/admin/users/{u.id}",
        json={"full_name": "Bobby", "role": "Manager", "time_zone": "Europe/Berlin"},
        headers={**c, **H},
    )
    assert r.status_code == 200
    got = next(x for x in client.get("/api/admin/users", headers=c).json() if x["id"] == u.id)
    assert got["full_name"] == "Bobby" and got["role"] == "Manager"
    assert got["time_zone"] == "Europe/Berlin"


def test_ac006_patch_and_deactivate_404(client, admin):
    _, c = admin
    r = client.patch("/api/admin/users/999999", json={"full_name": "Z"}, headers={**c, **H})
    assert r.status_code == 404 and r.json() == NOT_FOUND
    r = client.post("/api/admin/users/999999/deactivate", headers={**c, **H})
    assert r.status_code == 404 and r.json() == NOT_FOUND


# ---------- AC-010 ----------


def test_ac010_create_invite_and_confirm(client, db_session, admin, mailer):
    _, c = admin
    r = client.post("/api/admin/users", json=new_body(), headers={**c, **H})
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == "new@example.com" and body["is_active"] is True
    assert body["manager_id"] is None
    assert "password_hash" not in body
    u = db_session.get(User, body["id"])
    assert u.password_hash is None
    assert len(mailer.sent) == 1 and "new@example.com" in mailer.sent[0]
    m = re.findall(r"token=([\w\-]+)", mailer.sent[0])
    assert m, "invite has no token"
    r = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": m[-1], "new_password": NEW_PW},
        headers=H,
    )
    assert r.status_code == 204
    r = client.post(
        "/api/auth/login", json={"email": "new@example.com", "password": NEW_PW}, headers=H
    )
    assert r.status_code == 200


# ---------- AC-011 ----------


def test_ac011_duplicate_email_any_case_409(client, db_session, admin, mailer):
    _, c = admin
    assert client.post("/api/admin/users", json=new_body(), headers={**c, **H}).status_code == 201
    for e in ("new@example.com", "NEW@Example.COM"):
        r = client.post("/api/admin/users", json=new_body(email=e), headers={**c, **H})
        assert r.status_code == 409 and r.json() == DUP
    assert db_session.query(User).filter(User.email.ilike("new@example.com")).count() == 1


def test_ac011_patch_duplicate_409(client, db_session, admin):
    _, c = admin
    mk(db_session, "taken@example.com")
    u = mk(db_session, "other@example.com")
    r = client.patch(
        f"/api/admin/users/{u.id}", json={"email": "TAKEN@example.com"}, headers={**c, **H}
    )
    assert r.status_code == 409 and r.json() == DUP


# ---------- AC-012 ----------


@pytest.mark.parametrize("field", ["full_name", "email", "role", "time_zone"])
def test_ac012_each_missing_field_422(client, db_session, admin, mailer, field):
    _, c = admin
    body = new_body()
    del body[field]
    before = db_session.query(User).count()
    r = client.post("/api/admin/users", json=body, headers={**c, **H})
    assert r.status_code == 422
    assert ["body", field] in fields(r)
    assert all(d["msg"] for d in r.json()["detail"])
    assert db_session.query(User).count() == before
    assert mailer.sent == []


# ---------- AC-013 / AC-014 ----------


def test_ac013_assign_active_manager(client, db_session, admin):
    _, c = admin
    mgr = mk(db_session, "m@example.com", "Manager", "Mia Manager")
    r = client.post("/api/admin/users", json=new_body(manager_id=mgr.id), headers={**c, **H})
    assert r.status_code == 201 and r.json()["manager_id"] == mgr.id
    e = mk(db_session, "e@example.com")
    r = client.patch(f"/api/admin/users/{e.id}", json={"manager_id": mgr.id}, headers={**c, **H})
    assert r.status_code == 200 and r.json()["manager_id"] == mgr.id
    db_session.refresh(e)
    assert e.manager_id == mgr.id


@pytest.mark.parametrize("kind", ["Employee", "Payroll Admin", "inactive"])
def test_ac014_invalid_manager_refused(client, db_session, admin, kind):
    _, c = admin
    if kind == "inactive":
        bad = mk(db_session, "bad@example.com", "Manager", is_active=False)
    else:
        bad = mk(db_session, "bad@example.com", kind)
    e = mk(db_session, "e@example.com")
    r = client.patch(f"/api/admin/users/{e.id}", json={"manager_id": bad.id}, headers={**c, **H})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    db_session.refresh(e)
    assert e.manager_id is None
    r = client.post("/api/admin/users", json=new_body(manager_id=bad.id), headers={**c, **H})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    assert db_session.query(User).filter_by(email="new@example.com").count() == 0


def test_ac014_self_manager_refused(client, db_session, admin):
    _, c = admin
    m = mk(db_session, "m@example.com", "Manager")
    r = client.patch(f"/api/admin/users/{m.id}", json={"manager_id": m.id}, headers={**c, **H})
    assert r.status_code == 422 and ["body", "manager_id"] in fields(r)
    db_session.refresh(m)
    assert m.manager_id is None


def test_ac014_role_change_of_manager_with_reports_refused(client, db_session, admin):
    _, c = admin
    m = mk(db_session, "m@example.com", "Manager")
    mk(db_session, "e@example.com", manager_id=m.id)
    r = client.patch(f"/api/admin/users/{m.id}", json={"role": "Employee"}, headers={**c, **H})
    assert r.status_code == 422
    db_session.refresh(m)
    assert m.role == "Manager"


# ---------- Deactivate ----------


def test_deactivate_revokes_sessions(client, db_session, admin):
    _, c = admin
    e = mk(db_session, "e@example.com")
    ec = sign_in(client, "e@example.com")
    assert client.get("/api/auth/me", headers=ec).status_code == 200
    r = client.post(f"/api/admin/users/{e.id}/deactivate", headers={**c, **H})
    assert r.status_code == 200 and r.json()["is_active"] is False
    assert client.get("/api/auth/me", headers=ec).status_code == 401
    live = db_session.query(UserSession).filter_by(user_id=e.id, revoked_at=None).count()
    assert live == 0


def test_self_deactivate_409(client, db_session, admin):
    me, c = admin
    r = client.post(f"/api/admin/users/{me.id}/deactivate", headers={**c, **H})
    assert r.status_code == 409
    assert r.json() == {"detail": "You cannot deactivate your own account."}
    db_session.refresh(me)
    assert me.is_active


# NFR-006 (EU hosting), NFR-008 (retention of time records) and NFR-015 (500-user load)
# are infrastructure/other-story concerns and cannot be tested here. NFR-007 role limiting
# is covered by AC-004/AC-005; NFR-013 messages by AC-011/AC-012.
