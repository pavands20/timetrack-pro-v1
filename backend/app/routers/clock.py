"""Clock in, clock out and status. A user only ever sees their own entry."""

from datetime import UTC, datetime
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_deps import get_current_user
from app.database import get_db
from app.models import Break, Client, Project, Task, TimeEntry, User

router = APIRouter(prefix="/api/clock", tags=["clock"])
Db = Annotated[Session, Depends(get_db)]
Me = Annotated[User, Depends(get_current_user)]

NOT_CLOCKED_IN = "You are not clocked in, so there is nothing to clock out of."


class EntryOut(BaseModel):
    id: int
    project_id: int
    project_name: str
    client_name: str
    task_id: int
    task_name: str
    billable: bool
    start_at: str
    on_break: bool
    break_minutes: int


class StatusOut(BaseModel):
    entry: EntryOut | None


class ClockInBody(BaseModel):
    project_id: int
    task_id: int
    billable: bool


class ClockOutOut(BaseModel):
    id: int
    start_at: str
    end_at: str
    duration_minutes: int
    work_date: str
    billable: bool
    project_id: int
    task_id: int


def utc_iso(value: datetime) -> str:
    """ISO-8601 in UTC with a Z suffix (NFR-009)."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def local(value: datetime, user: User) -> datetime:
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(ZoneInfo(user.time_zone))


def _seconds(start: datetime, end: datetime) -> float:
    return (end - start).total_seconds()


def _break_seconds(breaks: list[Break], now: datetime) -> float:
    return sum(max(0.0, _seconds(b.start_at, b.end_at or now)) for b in breaks)


def _breaks(db: Session, entry: TimeEntry) -> list[Break]:
    return list(db.scalars(select(Break).where(Break.time_entry_id == entry.id)))


def _invalid(field: str, msg: str) -> HTTPException:
    return HTTPException(status_code=422, detail=[{"loc": ["body", field], "msg": msg}])


def _entry_out(db: Session, entry: TimeEntry) -> EntryOut:
    project = db.get(Project, entry.project_id)
    client = db.get(Client, project.client_id)
    task = db.get(Task, entry.task_id)
    breaks = _breaks(db, entry)
    now = datetime.now(UTC)
    return EntryOut(
        id=entry.id,
        project_id=project.id,
        project_name=project.name,
        client_name=client.name,
        task_id=task.id,
        task_name=task.name,
        billable=entry.billable,
        start_at=utc_iso(entry.start_at),
        on_break=any(b.end_at is None for b in breaks),
        break_minutes=int(_break_seconds(breaks, now) // 60),
    )


def _running(db: Session, user: User, lock: bool = False) -> TimeEntry | None:
    stmt = select(TimeEntry).where(TimeEntry.user_id == user.id, TimeEntry.end_at.is_(None))
    return db.scalar(stmt.with_for_update() if lock else stmt)


def _already(entry: TimeEntry, user: User) -> HTTPException:
    at = local(entry.start_at, user).strftime("%H:%M")
    return HTTPException(
        status_code=409,
        detail=f"You are already clocked in since {at}. "
        "Clock out before starting a new entry.",
    )


@router.get("/status", response_model=StatusOut)
def clock_status(user: Me, db: Db) -> StatusOut:
    entry = _running(db, user)
    return StatusOut(entry=_entry_out(db, entry) if entry else None)


@router.post("/in", response_model=EntryOut, status_code=201)
def clock_in(body: ClockInBody, user: Me, db: Db) -> EntryOut:
    running = _running(db, user)
    if running is not None:
        raise _already(running, user)
    project = db.get(Project, body.project_id)
    if project is None:
        raise _invalid("project_id", "Choose an existing project.")
    client = db.get(Client, project.client_id)
    if client.is_archived:
        raise _invalid("project_id", "This project's client is archived. Choose another project.")
    task = db.get(Task, body.task_id)
    if task is None or task.project_id != project.id:
        raise _invalid("task_id", "Choose a task that belongs to this project.")
    if task.is_archived:
        raise _invalid("task_id", "This task is archived. Choose an active task.")
    entry = TimeEntry(
        user_id=user.id,
        project_id=project.id,
        task_id=task.id,
        billable=body.billable,
        start_at=datetime.now(UTC),
    )
    db.add(entry)
    try:
        db.commit()
    except IntegrityError as exc:  # a concurrent clock-in won the unique index
        db.rollback()
        other = _running(db, user)
        if other is None:
            raise
        raise _already(other, user) from exc
    return _entry_out(db, entry)


@router.post("/out", response_model=ClockOutOut)
def clock_out(user: Me, db: Db) -> ClockOutOut:
    entry = _running(db, user, lock=True)
    if entry is None:
        raise HTTPException(status_code=409, detail=NOT_CLOCKED_IN)
    now = datetime.now(UTC)
    breaks = _breaks(db, entry)
    for b in breaks:
        if b.end_at is None:
            b.end_at = now
    entry.end_at = now
    net = _seconds(entry.start_at, now) - _break_seconds(breaks, now)
    db.commit()
    return ClockOutOut(
        id=entry.id,
        start_at=utc_iso(entry.start_at),
        end_at=utc_iso(now),
        duration_minutes=max(0, int(net // 60)),
        work_date=local(entry.start_at, user).date().isoformat(),
        billable=entry.billable,
        project_id=entry.project_id,
        task_id=entry.task_id,
    )
