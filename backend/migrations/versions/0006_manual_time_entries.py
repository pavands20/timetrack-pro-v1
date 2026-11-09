"""manual timesheet hours stored as time entries

Revision ID: 0006
Revises: 0005
Create Date: 2026-11-09
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0006"
down_revision: str | None = "0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "time_entries",
        sa.Column("source", sa.String(10), nullable=False, server_default="clock"),
    )
    op.add_column("time_entries", sa.Column("work_date", sa.Date(), nullable=True))
    op.add_column("time_entries", sa.Column("duration_minutes", sa.Integer(), nullable=True))
    op.create_index(
        "ux_time_entries_manual_cell",
        "time_entries",
        ["user_id", "project_id", "task_id", "work_date", "billable"],
        unique=True,
        postgresql_where=sa.text("source = 'manual'"),
        sqlite_where=sa.text("source = 'manual'"),
    )
    op.create_index("ix_time_entries_user_start", "time_entries", ["user_id", "start_at"])


def downgrade() -> None:
    op.drop_index("ix_time_entries_user_start", table_name="time_entries")
    op.drop_index("ux_time_entries_manual_cell", table_name="time_entries")
    op.drop_column("time_entries", "duration_minutes")
    op.drop_column("time_entries", "work_date")
    op.drop_column("time_entries", "source")
