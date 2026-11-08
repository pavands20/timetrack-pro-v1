"""Auth foundation: login, logout, me, CSRF, roles, seed."""

from collections.abc import Iterator
from datetime import UTC, datetime, timedelta

import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth_deps import require_role
from app.database import get_db
from app.models import User, UserSession
from app.routers.auth import router
from app.security import hash_password, token_digest
from app.seed import seed_admin

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"


@pytest.fixture(autouse=True)
def _clean_tables(db_session):
    """Commits inside a test may outlive its rollback on some drivers; start empty."""
    db_session.query(UserSession).delete()
    db_session.query(User).delete()
    db_session.commit()


def make_user(db: Session, email="a@example.com", role="Employee", **kw) -> User:
    kw.setdefault("password_hash", hash_password(PW))
    user = User(full_name="A", email=email, role=role, time_zone="Europe/London", **kw)
    db.add(user)
    db.commit()
    return user


def login(client: TestClient, email="a@example.com", password=PW):
    return client.post("/api/auth/login", json={"email": email, "password": password}, headers=H)


def cookie_of(resp) -> dict:
    return {"Authorization": "Bearer " + resp.json()["token"]}


def test_ac001_login_returns_token_not_cookie(client, db_session):
    make_user(db_session, "admin@example.com", "System Admin")
    make_user(db_session, "emp@example.com", "Employee")
    r = login(client, "Admin@Example.com")
    assert r.status_code == 200
    assert r.json()["home_path"] == "/admin-users"
    assert "set-cookie" not in r.headers
    assert login(client, "emp@example.com").json()["home_path"] == "/home"
    stored = db_session.query(UserSession).all()
    assert all(len(s.token_hash) == 64 for s in stored)
    assert r.json()["token"] not in [s.token_hash for s in stored]


def test_ac002_all_failures_identical(client, db_session):
    make_user(db_session, "a@example.com")
    make_user(db_session, "off@example.com", is_active=False)
    make_user(db_session, "nopw@example.com", password_hash=None)
    results = [
        login(client, "a@example.com", "wrong-password-x"),
        login(client, "nobody@example.com"),
        login(client, "off@example.com"),
        login(client, "nopw@example.com"),
    ]
    for r in results:
        assert r.status_code == 401
        assert r.json() == {"detail": "Incorrect email or password"}


def test_ac002_login_validation_422_and_csrf_403(client):
    r = client.post("/api/auth/login", json={"email": "a@example.com"}, headers=H)
    assert r.status_code == 422
    assert r.json()["detail"][0]["loc"] == ["body", "password"]
    assert r.json()["detail"][0]["msg"]
    r = client.post("/api/auth/login", json={"email": "a@example.com", "password": PW})
    assert r.status_code == 403


def test_ac003_logout_revokes_session(client, db_session):
    make_user(db_session)
    c = cookie_of(login(client))
    assert client.get("/api/auth/me", headers=c).status_code == 200
    r = client.post("/api/auth/logout", headers={**c, **H})
    assert r.status_code == 204
    r = client.get("/api/auth/me", headers=c)
    assert r.status_code == 401
    assert r.json() == {"detail": "Not signed in"}


def test_logout_without_csrf_header_is_403(client):
    assert client.post("/api/auth/logout").status_code == 403


def test_me_returns_user_and_401_without_session(client, db_session):
    make_user(db_session)
    c = cookie_of(login(client))
    body = client.get("/api/auth/me", headers=c).json()
    assert body["email"] == "a@example.com" and "password_hash" not in body
    assert client.get("/api/auth/me").status_code == 401


def test_nfr001_expired_or_deactivated_session_is_401(client, db_session):
    user = make_user(db_session)
    c = cookie_of(login(client))
    digest = token_digest(c["Authorization"].split(" ", 1)[1])
    sess = db_session.query(UserSession).filter_by(token_hash=digest).one()
    user.is_active = False
    db_session.commit()
    assert client.get("/api/auth/me", headers=c).status_code == 401
    user.is_active = True
    sess.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    db_session.commit()
    assert client.get("/api/auth/me", headers=c).status_code == 401


@pytest.fixture
def role_client(db_session) -> Iterator[TestClient]:
    app = FastAPI()

    def _db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _db

    @app.get("/admin-only")
    def admin_only(_: User = Depends(require_role("System Admin"))) -> dict:  # noqa: B008
        return {"ok": True}

    app.include_router(router)
    yield TestClient(app)


def test_nfr003_require_role_403_without_data(role_client, db_session):
    make_user(db_session, "emp@example.com", "Employee")
    make_user(db_session, "admin@example.com", "System Admin")
    emp = cookie_of(login(role_client, "emp@example.com"))
    r = role_client.get("/admin-only", headers=emp)
    assert r.status_code == 403
    assert r.json() == {"detail": "You do not have access to this resource."}
    adm = cookie_of(login(role_client, "admin@example.com"))
    assert role_client.get("/admin-only", headers=adm).status_code == 200
    assert role_client.get("/admin-only").status_code == 401


def test_seed_creates_admin_only_when_no_user_exists(db_session):
    db_session.query(UserSession).delete()
    db_session.query(User).delete()
    assert seed_admin(db_session, "Boss@Example.com", PW) is True
    admin = db_session.query(User).one()
    assert admin.email == "boss@example.com" and admin.password_hash.startswith("$argon2")
    assert seed_admin(db_session, "other@example.com", PW) is False
