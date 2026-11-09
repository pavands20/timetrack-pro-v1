"""recreate the one-open partial unique indexes so every dialect keeps the WHERE clause

Migrations 0004 and 0005 gave the one-running-entry and one-open-break indexes a
PostgreSQL-only predicate. A dialect that ignores it (SQLite, used by some local runs)
built them as plain unique indexes, which wrongly allows only one entry per user and one
break per entry. On PostgreSQL this drops and recreates identical indexes.

Revision ID: 0007
Revises: 0006
Create Date: 2026-11-09
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0007"
down_revision: str | None = "0006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _recreate(name: str, table: str, columns: list[str]) -> None:
    op.drop_index(name, table_name=table)
    op.create_index(
        name,
        table,
        columns,
        unique=True,
        postgresql_where=sa.text("end_at IS NULL"),
        sqlite_where=sa.text("end_at IS NULL"),
    )


def upgrade() -> None:
    _recreate("ux_time_entries_one_open_per_user", "time_entries", ["user_id"])
    _recreate("ux_breaks_one_open_per_entry", "breaks", ["time_entry_id"])


def downgrade() -> None:
    # Recreating the same indexes is the only state the earlier revisions describe on
    # PostgreSQL, so there is nothing to undo.
    pass
