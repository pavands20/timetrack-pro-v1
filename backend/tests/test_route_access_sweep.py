"""Final review: access rules checked across every mounted /api route, not one by one.

A route added later without an auth dependency, or an admin route left open to other
roles, fails here without anyone having to remember to write its test (NFR-003).
"""

import re
import uuid

import pytest
from fastapi.routing import APIRoute

from app.main import app
from app.models import User
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"

# Reachable without a session by design. Logout is idempotent: with no live session it
# still answers 204 and changes nothing.
PUBLIC = {
    ("POST", "/api/auth/login"),
    ("POST", "/api/auth/password-reset/request"),
    ("POST", "/api/auth/password-reset/confirm"),
    ("POST", "/api/auth/logout"),
}


def _routes() -> list[tuple[str, str]]:
    out = []
    for route in app.routes:
        if isinstance(route, APIRoute) and route.path.startswith("/api"):
            for method in sorted(route.methods - {"HEAD", "OPTIONS"}):
                out.append((method, route.path))
    return out


def _url(path: str) -> str:
    path = path.replace("{week_start}", "2026-01-05")
    return re.sub(r"\{[^}]+\}", "1", path)


PROTECTED = [r for r in _routes() if r not in PUBLIC]
ADMIN = [r for r in PROTECTED if r[1].startswith("/api/admin")]


def _send(client, method, path, headers):
    return client.request(method, _url(path), json={}, headers=headers)


def test_the_sweep_actually_sees_the_api():
    """Guards the sweep itself: an empty route list would make every test below pass."""
    paths = {p for _, p in PROTECTED}
    assert len(PROTECTED) >= 20
    assert "/api/clock/in" in paths and "/api/admin/users" in paths
    assert "/api/timesheets/cells" in paths and "/api/dashboard/week" in paths
    assert ADMIN


@pytest.mark.parametrize(("method", "path"), PROTECTED)
def test_nfr003_every_protected_route_is_401_without_a_session(client, method, path):
    r = _send(client, method, path, H)
    assert r.status_code == 401, f"{method} {path} answered {r.status_code} with no session"
    assert "set-cookie" not in r.headers


@pytest.mark.parametrize(("method", "path"), PROTECTED)
def test_nfr003_a_made_up_bearer_token_is_401(client, method, path):
    r = _send(client, method, path, {**H, "Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401, f"{method} {path} answered {r.status_code}"


def test_a_session_cookie_is_not_a_way_in(client, db_session):
    """Auth is the Bearer header only: the SPA and API are on different origins."""
    email = f"sweep-{uuid.uuid4().hex[:8]}@example.com"
    db_session.add(
        User(
            full_name="S",
            email=email,
            role="Employee",
            time_zone="Europe/London",
            password_hash=hash_password(PW),
        )
    )
    db_session.commit()
    token = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H).json()[
        "token"
    ]
    client.cookies.set("session", token)
    client.cookies.set("session_token", token)
    assert client.get("/api/auth/me").status_code == 401
    bearer = {"Authorization": f"Bearer {token}"}
    assert client.get("/api/auth/me", headers=bearer).status_code == 200


@pytest.mark.parametrize("role", ["Employee", "Manager", "Payroll Admin"])
@pytest.mark.parametrize(("method", "path"), ADMIN)
def test_nfr003_every_admin_route_is_403_for_a_non_admin(client, db_session, role, method, path):
    email = f"sweep-{uuid.uuid4().hex[:8]}@example.com"
    db_session.add(
        User(
            full_name="S",
            email=email,
            role=role,
            time_zone="Europe/London",
            password_hash=hash_password(PW),
        )
    )
    db_session.commit()
    token = client.post("/api/auth/login", json={"email": email, "password": PW}, headers=H).json()[
        "token"
    ]
    r = _send(client, method, path, {**H, "Authorization": f"Bearer {token}"})
    assert r.status_code == 403, f"{role} got {r.status_code} on {method} {path}"
    assert r.json() == {"detail": "You do not have access to this resource."}


@pytest.mark.parametrize(
    ("method", "path"), [r for r in PROTECTED if r[0] in {"POST", "PUT", "PATCH", "DELETE"}]
)
def test_every_state_changing_route_refuses_a_call_without_the_csrf_header(client, method, path):
    r = client.request(method, _url(path), json={})
    assert r.status_code == 403
