"""QA for US-007/008/009: admin catalogue API (clients, projects, tasks, GET /api/projects).

Task routes and GET /api/projects are assumed at POST /api/admin/tasks {project_id, name},
PATCH /api/admin/tasks/{id} {is_archived, name} and GET /api/projects. Tests that need a
route that is not mounted yet skip as PENDING.
"""

import pytest
from sqlalchemy import inspect, text

from app.main import app
from app.models import Client, Project, Task, User, UserSession
from app.security import hash_password

H = {"X-Requested-With": "XMLHttpRequest"}
PW = "correct-horse-battery"
ADMIN_ROUTES = [
    ("get", "/api/admin/clients"),
    ("post", "/api/admin/clients"),
    ("patch", "/api/admin/clients/1"),
    ("post", "/api/admin/projects"),
    ("patch", "/api/admin/projects/1"),
]


def _has(path):
    return any(getattr(r, "path", "") == path for r in app.routes)


@pytest.fixture(autouse=True)
def _clean(db_session):
    db_session.query(Task).delete()
    db_session.query(Project).delete()
    db_session.query(Client).delete()
    for t in ("password_reset_tokens", "password_resets"):
        if inspect(db_session.bind).has_table(t):
            db_session.execute(text(f"DELETE FROM {t}"))
    db_session.query(UserSession).delete()
    db_session.query(User).update({"manager_id": None})
    db_session.query(User).delete()
    db_session.commit()


def mk(db, email, role="Employee"):
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


@pytest.fixture
def adm(client, db_session):
    mk(db_session, "cat.admin@example.com", "System Admin")
    return sign_in(client, "cat.admin@example.com")


def new_client(client, adm, name="Acme"):
    r = client.post("/api/admin/clients", json={"name": name}, headers=adm)
    assert r.status_code == 201, r.text
    return r.json()


def new_project(client, adm, cid, name="Web", rate=100):
    r = client.post(
        "/api/admin/projects", json={"client_id": cid, "name": name, "bill_rate": rate}, headers=adm
    )
    assert r.status_code == 201, r.text
    return r.json()


def new_task(client, adm, pid, name="Design"):
    if not _has("/api/admin/tasks"):
        pytest.skip("PENDING: /api/admin/tasks not present yet")
    r = client.post("/api/admin/tasks", json={"project_id": pid, "name": name}, headers=adm)
    assert r.status_code == 201, r.text
    return r.json()


def listing(client, adm):
    r = client.get("/api/admin/clients", headers=adm)
    assert r.status_code == 200
    return r.json()


def public(client, adm):
    if not _has("/api/projects"):
        pytest.skip("PENDING: GET /api/projects not present yet")
    r = client.get("/api/projects", headers=adm)
    assert r.status_code == 200
    return r.json()


def flat_names(data):
    return str(data)


# ---------- AC-017 ----------


def test_ac017_unique_client_appears_in_list(client, adm):
    new_client(client, adm, "Zeta Ltd")
    assert "Zeta Ltd" in [c["name"] for c in listing(client, adm)]


def test_ac017_case_insensitive_duplicate_409_creates_nothing(client, adm, db_session):
    new_client(client, adm, "Acme")
    for n in ("acme", "ACME", " Acme "):
        r = client.post("/api/admin/clients", json={"name": n}, headers=adm)
        assert r.status_code == 409
    assert db_session.query(Client).count() == 1


@pytest.mark.parametrize("body", [{"name": ""}, {"name": "   "}, {}])
def test_ac017_blank_name_422(client, adm, db_session, body):
    r = client.post("/api/admin/clients", json=body, headers=adm)
    assert r.status_code == 422
    assert r.json()["detail"][0]["loc"] == ["body", "name"] and r.json()["detail"][0]["msg"]
    assert db_session.query(Client).count() == 0


# ---------- AC-018 ----------


def test_ac018_archive_keeps_projects_and_tasks_in_admin_list(client, adm):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"])
    if _has("/api/admin/tasks"):
        new_task(client, adm, p["id"])
    r = client.patch(f"/api/admin/clients/{c['id']}", json={"is_archived": True}, headers=adm)
    assert r.status_code == 200
    row = next(x for x in listing(client, adm) if x["id"] == c["id"])
    assert row["is_archived"] is True
    assert [x["id"] for x in row["projects"]] == [p["id"]]
    if _has("/api/admin/tasks"):
        assert len(row["projects"][0]["tasks"]) == 1


def test_ac018_project_under_archived_client_409(client, adm, db_session):
    c = new_client(client, adm)
    client.patch(f"/api/admin/clients/{c['id']}", json={"is_archived": True}, headers=adm)
    r = client.post(
        "/api/admin/projects",
        json={"client_id": c["id"], "name": "New", "bill_rate": 10},
        headers=adm,
    )
    assert r.status_code == 409
    assert db_session.query(Project).count() == 0


