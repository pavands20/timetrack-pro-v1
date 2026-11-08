"""Test fixtures: the sandbox's real PostgreSQL, rolled back after every test.

The schema is brought up with Alembic (`upgrade head`) once per session, so the tests
run against the migrations and not against a schema the models merely imply. Each test
works inside an outer transaction that is rolled back at the end, so no row one test
writes is visible to the next and the order the tests run in does not matter.
"""

from collections.abc import Iterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.main import app

_ALEMBIC_INI = Path(__file__).resolve().parent.parent / "alembic.ini"


@pytest.fixture(scope="session", autouse=True)
def _migrated_schema() -> None:
    command.upgrade(Config(str(_ALEMBIC_INI)), "head")


@pytest.fixture
def db_session() -> Iterator[Session]:
    """A session whose work is rolled back when the test ends."""
    connection = engine.connect()
    transaction = connection.begin()
    # join_transaction_mode keeps a `session.commit()` inside the test from committing
    # the outer transaction.
    session = Session(
        bind=connection,
        autoflush=False,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's session and nothing else."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        # https so a Secure session cookie (any ENVIRONMENT) is kept in and sent from the jar.
        yield TestClient(app, base_url="https://testserver")
    finally:
        app.dependency_overrides.clear()
