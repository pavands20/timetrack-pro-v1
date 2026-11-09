"""Home dashboard: the signed-in user's hours for the current Monday-to-Sunday week."""

from datetime import UTC, datetime, timedelta
from typing import Annotated, Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth_deps import get_current_user
from app.database import get_db
from app.models import User
from app.routers.timesheets import _clocked, _manual

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
Db = Annotated[Session, Depends(get_db)]
Me = Annotated[User, Depends(get_current_user)]


@router.get("/week")
def get_dashboard_week(user: Me, db: Db) -> dict[str, Any]:
    today = datetime.now(UTC).astimezone(ZoneInfo(user.time_zone)).date()
    monday = today - timedelta(days=today.weekday())
    billable = [0] * 7
    non_billable = [0] * 7
    hours = [(e.work_date, e.duration_minutes or 0, e.billable) for e in _manual(db, user, monday)]
    hours += [(d, m, e.billable) for e, d, m in _clocked(db, user, monday)]
    for day, minutes, is_billable in hours:
        i = (day - monday).days
        if 0 <= i < 7:
            (billable if is_billable else non_billable)[i] += minutes
    days = [
        {
            "date": (monday + timedelta(days=i)).isoformat(),
            "total_minutes": billable[i] + non_billable[i],
            "billable_minutes": billable[i],
            "non_billable_minutes": non_billable[i],
        }
        for i in range(7)
    ]
    return {
        "week_start": monday.isoformat(),
        "week_end": (monday + timedelta(days=6)).isoformat(),
        "time_zone": user.time_zone,
        "total_minutes": sum(billable) + sum(non_billable),
        "billable_minutes": sum(billable),
        "non_billable_minutes": sum(non_billable),
        "has_entries": bool(hours),
        "days": days,
    }
