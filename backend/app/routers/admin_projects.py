"""System Admin clients and projects. The bill rate is for reporting only."""

from decimal import Decimal, InvalidOperation
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_deps import require_role
from app.database import get_db
from app.models import Client, Project, Task, User

router = APIRouter(prefix="/api/admin", tags=["admin-projects"])
Admin = Annotated[User, Depends(require_role("System Admin"))]
Db = Annotated[Session, Depends(get_db)]

REQUIRED = "This field is required."
RATE_MSG = (
    "The bill rate must be a number of 0 or more, such as 145.00. "
    "Negative values and text are not accepted."
)
ARCHIVED = "This client is archived. Projects cannot be added or changed while it is archived."
_MAX_RATE = Decimal("99999999.99")


class TaskOut(BaseModel):
    id: int
    project_id: int
    name: str
    is_archived: bool


class ProjectOut(BaseModel):
    id: int
    client_id: int
    name: str
    bill_rate: str
    default_billable: bool
    tasks: list[TaskOut]


class ClientOut(BaseModel):
    id: int
    name: str
    is_archived: bool
    projects: list[ProjectOut]


class ClientCreate(BaseModel):
    name: Any = None


class ClientUpdate(BaseModel):
    name: Any = None
    is_archived: bool | None = None


class ProjectCreate(BaseModel):
    client_id: int
    name: Any = None
    bill_rate: Any = None
    default_billable: bool = True


class ProjectUpdate(BaseModel):
    name: Any = None
    bill_rate: Any = None
    default_billable: bool | None = None


def _invalid(field: str, msg: str) -> HTTPException:
    return HTTPException(status_code=422, detail=[{"loc": ["body", field], "msg": msg}])


def _name(value: Any) -> str:
    if value is None or (isinstance(value, str) and not value.strip()):
        raise _invalid("name", REQUIRED)
    if not isinstance(value, str):
        raise _invalid("name", "Enter a name.")
    value = value.strip()
    if len(value) > 200:
        raise _invalid("name", "The name must be 200 characters or fewer.")
    return value


def _rate(value: Any) -> Decimal:
    if isinstance(value, bool) or not isinstance(value, int | float | str):
        raise _invalid("bill_rate", RATE_MSG)
    try:
        rate = Decimal(str(value).strip())
    except InvalidOperation:
        raise _invalid("bill_rate", RATE_MSG) from None
    exponent = rate.as_tuple().exponent
    if (
        not rate.is_finite()
        or rate < 0
        or rate > _MAX_RATE
        or not isinstance(exponent, int)
        or exponent < -2
    ):
        raise _invalid("bill_rate", RATE_MSG)
    return rate.quantize(Decimal("0.01"))


def _project_out(project: Project, tasks: list[Task]) -> ProjectOut:
    return ProjectOut(
        id=project.id,
        client_id=project.client_id,
        name=project.name,
        bill_rate=f"{project.bill_rate:.2f}",
        default_billable=project.default_billable,
        tasks=[TaskOut.model_validate(t, from_attributes=True) for t in tasks],
    )


def _client_out(client: Client, projects: list[ProjectOut]) -> ClientOut:
    return ClientOut(
        id=client.id, name=client.name, is_archived=client.is_archived, projects=projects
    )


def _client_dup(name: str) -> HTTPException:
    return HTTPException(
        status_code=409,
        detail=f"A client called “{name}” already exists. Client names must be unique.",
    )


def _project_dup(client: Client, name: str) -> HTTPException:
    return HTTPException(
        status_code=409, detail=f"{client.name} already has a project called “{name}”."
    )


def _commit(db: Session, error: HTTPException) -> None:
    try:
        db.commit()
    except IntegrityError as exc:  # a concurrent request took the name
        db.rollback()
        raise error from exc


def _client_taken(db: Session, name: str, own_id: int | None = None) -> bool:
    other = db.scalar(select(Client.id).where(func.lower(Client.name) == name.lower()))
    return other is not None and other != own_id


def _project_taken(db: Session, client_id: int, name: str, own_id: int | None = None) -> bool:
    other = db.scalar(
        select(Project.id).where(
            Project.client_id == client_id, func.lower(Project.name) == name.lower()
        )
    )
    return other is not None and other != own_id


