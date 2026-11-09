"""Read-only Manager view of direct reports. Role, active state and manager_id are read
from the database on every request; there is no write route here."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth_deps import require_role
from app.database import get_db
from app.models import User
from app.routers.timesheets import _monday, _render

router = APIRouter(prefix="/api/team", tags=["team"])
Db = Annotated[Session, Depends(get_db)]
Manager = Annotated[User, Depends(require_role("Manager"))]
FORBIDDEN = "You do not have access to this resource."


def active_report(db: Session, manager: User, user_id: int) -> User:
    """The active direct report, else 403 (also for an unknown id: no existence leak)."""
    report = db.get(User, user_id)
    if report is None or not report.is_active or report.manager_id != manager.id:
        raise HTTPException(status_code=403, detail=FORBIDDEN)
    return report


@router.get("/members")
def list_members(manager: Manager, db: Db) -> list[dict[str, Any]]:
    rows = db.scalars(
        select(User)
        .where(User.manager_id == manager.id, User.is_active.is_(True))
        .order_by(User.full_name, User.id)
    )
    return [{"id": u.id, "name": u.full_name, "time_zone": u.time_zone} for u in rows]


@router.get("/members/{user_id}/timesheets/{week_start}")
def member_week(user_id: int, week_start: str, manager: Manager, db: Db) -> dict[str, Any]:
    report = active_report(db, manager, user_id)
    data = _render(db, report, _monday(week_start, ["path", "week_start"]))
    billable = sum(e["minutes"] for e in data["entries"] if e["billable"])
    return {
        "user_id": report.id,
        "user_name": report.full_name,
        **data,
        "billable_minutes": billable,
        "non_billable_minutes": data["week_total_minutes"] - billable,
    }
