"""Session endpoints: login, logout, me."""

from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth_deps import SESSION_COOKIE, find_session, get_current_user
from app.config import settings
from app.database import get_db
from app.models import User, UserSession
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


def _cookie_args() -> dict:
    return {
        "path": "/",
        "httponly": True,
        "secure": settings.cookie_secure,
        "samesite": "strict",
    }


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
    response.set_cookie(SESSION_COOKIE, token, max_age=int(ttl.total_seconds()), **_cookie_args())
    return user_out(user)


@router.post("/logout", status_code=204)
def logout(
    db: Annotated[Session, Depends(get_db)],
    session: Annotated[str | None, Cookie()] = None,
) -> Response:
    found = find_session(db, session)
    if found is not None:
        found[0].revoked_at = datetime.now(UTC)
        db.commit()
    response = Response(status_code=204)
    response.delete_cookie(SESSION_COOKIE, **_cookie_args())
    return response


@router.get("/me", response_model=UserOut)
def me(user: Annotated[User, Depends(get_current_user)]) -> UserOut:
    return user_out(user)
