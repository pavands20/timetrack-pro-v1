"""System Admin user administration: list, create (with a set-password email), edit, deactivate."""

from datetime import UTC, datetime
from typing import Annotated, Literal
from zoneinfo import available_timezones

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_deps import require_role
from app.database import get_db
from app.mailer import SmtpMailer, get_mailer
from app.models import User, UserSession
from app.password_tokens import issue_password_token

router = APIRouter(prefix="/api/admin/users", tags=["admin-users"])
Admin = Annotated[User, Depends(require_role("System Admin"))]
Db = Annotated[Session, Depends(get_db)]
Role = Literal["Employee", "Manager", "Payroll Admin", "System Admin"]
_ZONES = available_timezones()
DUPLICATE = "An account with this email already exists."


def _zone(value: str | None) -> str | None:
    if value is not None and value not in _ZONES:
        raise ValueError("Choose a time zone from the list.")
    return value


class AdminUser(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    time_zone: str
    manager_id: int | None
    is_active: bool


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    role: Role
    time_zone: str
    manager_id: int | None = None

    _tz = field_validator("time_zone")(_zone)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    email: EmailStr | None = None
    role: Role | None = None
    time_zone: str | None = None
    manager_id: int | None = None

    _tz = field_validator("time_zone")(_zone)


def _out(user: User) -> AdminUser:
    return AdminUser.model_validate(user, from_attributes=True)


def _invalid(field: str, msg: str) -> HTTPException:
    return HTTPException(status_code=422, detail=[{"loc": ["body", field], "msg": msg}])


def _get(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


def _check_email_free(db: Session, email: str, user_id: int | None = None) -> None:
    other = db.scalar(select(User.id).where(User.email == email))
    if other is not None and other != user_id:
        raise HTTPException(status_code=409, detail=DUPLICATE)


def _check_manager(db: Session, manager_id: int | None, user_id: int | None = None) -> None:
    """AC-014/AC-016: a manager is an active Manager-role user other than the user."""
    if manager_id is None:
        return
    if manager_id == user_id:
        raise _invalid("manager_id", "A user cannot be their own manager.")
    manager = db.get(User, manager_id)
    if manager is None or manager.role != "Manager" or not manager.is_active:
        raise _invalid("manager_id", "Choose an active user with the Manager role.")


def _commit(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:  # a concurrent create took the email
        db.rollback()
        raise HTTPException(status_code=409, detail=DUPLICATE) from exc


@router.get("", response_model=list[AdminUser])
def list_users(_: Admin, db: Db) -> list[AdminUser]:
    return [_out(u) for u in db.scalars(select(User).order_by(User.full_name, User.id))]


@router.post("", response_model=AdminUser, status_code=201)
def create_user(
    body: UserCreate, _: Admin, db: Db, mailer: Annotated[SmtpMailer, Depends(get_mailer)]
) -> AdminUser:
    email = body.email.lower()
    _check_email_free(db, email)
    _check_manager(db, body.manager_id)
    user = User(
        full_name=body.full_name.strip(),
        email=email,
        role=body.role,
        time_zone=body.time_zone,
        manager_id=body.manager_id,
        is_active=True,
    )
    db.add(user)
    _commit(db)
    issue_password_token(db, user, "set_initial", mailer)
    return _out(user)


@router.patch("/{user_id}", response_model=AdminUser)
def update_user(user_id: int, body: UserUpdate, _: Admin, db: Db) -> AdminUser:
    user = _get(db, user_id)
    changes = body.model_dump(exclude_unset=True)
    for field in ("full_name", "email", "role", "time_zone"):
        if field in changes and changes[field] is None:
            raise _invalid(field, "This field is required.")
    if "email" in changes:
        changes["email"] = changes["email"].lower()
        _check_email_free(db, changes["email"], user.id)
    if "manager_id" in changes:
        _check_manager(db, changes["manager_id"], user.id)
    if changes.get("role", "Manager") != "Manager" and user.role == "Manager":
        reports = db.scalar(select(User.id).where(User.manager_id == user.id).limit(1))
        if reports is not None:
            raise _invalid("role", "Reassign this manager's team before changing their role.")
    if "full_name" in changes:
        changes["full_name"] = changes["full_name"].strip()
    for field, value in changes.items():
        setattr(user, field, value)
    _commit(db)
    return _out(user)


@router.post("/{user_id}/deactivate", response_model=AdminUser)
def deactivate_user(user_id: int, admin: Admin, db: Db) -> AdminUser:
    """AC-016: the user can no longer sign in; their records are kept."""
    user = _get(db, user_id)
    if user.id == admin.id:
        raise HTTPException(status_code=409, detail="You cannot deactivate your own account.")
    user.is_active = False
    db.execute(
        update(UserSession)
        .where(UserSession.user_id == user.id, UserSession.revoked_at.is_(None))
        .values(revoked_at=datetime.now(UTC))
    )
    db.commit()
    return _out(user)
