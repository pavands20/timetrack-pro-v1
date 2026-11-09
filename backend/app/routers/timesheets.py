"""Weekly timesheet: manual hours per day, project and task next to clocked entries."""

from datetime import UTC, date, datetime, time, timedelta
from typing import Annotated, Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_deps import get_current_user
from app.database import get_db
from app.models import Break, Client, Project, Task, TimeEntry, User

router = APIRouter(prefix="/api/timesheets", tags=["timesheets"])
entries_router = APIRouter(prefix="/api/time-entries", tags=["timesheets"])
Db = Annotated[Session, Depends(get_db)]
Me = Annotated[User, Depends(get_current_user)]

REQUIRED = "This field is required."
NOT_MONDAY = "The week must start on a Monday."
MAX_MINUTES = 1440
MAX_CELLS = 200


def _err(loc: list[Any], msg: str) -> dict[str, Any]:
    return {"loc": loc, "msg": msg}


def _unprocessable(errors: list[dict[str, Any]]) -> HTTPException:
    return HTTPException(status_code=422, detail=errors)


def _aware(value: datetime) -> datetime:
    return value if value.tzinfo else value.replace(tzinfo=UTC)


def _parse_date(value: Any) -> date | None:
    if not isinstance(value, str):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def _monday(value: Any, loc: list[Any]) -> date:
    if value is None:
        raise _unprocessable([_err(loc, REQUIRED)])
    day = _parse_date(value)
    if day is None:
        raise _unprocessable([_err(loc, "Enter the week start as YYYY-MM-DD.")])
    if day.weekday() != 0:
        raise _unprocessable([_err(loc, NOT_MONDAY)])
    return day


def _midnight_utc(day: date, tz: ZoneInfo) -> datetime:
    return datetime.combine(day, time.min, tzinfo=tz).astimezone(UTC)


def _manual(db: Session, user: User, monday: date) -> list[TimeEntry]:
    return list(
        db.scalars(
            select(TimeEntry).where(
                TimeEntry.user_id == user.id,
                TimeEntry.source == "manual",
                TimeEntry.work_date >= monday,
                TimeEntry.work_date <= monday + timedelta(days=6),
            )
        )
    )


