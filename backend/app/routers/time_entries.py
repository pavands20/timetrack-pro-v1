"""Set the end time on an entry the user forgot to clock out of."""

from datetime import UTC, datetime
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth_deps import get_current_user
from app.database import get_db
from app.models import TimeEntry, User
from app.routers.clock import ClockOutOut, _aware, _breaks, _invalid, _seconds, local, utc_iso

router = APIRouter(prefix="/api/time-entries", tags=["time-entries"])
Db = Annotated[Session, Depends(get_db)]
Me = Annotated[User, Depends(get_current_user)]


class EndBody(BaseModel):
    end_at: Any = None


def _parse(value: Any) -> datetime:
    msg = "Enter a valid end date and time."
    if not isinstance(value, str):
        raise _invalid("end_at", msg)
    try:
        parsed = datetime.fromisoformat(value.strip())
    except ValueError:
        raise _invalid("end_at", msg) from None
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        raise _invalid("end_at", msg)
    return parsed.astimezone(UTC)


@router.patch("/{entry_id}/end", response_model=ClockOutOut)
def end_entry(entry_id: int, body: EndBody, user: Me, db: Db) -> ClockOutOut:
    end = _parse(body.end_at)
    entry = db.scalar(
        select(TimeEntry)
        .where(TimeEntry.id == entry_id, TimeEntry.user_id == user.id)
        .with_for_update()
    )
    if entry is None:
        raise HTTPException(status_code=404, detail="Time entry not found.")
    if entry.end_at is not None:
        raise HTTPException(status_code=409, detail="This entry already has an end time.")
    if end <= _aware(entry.start_at):
        raise _invalid("end_at", "End time must be after the start time.")
    if end > datetime.now(UTC):
        raise _invalid("end_at", "End time can't be in the future.")
    breaks = _breaks(db, entry)
    if any(end < _aware(b.start_at) for b in breaks):
        raise _invalid("end_at", "End time must be after your last break started.")
    broken = 0.0
    for b in breaks:
        stop = min(_aware(b.end_at), end) if b.end_at else end
        broken += max(0.0, _seconds(b.start_at, stop))
        if b.end_at is None:
            b.end_at = end
    entry.end_at = end
    net = _seconds(entry.start_at, end) - broken
    db.commit()
    return ClockOutOut(
        id=entry.id,
        start_at=utc_iso(entry.start_at),
        end_at=utc_iso(end),
        duration_minutes=max(0, int(net // 60)),
        work_date=local(entry.start_at, user).date().isoformat(),
        billable=entry.billable,
        project_id=entry.project_id,
        task_id=entry.task_id,
    )
