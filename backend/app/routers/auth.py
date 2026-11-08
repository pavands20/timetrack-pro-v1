"""Session endpoints: login, logout, me, and password reset."""

from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth_deps import SESSION_COOKIE, find_session, get_current_user, session_token
from app.config import settings
from app.database import get_db
from app.mailer import SmtpMailer, get_mailer
from app.models import User, UserSession
from app.password_tokens import issue_password_token, use_password_token
from app.security import DUMMY_HASH, new_token, token_digest, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    time_zone: str
    home_path: str


def user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        time_zone=user.time_zone,
        home_path="/admin-users" if user.role == "System Admin" else "/home",
    )


def _secure_cookie() -> bool:
    return settings.environment.lower() not in {"local", "dev", "development"}


@router.post("/login", response_model=UserOut)
def login(
    body: LoginRequest, response: Response, db: Annotated[Session, Depends(get_db)]
) -> UserOut:
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    stored = user.password_hash if user and user.password_hash else DUMMY_HASH
    password_ok = verify_password(stored, body.password)
    if not (user and user.password_hash and user.is_active and password_ok):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = new_token()
    ttl = timedelta(hours=settings.session_ttl_hours)
    db.add(
        UserSession(
            user_id=user.id, token_hash=token_digest(token), expires_at=datetime.now(UTC) + ttl
        )
    )
    db.commit()
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=int(ttl.total_seconds()),
        path="/",
        httponly=True,
        samesite="strict",
        secure=_secure_cookie(),
    )
    return user_out(user)


@router.post("/logout", status_code=204)
def logout(
    db: Annotated[Session, Depends(get_db)],
    token: Annotated[str | None, Depends(session_token)],
) -> Response:
    found = find_session(db, token)
    if found is not None:
        found[0].revoked_at = datetime.now(UTC)
        db.commit()
    resp = Response(status_code=204)
    resp.delete_cookie(
        SESSION_COOKIE, path="/", httponly=True, samesite="strict", secure=_secure_cookie()
    )
    return resp


@router.get("/me", response_model=UserOut)
def me(user: Annotated[User, Depends(get_current_user)]) -> UserOut:
    return user_out(user)


RESET_SENT = {"message": "If that email has an account, a reset link has been sent."}
MIN_PASSWORD = 12


class ResetRequest(BaseModel):
    email: EmailStr


class ResetConfirm(BaseModel):
    token: str = Field(min_length=1)
    new_password: str

    @field_validator("new_password")
    @classmethod
    def _long_enough(cls, value: str) -> str:
        if len(value) < MIN_PASSWORD:
            raise ValueError(f"Password must be at least {MIN_PASSWORD} characters long.")
        return value


@router.post("/password-reset/request", status_code=202)
def request_password_reset(
    body: ResetRequest,
    db: Annotated[Session, Depends(get_db)],
    mailer: Annotated[SmtpMailer, Depends(get_mailer)],
) -> dict[str, str]:
    """The same reply whether or not the account exists (AC-009)."""
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    if user is not None and user.is_active:
        issue_password_token(db, user, "reset", mailer)
    return RESET_SENT


@router.post("/password-reset/confirm", status_code=204)
def confirm_password_reset(body: ResetConfirm, db: Annotated[Session, Depends(get_db)]) -> Response:
    if not use_password_token(db, body.token, body.new_password):
        raise HTTPException(status_code=400, detail="This reset link is invalid or has expired.")
    return Response(status_code=204)
