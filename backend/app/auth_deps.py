"""Shared authentication and authorisation dependencies."""

from collections.abc import Callable
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserSession
from app.security import token_digest

SESSION_COOKIE = "session"


def session_token(
    session: Annotated[str | None, Cookie(alias=SESSION_COOKIE)] = None,
) -> str | None:
    """The session token from the HttpOnly session cookie."""
    return session or None


def _aware(value: datetime) -> datetime:
    return value if value.tzinfo else value.replace(tzinfo=UTC)


def find_session(db: Session, token: str | None) -> tuple[UserSession, User] | None:
    """The live session and its user for a session token: one indexed query."""
    if not token:
        return None
    row = db.execute(
        select(UserSession, User)
        .join(User, User.id == UserSession.user_id)
        .where(UserSession.token_hash == token_digest(token))
    ).first()
    if row is None:
        return None
    sess, user = row
    if sess.revoked_at is not None or _aware(sess.expires_at) <= datetime.now(UTC):
        return None
    if not user.is_active:
        return None
    return sess, user


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    token: Annotated[str | None, Depends(session_token)],
) -> User:
    found = find_session(db, token)
    if found is None:
        raise HTTPException(status_code=401, detail="Not signed in")
    return found[1]


def require_role(*roles: str) -> Callable[..., User]:
    def checker(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="You do not have access to this resource.")
        return user

    return checker
