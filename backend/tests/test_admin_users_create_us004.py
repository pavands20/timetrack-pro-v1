"""US-004 integration tests: create a user, receive the invite, set a password, sign in.

Complements test_admin_users_qa.py: that file covers each endpoint's happy path and the
per-field 422s; this one covers the seams between creation, the invite email, the
set-password link and sign-in, and the rejections that must leave no account behind.
"""

import re

import pytest
from fastapi.testclient import TestClient

from app.mailer import get_mailer
from app.main import app
from app.models import PasswordToken, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
ADMIN_PW = "correct-horse-battery"
NEW_PW = "brand-new-password-1"
DUP = {"detail": "An account with this email already exists."}


@pytest.fixture(autouse=True)
def _clean(db_session):
    """Same isolation as test_admin_users_qa.py: start each test with no users."""
    db_session.query(PasswordToken).delete()
    db_session.query(UserSession).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


class RecordingMailer:
    def __init__(self) -> None:
        self.sent: list[tuple[str, str, str]] = []

    def send(self, to: str, subject: str, body: str) -> None:
        self.sent.append((to, subject, body))


@pytest.fixture
def mailer(client):
    fake = RecordingMailer()
    app.dependency_overrides[get_mailer] = lambda: fake
    yield fake
    app.dependency_overrides.pop(get_mailer, None)


@pytest.fixture
def admin(client, db_session):
    u = User(
        full_name="Ann Admin",
        email="ann.admin.us004@example.com",
        role="System Admin",
        time_zone="Europe/London",
        password_hash=hash_password(ADMIN_PW),
    )
    db_session.add(u)
    db_session.commit()
    r = client.post("/api/auth/login", json={"email": u.email, "password": ADMIN_PW}, headers=H)
    assert r.status_code == 200
    headers = dict(H)
    if not client.cookies and "token" in r.json():
        # Application defect (no session cookie set, see test_admin_users_qa.py): bearer fallback.
        headers["Authorization"] = "Bearer " + r.json()["token"]
    return headers


def body(**kw):
    b = {
        "full_name": "Nia Newhire",
        "email": "nia.us004@example.com",
        "role": "Employee",
        "time_zone": "Europe/Paris",
    }
    b.update(kw)
    return b


def count(db, email):
    return db.query(User).filter(User.email == email.lower()).count()


def invite_token(mailer):
    assert len(mailer.sent) == 1, "expected exactly one invite email"
    found = re.findall(r"reset_token=([\w\-]+)", mailer.sent[0][2])
    assert found, "invite email carries no set-password token"
    return found[-1]


def test_ac010_full_flow_create_set_password_sign_in(client, db_session, admin, mailer):
    r = client.post("/api/admin/users", json=body(role="Manager"), headers=admin)
    assert r.status_code == 201
    created = r.json()
    assert set(created) == {
        "id",
        "full_name",
        "email",
        "role",
        "time_zone",
        "manager_id",
        "is_active",
    }
    assert created["role"] == "Manager" and created["time_zone"] == "Europe/Paris"
    assert mailer.sent[0][0] == "nia.us004@example.com"

    # Cannot sign in until a password exists.
    pre = client.post(
        "/api/auth/login",
        json={"email": "nia.us004@example.com", "password": NEW_PW},
        headers=H,
    )
    assert pre.status_code == 401

    token = invite_token(mailer)
    r = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": NEW_PW},
        headers=H,
    )
    assert r.status_code == 204

    r = client.post(
        "/api/auth/login",
        json={"email": "nia.us004@example.com", "password": NEW_PW},
        headers=H,
    )
    assert r.status_code == 200
    login = r.json()
    assert login["role"] == "Manager" and login["time_zone"] == "Europe/Paris"
    fresh = TestClient(app)
    fresh.post(
        "/api/auth/login",
        json={"email": "nia.us004@example.com", "password": NEW_PW},
        headers=H,
    )
    if not fresh.cookies:
        fresh.headers["Authorization"] = "Bearer " + login["token"]
    me = fresh.get("/api/auth/me")
    assert me.status_code == 200 and me.json()["full_name"] == "Nia Newhire"


def test_ac010_email_is_stored_lowercase_and_sign_in_ignores_case(
    client, db_session, admin, mailer
):
    r = client.post(
        "/api/admin/users", json=body(email="Mixed.Case.US004@Example.COM"), headers=admin
    )
    assert r.status_code == 201 and r.json()["email"] == "mixed.case.us004@example.com"
    client.post(
        "/api/auth/password-reset/confirm",
        json={"token": invite_token(mailer), "new_password": NEW_PW},
        headers=H,
    )
    r = client.post(
        "/api/auth/login",
        json={"email": "MIXED.case.us004@example.com", "password": NEW_PW},
        headers=H,
    )
    assert r.status_code == 200


