"""Single-use, time-limited password links: reset (60 minutes) and a new user's first
password (72 hours). Only the token's hash is stored."""

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.config import settings
from app.mailer import SmtpMailer
from app.models import PasswordToken, User, UserSession
from app.security import hash_password, new_token, token_digest

log = logging.getLogger(__name__)

TTL = {"reset": timedelta(minutes=60), "set_initial": timedelta(hours=72)}
_SUBJECT = {
    "reset": "Reset your TimeTrack Pro password",
    "set_initial": "Set up your TimeTrack Pro account",
}
_BODY = {
    "reset": "Someone asked to reset the password for this account. Open this link within "
    "60 minutes to choose a new one:\n\n{link}\n\nIf it wasn't you, ignore this email.",
    "set_initial": "An account has been created for you. Open this link within 72 hours to "
    "set your password:\n\n{link}",
}


def issue_password_token(db: Session, user: User, purpose: str, mailer: SmtpMailer) -> None:
    """Replace any unused link of this user with a new one, commit, then email it."""
    now = datetime.now(UTC)
    db.execute(
        update(PasswordToken)
        .where(PasswordToken.user_id == user.id, PasswordToken.used_at.is_(None))
        .values(used_at=now)
    )
    token = new_token()
    db.add(
        PasswordToken(
            user_id=user.id,
            token_hash=token_digest(token),
            purpose=purpose,
            expires_at=now + TTL[purpose],
        )
    )
    db.commit()
    base = (settings.app_url or settings.allowed_origins[0]).rstrip("/")
    link = f"{base}/sign-in?reset_token={token}"
    try:
        mailer.send(user.email, _SUBJECT[purpose], _BODY[purpose].format(link=link))
    except Exception:  # noqa: BLE001 -- the reply must not reveal whether an account exists
        log.exception("password email not sent", extra={"user_id": user.id, "purpose": purpose})


def use_password_token(db: Session, token: str, new_password: str) -> bool:
    """Set the password from a live token, burn the token and revoke every session.
    False when the token is unknown, used or expired."""
    now = datetime.now(UTC)
    row = db.scalar(
        select(PasswordToken)
        .where(PasswordToken.token_hash == token_digest(token))
        .with_for_update()
    )
    if row is None or row.used_at is not None:
        return False
    expires = row.expires_at if row.expires_at.tzinfo else row.expires_at.replace(tzinfo=UTC)
    user = db.get(User, row.user_id)
    if expires <= now or user is None or not user.is_active:
        return False
    user.password_hash = hash_password(new_password)
    row.used_at = now
    db.execute(
        update(UserSession)
        .where(UserSession.user_id == user.id, UserSession.revoked_at.is_(None))
        .values(revoked_at=now)
    )
    db.commit()
    return True