def _clocked(db: Session, user: User, monday: date) -> list[tuple[TimeEntry, date, int]]:
    """Closed clock entries starting in the local week: (entry, local date, net minutes)."""
    tz = ZoneInfo(user.time_zone)
    entries = list(
        db.scalars(
            select(TimeEntry).where(
                TimeEntry.user_id == user.id,
                TimeEntry.source == "clock",
                TimeEntry.end_at.is_not(None),
                TimeEntry.start_at >= _midnight_utc(monday, tz),
                TimeEntry.start_at < _midnight_utc(monday + timedelta(days=7), tz),
            )
        )
    )
    broken: dict[int, float] = {}
    if entries:
        for b in db.scalars(
            select(Break).where(Break.time_entry_id.in_([e.id for e in entries]))
        ):
            end = b.end_at or next(e.end_at for e in entries if e.id == b.time_entry_id)
            secs = (_aware(end) - _aware(b.start_at)).total_seconds()
            broken[b.time_entry_id] = broken.get(b.time_entry_id, 0.0) + max(0.0, secs)
    out = []
    for e in entries:
        net = (_aware(e.end_at) - _aware(e.start_at)).total_seconds() - broken.get(e.id, 0.0)
        out.append((e, _aware(e.start_at).astimezone(tz).date(), max(0, int(net // 60))))
    return out


def _render(db: Session, user: User, monday: date) -> dict[str, Any]:
    manual = _manual(db, user, monday)
    clocked = _clocked(db, user, monday)
    keys = {(e.project_id, e.task_id, e.billable) for e in manual}
    keys |= {(e.project_id, e.task_id, e.billable) for e, _, _ in clocked}
    meta = {}
    task_ids = {k[1] for k in keys}
    if task_ids:
        for task, project, client in db.execute(
            select(Task, Project, Client)
            .join(Project, Project.id == Task.project_id)
            .join(Client, Client.id == Project.client_id)
            .where(Task.id.in_(task_ids))
        ):
            meta[task.id] = (task, project, client)
    rows: dict[tuple[int, int, bool], list[dict[str, Any]]] = {
        k: [
            {
                "date": (monday + timedelta(days=i)).isoformat(),
                "manual_minutes": 0,
                "clocked_minutes": 0,
                "manual_entry_id": None,
                "clocked_entry_ids": [],
            }
            for i in range(7)
        ]
        for k in keys
    }
    totals = [0] * 7
    for e in manual:
        i = (e.work_date - monday).days
        day = rows[(e.project_id, e.task_id, e.billable)][i]
        day["manual_minutes"] = e.duration_minutes or 0
        day["manual_entry_id"] = e.id
        totals[i] += day["manual_minutes"]
    for e, local_date, minutes in clocked:
        i = (local_date - monday).days
        day = rows[(e.project_id, e.task_id, e.billable)][i]
        day["clocked_minutes"] += minutes
        day["clocked_entry_ids"].append(e.id)
        totals[i] += minutes

    def order(k: tuple[int, int, bool]) -> tuple[str, str, str, int, int]:
        task, project, client = meta[k[1]]
        return (client.name.lower(), project.name.lower(), task.name.lower(), -int(k[2]), task.id)

    out_rows = []
    for k in sorted(rows, key=order):
        task, project, client = meta[k[1]]
        out_rows.append(
            {
                "project_id": project.id,
                "project_name": project.name,
                "client_name": client.name,
                "task_id": task.id,
                "task_name": task.name,
                "task_archived": task.is_archived,
                "billable": k[2],
                "days": rows[k],
            }
        )
    return {
        "week_start": monday.isoformat(),
        "week_end": (monday + timedelta(days=6)).isoformat(),
        "time_zone": user.time_zone,
        "rows": out_rows,
        "day_totals_minutes": totals,
        "week_total_minutes": sum(totals),
    }


@router.get("/{week_start}")
def get_week(week_start: str, user: Me, db: Db) -> dict[str, Any]:
    return _render(db, user, _monday(week_start, ["path", "week_start"]))


class CellsBody(BaseModel):
    week_start: Any = None
    cells: Any = None


def _check_cell(cell: Any, i: int, monday: date, errors: list[dict[str, Any]]) -> dict | None:
    if not isinstance(cell, dict):
        errors.append(_err(["body", "cells", i], "Each cell must be an object."))
        return None
    start = len(errors)
    parsed: dict[str, Any] = {}

    def loc(field: str) -> list[Any]:
        return ["body", "cells", i, field]

    for field in ("project_id", "task_id"):
        value = cell.get(field)
        if value is None:
            errors.append(_err(loc(field), REQUIRED))
        elif isinstance(value, bool) or not isinstance(value, int):
            errors.append(_err(loc(field), "Choose an existing " + field[:-3] + "."))
        else:
            parsed[field] = value
    billable = cell.get("billable")
    if billable is None:
        errors.append(_err(loc("billable"), REQUIRED))
    elif not isinstance(billable, bool):
        errors.append(_err(loc("billable"), "Billable must be true or false."))
    else:
        parsed["billable"] = billable
    raw_date = cell.get("date")
    if raw_date is None:
        errors.append(_err(loc("date"), REQUIRED))
    else:
        day = _parse_date(raw_date)
        if day is None:
            errors.append(_err(loc("date"), "Enter a date as YYYY-MM-DD."))
        elif not monday <= day <= monday + timedelta(days=6):
            errors.append(_err(loc("date"), "The date must be inside the selected week."))
        else:
            parsed["date"] = day
    minutes = cell.get("minutes")
    if minutes is None:
        errors.append(_err(loc("minutes"), REQUIRED))
    elif isinstance(minutes, bool) or not isinstance(minutes, int | float):
        errors.append(_err(loc("minutes"), "Hours must be a number."))
    elif minutes != minutes or minutes in (float("inf"), float("-inf")):
        errors.append(_err(loc("minutes"), "Hours must be a number."))
    elif minutes < 0:
        errors.append(_err(loc("minutes"), "Hours can't be negative."))
    elif minutes > MAX_MINUTES:
        errors.append(_err(loc("minutes"), "A day can't have more than 24 hours."))
    elif minutes != int(minutes):
        errors.append(_err(loc("minutes"), "Hours must be a whole number of minutes."))
    else:
        parsed["minutes"] = int(minutes)
    return parsed if len(errors) == start else None


@router.put("/cells")
def put_cells(body: CellsBody, user: Me, db: Db) -> dict[str, Any]:
    monday = _monday(body.week_start, ["body", "week_start"])
    if body.cells is None:
        raise _unprocessable([_err(["body", "cells"], REQUIRED)])
    if not isinstance(body.cells, list):
        raise _unprocessable([_err(["body", "cells"], "Cells must be a list.")])
    if len(body.cells) > MAX_CELLS:
        raise _unprocessable([_err(["body", "cells"], "Save at most 200 cells at a time.")])
    errors: list[dict[str, Any]] = []
    cells: dict[tuple[int, int, bool, date], tuple[int, int]] = {}  # key -> (minutes, index)
    for i, raw in enumerate(body.cells):
        c = _check_cell(raw, i, monday, errors)
        if c:
            cells[(c["project_id"], c["task_id"], c["billable"], c["date"])] = (c["minutes"], i)

    existing = {
        (e.project_id, e.task_id, e.billable, e.work_date): e for e in _manual(db, user, monday)
    }
    new_keys = [k for k in cells if k not in existing]
    projects = {
        p.id: p
        for p in db.scalars(select(Project).where(Project.id.in_({k[0] for k in cells})))
    }
    tasks = {t.id: t for t in db.scalars(select(Task).where(Task.id.in_({k[1] for k in cells})))}
    archived_clients = {
        c.id
        for c in db.scalars(
            select(Client).where(
                Client.id.in_({p.client_id for p in projects.values()}),
                Client.is_archived.is_(True),
            )
        )
    }
    for key, (_, i) in cells.items():
        project, task = projects.get(key[0]), tasks.get(key[1])
        is_new = key in new_keys
        if project is None:
            errors.append(_err(["body", "cells", i, "project_id"], "Choose an existing project."))
        elif is_new and project.client_id in archived_clients:
            errors.append(
                _err(
                    ["body", "cells", i, "project_id"],
                    "This project's client is archived. Choose another project.",
                )
            )
        if task is None or (project is not None and task.project_id != project.id):
            errors.append(
                _err(["body", "cells", i, "task_id"], "Choose a task that belongs to this project.")
            )
        elif is_new and task.is_archived:
            msg = "This task is archived. Choose an active task."
            errors.append(_err(["body", "cells", i, "task_id"], msg))

    if not errors:
        totals: dict[date, int] = {}
        last_index: dict[date, int] = {}
        for k, e in existing.items():
            if k not in cells:
                totals[k[3]] = totals.get(k[3], 0) + (e.duration_minutes or 0)
        for k, (minutes, i) in cells.items():
            totals[k[3]] = totals.get(k[3], 0) + minutes
            last_index[k[3]] = max(last_index.get(k[3], 0), i)
        for _, d, minutes in _clocked(db, user, monday):
            totals[d] = totals.get(d, 0) + minutes
        for d, total in totals.items():
            if total > MAX_MINUTES and d in last_index:
                errors.append(
                    _err(
                        ["body", "cells", last_index[d], "minutes"],
                        "A day can't have more than 24 hours.",
                    )
                )
    if errors:
        raise _unprocessable(sorted(errors, key=lambda e: [str(x) for x in e["loc"]]))

    tz = ZoneInfo(user.time_zone)
    for key, (minutes, _) in cells.items():
        start = _midnight_utc(key[3], tz)
        entry = existing.get(key)
        if entry is None:
            entry = TimeEntry(
                user_id=user.id,
                project_id=key[0],
                task_id=key[1],
                billable=key[2],
                source="manual",
                work_date=key[3],
            )
            db.add(entry)
        entry.start_at = start
        entry.end_at = start + timedelta(minutes=minutes)
        entry.duration_minutes = minutes
    try:
        db.commit()
    except IntegrityError as exc:  # a concurrent save created the same cell
        db.rollback()
        raise HTTPException(
            status_code=409, detail="These hours were changed by another save. Try again."
        ) from exc
    return _render(db, user, monday)


class BillableBody(BaseModel):
    billable: bool


@entries_router.patch("/{entry_id}")
def patch_entry(entry_id: int, body: BillableBody, user: Me, db: Db) -> dict[str, Any]:
    entry = db.scalar(
        select(TimeEntry).where(TimeEntry.id == entry_id, TimeEntry.user_id == user.id)
    )
    if entry is None:
        raise HTTPException(status_code=404, detail="Time entry not found.")
    collision = HTTPException(
        status_code=409,
        detail="You already have manual hours for this project and task on that day with "
        "that billable setting. Edit that entry instead.",
    )
    if entry.billable != body.billable:
        if entry.source == "manual" and db.scalar(
            select(TimeEntry.id).where(
                TimeEntry.user_id == user.id,
                TimeEntry.source == "manual",
                TimeEntry.project_id == entry.project_id,
                TimeEntry.task_id == entry.task_id,
                TimeEntry.work_date == entry.work_date,
                TimeEntry.billable == body.billable,
                TimeEntry.id != entry.id,
            )
        ):
            raise collision
        entry.billable = body.billable
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise collision from exc
    return {
        "id": entry.id,
        "project_id": entry.project_id,
        "task_id": entry.task_id,
        "billable": entry.billable,
        "source": entry.source,
    }
