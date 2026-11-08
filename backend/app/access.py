"""Record-level access: who may see or change records owned by a user."""

from fastapi import HTTPException

from app.models import User


def can_access_own_records(actor: User, owner_id: int) -> bool:
    """AC-005: an Employee sees and changes only their own records. Other roles' wider
    access (a Manager's team, payroll) is decided by the stories that add those views."""
    if actor.role == "Employee" and actor.id != owner_id:
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")
    return True