def test_ac018_public_list_omits_archived_clients_projects(client, adm):
    c = new_client(client, adm, "Gone")
    k = new_client(client, adm, "Kept")
    new_project(client, adm, c["id"], "HiddenProj")
    new_project(client, adm, k["id"], "VisibleProj")
    client.patch(f"/api/admin/clients/{c['id']}", json={"is_archived": True}, headers=adm)
    text_ = flat_names(public(client, adm))
    assert "HiddenProj" not in text_ and "VisibleProj" in text_


# ---------- AC-019 / AC-020 ----------


@pytest.mark.parametrize("rate,stored", [(0, "0.00"), (135.50, "135.50"), ("135.50", "135.50")])
def test_ac019_project_saved_under_client_with_rate(client, adm, db_session, rate, stored):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"], "Rated", rate)
    assert p["client_id"] == c["id"] and p["bill_rate"] == stored
    row = db_session.get(Project, p["id"])
    assert row.client_id == c["id"] and f"{row.bill_rate:.2f}" == stored
    cl = next(x for x in listing(client, adm) if x["id"] == c["id"])
    assert cl["projects"][0]["bill_rate"] == stored


@pytest.mark.parametrize("rate", [-1, -0.01, "abc", None, 12.345, "12.345", True, [], ""])
def test_ac020_bad_rate_422_on_bill_rate_nothing_saved(client, adm, db_session, rate):
    c = new_client(client, adm)
    r = client.post(
        "/api/admin/projects",
        json={"client_id": c["id"], "name": "Bad", "bill_rate": rate},
        headers=adm,
    )
    assert r.status_code == 422
    d = r.json()["detail"]
    assert any(x["loc"] == ["body", "bill_rate"] and x["msg"] for x in d)
    assert db_session.query(Project).count() == 0


def test_ac020_missing_rate_key_422(client, adm, db_session):
    c = new_client(client, adm)
    r = client.post("/api/admin/projects", json={"client_id": c["id"], "name": "X"}, headers=adm)
    assert r.status_code == 422
    assert ["body", "bill_rate"] in [x["loc"] for x in r.json()["detail"]]
    assert db_session.query(Project).count() == 0


@pytest.mark.parametrize("rate", [-5, "abc", 1.234])
def test_ac020_bad_rate_on_edit_422_keeps_old_rate(client, adm, db_session, rate):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"], "P", 50)
    r = client.patch(f"/api/admin/projects/{p['id']}", json={"bill_rate": rate}, headers=adm)
    assert r.status_code == 422
    assert db_session.get(Project, p["id"]).bill_rate == 50


# ---------- AC-021 / NFR-014 ----------


def test_ac021_rate_change_leaves_others_unchanged(client, adm, db_session):
    c = new_client(client, adm)
    p1 = new_project(client, adm, c["id"], "P1", 100)
    p2 = new_project(client, adm, c["id"], "P2", 200)
    if _has("/api/admin/tasks"):
        new_task(client, adm, p1["id"])
    snap = lambda: (  # noqa: E731
        db_session.execute(text("SELECT id,name,client_id,bill_rate FROM projects ORDER BY id"))
        .all()
        .copy(),
        db_session.execute(text("SELECT * FROM tasks ORDER BY id")).all(),
        db_session.execute(text("SELECT * FROM clients ORDER BY id")).all(),
    )
    before = snap()
    te = inspect(db_session.bind).has_table("time_entries")
    if te:
        before_te = db_session.execute(text("SELECT * FROM time_entries ORDER BY 1")).all()
    r = client.patch(f"/api/admin/projects/{p1['id']}", json={"bill_rate": 135.5}, headers=adm)
    assert r.status_code == 200 and r.json()["bill_rate"] == "135.50"
    db_session.expire_all()
    assert float(db_session.get(Project, p1["id"]).bill_rate) == 135.5
    assert float(db_session.get(Project, p2["id"]).bill_rate) == 200
    after = snap()
    assert before[1:] == after[1:]
    assert [r_ for r_ in before[0] if r_[0] == p2["id"]] == [
        r_ for r_ in after[0] if r_[0] == p2["id"]
    ]
    if te:
        assert before_te == db_session.execute(text("SELECT * FROM time_entries ORDER BY 1")).all()


# ---------- AC-022 / NFR-017 ----------


