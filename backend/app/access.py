"""Record-level access: who may see or change records owned by a user."""

from fastapi import HTTPException

from app.models import User


def can_access_own_records(actor: User, owner_id: int) -> bool:
    """AC-005: an Employee sees and changes only their own records. Other roles' wider
    access (a Manager's team, payroll) is decided by the stories that add those views."""
    if actor.role == "Employee" and actor.id != owner_id:
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")
    return True


def forbid_foreign_user_id(actor: User, body_user_id: object) -> None:
    """A Manager's write body may not name another user."""
    if actor.role == "Manager" and body_user_id is not None and body_user_id != actor.id:
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")


def forbid_foreign_entry(db, actor: User, entry_id: int) -> None:  # type: ignore[no-untyped-def]
    """A Manager writing to an existing entry owned by someone else gets 403, not 404."""
    from sqlalchemy import select

    from app.models import TimeEntry

    if actor.role == "Manager" and db.scalar(select(TimeEntry.id).where(TimeEntry.id == entry_id)):
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")
