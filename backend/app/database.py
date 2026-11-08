"""Engine, session factory and the request-scoped session dependency.

The approved architecture names PostgreSQL 16 (timestamptz, jsonb, enums and partial
unique indexes), so there is no SQLite fallback: `DATABASE_URL` is read from the
environment and defaults to the Postgres service in docker-compose.yml. The schema
changes only through Alembic migrations (see `migrations/`).
"""

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

DATABASE_URL = settings.database_url

# create_engine does not connect, so importing this module never needs a running database.
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
