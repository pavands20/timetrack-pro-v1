"""time entries and breaks

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-08
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _fk(target: str) -> sa.ForeignKey:
    return sa.ForeignKey(target, ondelete="RESTRICT")


def upgrade() -> None:
    op.create_table(
        "time_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), _fk("users.id"), nullable=False),
        sa.Column("project_id", sa.Integer(), _fk("projects.id"), nullable=False),
        sa.Column("task_id", sa.Integer(), _fk("tasks.id"), nullable=False),
        sa.Column("billable", sa.Boolean(), nullable=False),
        sa.Column("start_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )
    op.create_index("ix_time_entries_user_id", "time_entries", ["user_id"])
    op.create_index(
        "ux_time_entries_one_open_per_user",
        "time_entries",
        ["user_id"],
        unique=True,
        postgresql_where=sa.text("end_at IS NULL"),
    )
    op.create_table(
        "breaks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("time_entry_id", sa.Integer(), _fk("time_entries.id"), nullable=False),
        sa.Column("start_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_breaks_time_entry_id", "breaks", ["time_entry_id"])


def downgrade() -> None:
    op.drop_table("breaks")
    op.drop_table("time_entries")