def test_ac022_no_invoice_or_payment_in_openapi_or_responses(client, adm):
    doc = client.get("/openapi.json").text.lower()
    paths = client.get("/openapi.json").json()["paths"]
    catalogue = [p for p in paths if p.startswith("/api/admin/clients") or "project" in p
                 or "task" in p]
    for p in catalogue:
        assert "invoice" not in p.lower() and "payment" not in p.lower()
    c = new_client(client, adm)
    new_project(client, adm, c["id"])
    body = listing(client, adm)
    low = str(body).lower()
    assert "invoice" not in low and "payment" not in low
    assert doc  # document built


# ---------- AC-023 / AC-024 ----------


def test_ac023_task_listed_for_project_in_admin_and_public(client, adm):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"])
    t = new_task(client, adm, p["id"], "Design")
    proj = next(x for x in listing(client, adm)[0]["projects"] if x["id"] == p["id"])
    assert [x["name"] for x in proj["tasks"]] == ["Design"] and proj["tasks"][0]["id"] == t["id"]
    assert "Design" in flat_names(public(client, adm))


def test_ac023_duplicate_task_name_409(client, adm, db_session):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"])
    new_task(client, adm, p["id"], "Design")
    for n in ("Design", "DESIGN"):
        r = client.post("/api/admin/tasks", json={"project_id": p["id"], "name": n}, headers=adm)
        assert r.status_code == 409
    assert db_session.query(Task).count() == 1


def test_ac024_archived_task_hidden_publicly_kept_in_admin(client, adm):
    c = new_client(client, adm)
    p = new_project(client, adm, c["id"])
    t = new_task(client, adm, p["id"], "OldTask")
    new_task(client, adm, p["id"], "LiveTask")
    r = client.patch(f"/api/admin/tasks/{t['id']}", json={"is_archived": True}, headers=adm)
    assert r.status_code == 200
    tasks = listing(client, adm)[0]["projects"][0]["tasks"]
    old = next(x for x in tasks if x["name"] == "OldTask")
    assert old["is_archived"] is True
    pub = flat_names(public(client, adm))
    assert "OldTask" not in pub and "LiveTask" in pub


# ---------- NFR-007 ----------


@pytest.mark.parametrize(("method", "path"), ADMIN_ROUTES)
def test_nfr007_admin_routes_401_without_session(client, db_session, method, path):
    c = Client(name="Secret Client")
    db_session.add(c)
    db_session.commit()
    r = getattr(client, method)(path, headers=H, **({} if method == "get" else {"json": {}}))
    assert r.status_code == 401
    assert "Secret Client" not in r.text


@pytest.mark.parametrize("role", ["Employee", "Manager", "Payroll Admin"])
@pytest.mark.parametrize(("method", "path"), ADMIN_ROUTES)
def test_nfr007_admin_routes_403_for_non_admin_no_data(client, db_session, role, method, path):
    db_session.add(Client(name="Secret Client"))
    db_session.commit()
    mk(db_session, "cat.x@example.com", role)
    hdr = sign_in(client, "cat.x@example.com")
    r = getattr(client, method)(path, headers=hdr, **({} if method == "get" else {"json": {}}))
    assert r.status_code == 403
    assert "Secret Client" not in r.text


@pytest.mark.parametrize("role", ["Employee", "Manager", "Payroll Admin", "System Admin"])
def test_nfr007_any_role_reads_projects_without_bill_rate(client, adm, db_session, role):
    c = new_client(client, adm)
    new_project(client, adm, c["id"], "Visible", 123.45)
    mk(db_session, "cat.r@example.com", role)
    hdr = sign_in(client, "cat.r@example.com")
    if not _has("/api/projects"):
        pytest.skip("PENDING: GET /api/projects not present yet")
    r = client.get("/api/projects", headers=hdr)
    assert r.status_code == 200 and "Visible" in r.text
    assert "bill_rate" not in r.text and "123.45" not in r.text


def test_nfr007_projects_401_without_session(client):
    if not _has("/api/projects"):
        pytest.skip("PENDING: GET /api/projects not present yet")
    assert client.get("/api/projects").status_code == 401


# ---------- NFR-013 ----------


def test_nfr013_422_bodies_have_field_level_english_messages(client, adm):
    c = new_client(client, adm)
    bodies = [
        ("/api/admin/clients", {"name": ""}, "name"),
        ("/api/admin/projects", {"client_id": c["id"], "name": "", "bill_rate": 1}, "name"),
        ("/api/admin/projects", {"client_id": c["id"], "name": "A", "bill_rate": -1}, "bill_rate"),
    ]
    for path, body, field in bodies:
        r = client.post(path, json=body, headers=adm)
        assert r.status_code == 422
        d = r.json()["detail"]
        assert d[0]["loc"] == ["body", field]
        assert isinstance(d[0]["msg"], str) and len(d[0]["msg"]) > 5


# NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user load) cannot be tested
# here. NFR-014 is covered by AC-021 (time_entries table does not exist yet).
