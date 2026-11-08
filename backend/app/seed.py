"""Create the first System Admin.

Run with `python -m app.seed` (the container does this before it serves). Reads
BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD; does nothing if either is unset
or if any user already exists.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models import User
from app.security import hash_password


def seed_admin(db: Session, email: str, password: str) -> bool:
    if not email or not password or db.scalar(select(User.id).limit(1)) is not None:
        return False
    db.add(
        User(
            full_name="System Admin",
            email=email.strip().lower(),
            password_hash=hash_password(password),
            role="System Admin",
            time_zone="Europe/London",
            is_active=True,
        )
    )
    db.commit()
    return True


def main() -> None:
    with SessionLocal() as db:
        seed_admin(db, settings.bootstrap_admin_email, settings.bootstrap_admin_password)


if __name__ == "__main__":
    main()