def _tasks_of(db: Session, project_id: int) -> list[Task]:
    return list(db.scalars(select(Task).where(Task.project_id == project_id).order_by(Task.name)))


def _full_client(db: Session, client: Client) -> ClientOut:
    projects = db.scalars(
        select(Project).where(Project.client_id == client.id).order_by(Project.name, Project.id)
    )
    return _client_out(client, [_project_out(p, _tasks_of(db, p.id)) for p in projects])


@router.get("/clients", response_model=list[ClientOut])
def list_clients(_: Admin, db: Db) -> list[ClientOut]:
    tasks: dict[int, list[Task]] = {}
    for task in db.scalars(select(Task).order_by(Task.name, Task.id)):
        tasks.setdefault(task.project_id, []).append(task)
    projects: dict[int, list[ProjectOut]] = {}
    for project in db.scalars(select(Project).order_by(Project.name, Project.id)):
        projects.setdefault(project.client_id, []).append(
            _project_out(project, tasks.get(project.id, []))
        )
    clients = db.scalars(select(Client).order_by(func.lower(Client.name), Client.id))
    return [_client_out(c, projects.get(c.id, [])) for c in clients]


@router.post("/clients", response_model=ClientOut, status_code=201)
def create_client(body: ClientCreate, _: Admin, db: Db) -> ClientOut:
    name = _name(body.name)
    if _client_taken(db, name):
        raise _client_dup(name)
    client = Client(name=name, is_archived=False)
    db.add(client)
    _commit(db, _client_dup(name))
    return _client_out(client, [])


@router.patch("/clients/{client_id}", response_model=ClientOut)
def update_client(client_id: int, body: ClientUpdate, _: Admin, db: Db) -> ClientOut:
    client = db.get(Client, client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found.")
    changes = body.model_dump(exclude_unset=True)
    if "is_archived" in changes and changes["is_archived"] is None:
        raise _invalid("is_archived", REQUIRED)
    if "name" in changes:
        name = _name(changes["name"])
        if _client_taken(db, name, client.id):
            raise _client_dup(name)
        client.name = name
    if "is_archived" in changes:
        client.is_archived = changes["is_archived"]
    _commit(db, _client_dup(client.name))
    return _full_client(db, client)


@router.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(body: ProjectCreate, _: Admin, db: Db) -> ProjectOut:
    name = _name(body.name)
    rate = _rate(body.bill_rate)
    client = db.get(Client, body.client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found.")
    if client.is_archived:
        raise HTTPException(status_code=409, detail=ARCHIVED)
    if _project_taken(db, client.id, name):
        raise _project_dup(client, name)
    project = Project(
        client_id=client.id, name=name, bill_rate=rate, default_billable=body.default_billable
    )
    db.add(project)
    _commit(db, _project_dup(client, name))
    return _project_out(project, [])


class TaskUpdate(BaseModel):
    is_archived: bool | None = None


@router.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, body: TaskUpdate, _: Admin, db: Db) -> Task:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    if body.is_archived is None:
        raise _invalid("is_archived", REQUIRED)
    task.is_archived = body.is_archived
    db.commit()
    return task


@router.patch("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, body: ProjectUpdate, _: Admin, db: Db) -> ProjectOut:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    client = db.get(Client, project.client_id)
    changes = body.model_dump(exclude_unset=True)
    name = _name(changes["name"]) if "name" in changes else None
    rate = _rate(changes["bill_rate"]) if "bill_rate" in changes else None
    if "default_billable" in changes and changes["default_billable"] is None:
        raise _invalid("default_billable", REQUIRED)
    if client.is_archived:
        raise HTTPException(status_code=409, detail=ARCHIVED)
    if name is not None:
        if _project_taken(db, client.id, name, project.id):
            raise _project_dup(client, name)
        project.name = name
    if rate is not None:
        project.bill_rate = rate
    if "default_billable" in changes:
        project.default_billable = changes["default_billable"]
    _commit(db, _project_dup(client, project.name))
    return _project_out(project, _tasks_of(db, project.id))