def test_ac010_invite_link_is_single_use(client, db_session, admin, mailer):
    client.post("/api/admin/users", json=body(), headers=admin)
    token = invite_token(mailer)
    first = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": NEW_PW},
        headers=H,
    )
    assert first.status_code == 204
    again = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": "another-password-22"},
        headers=H,
    )
    assert again.status_code >= 400
    ok = client.post(
        "/api/auth/login",
        json={"email": "nia.us004@example.com", "password": NEW_PW},
        headers=H,
    )
    assert ok.status_code == 200
    bad = client.post(
        "/api/auth/login",
        json={"email": "nia.us004@example.com", "password": "another-password-22"},
        headers=H,
    )
    assert bad.status_code == 401


def test_ac010_too_short_password_is_refused_and_link_stays_usable(
    client, db_session, admin, mailer
):
    client.post("/api/admin/users", json=body(), headers=admin)
    token = invite_token(mailer)
    r = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": "short"},
        headers=H,
    )
    assert r.status_code == 422
    r = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": NEW_PW},
        headers=H,
    )
    assert r.status_code == 204


def test_ac010_unknown_token_cannot_set_a_password(client, db_session, admin, mailer):
    client.post("/api/admin/users", json=body(), headers=admin)
    r = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": "not-a-real-token", "new_password": NEW_PW},
        headers=H,
    )
    assert r.status_code >= 400
    user = db_session.query(User).filter_by(email="nia.us004@example.com").one()
    assert user.password_hash is None


def test_ac011_duplicate_of_deactivated_account_is_still_rejected(
    client, db_session, admin, mailer
):
    r = client.post("/api/admin/users", json=body(), headers=admin)
    assert r.status_code == 201
    uid = r.json()["id"]
    assert client.post(f"/api/admin/users/{uid}/deactivate", headers=admin).status_code == 200
    mailer.sent.clear()
    r = client.post("/api/admin/users", json=body(full_name="Someone Else"), headers=admin)
    assert r.status_code == 409 and r.json() == DUP
    assert count(db_session, "nia.us004@example.com") == 1
    assert mailer.sent == []


def test_ac011_duplicate_creates_no_account_no_invite_and_keeps_original(
    client, db_session, admin, mailer
):
    first = client.post("/api/admin/users", json=body(), headers=admin)
    assert first.status_code == 201
    mailer.sent.clear()
    tokens_before = db_session.query(PasswordToken).count()
    r = client.post(
        "/api/admin/users",
        json=body(full_name="Impostor", role="System Admin"),
        headers=admin,
    )
    assert r.status_code == 409 and r.json() == DUP
    original = db_session.get(User, first.json()["id"])
    assert original.full_name == "Nia Newhire" and original.role == "Employee"
    assert db_session.query(PasswordToken).count() == tokens_before
    assert mailer.sent == []


@pytest.mark.parametrize(
    ("override", "field"),
    [
        ({"email": "not-an-email"}, "email"),
        ({"email": ""}, "email"),
        ({"full_name": ""}, "full_name"),
        ({"time_zone": "Mars/Olympus_Mons"}, "time_zone"),
        ({"time_zone": ""}, "time_zone"),
        ({"role": "Superuser"}, "role"),
    ],
)
def test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created(
    client, db_session, admin, mailer, override, field
):
    before = db_session.query(User).count()
    r = client.post("/api/admin/users", json=body(**override), headers=admin)
    assert r.status_code == 422
    details = r.json()["detail"]
    assert ["body", field] in [d["loc"] for d in details]
    assert all(isinstance(d["msg"], str) and d["msg"] for d in details)
    assert db_session.query(User).count() == before
    assert mailer.sent == []


@pytest.mark.xfail(
    strict=True,
    reason="DEFECT: POST /api/admin/users accepts a whitespace-only full_name (201) and stores "
    "an empty name; the form rejects it client-side but the API does not.",
)
def test_ac012_whitespace_only_name_is_treated_as_missing(client, db_session, admin, mailer):
    before = db_session.query(User).count()
    r = client.post("/api/admin/users", json=body(full_name="   "), headers=admin)
    assert r.status_code == 422
    assert db_session.query(User).count() == before


def test_ac012_all_fields_missing_reports_every_required_field(client, db_session, admin, mailer):
    before = db_session.query(User).count()
    r = client.post("/api/admin/users", json={}, headers=admin)
    assert r.status_code == 422
    named = {d["loc"][-1] for d in r.json()["detail"]}
    assert {"full_name", "email", "role", "time_zone"} <= named
    assert db_session.query(User).count() == before


def test_create_requires_a_session_and_the_csrf_header(client, db_session, admin, mailer):
    before = db_session.query(User).count()
    anonymous = TestClient(app).post("/api/admin/users", json=body(), headers=H)
    assert anonymous.status_code == 401
    bearer_only = {k: v for k, v in admin.items() if k not in H}
    no_csrf = client.post("/api/admin/users", json=body(), headers=bearer_only)
    assert no_csrf.status_code == 403
    assert db_session.query(User).count() == before
    assert mailer.sent == []
