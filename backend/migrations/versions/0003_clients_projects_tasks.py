"""clients, projects and tasks

Revision ID: 0003
Revises: 0002
Create Date: 2026-11-08
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _created_at() -> sa.Column:
    return sa.Column(
        "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
    )


def upgrade() -> None:
    op.create_table(
        "clients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("is_archived", sa.Boolean(), nullable=False, server_default=sa.false()),
        _created_at(),
    )
    op.create_index("ix_clients_name_lower", "clients", [sa.text("lower(name)")], unique=True)
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "client_id",
            sa.Integer(),
            sa.ForeignKey("clients.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("bill_rate", sa.Numeric(10, 2), nullable=False),
        sa.Column("default_billable", sa.Boolean(), nullable=False, server_default=sa.true()),
        _created_at(),
    )
    op.create_index(
        "ix_projects_client_name_lower",
        "projects",
        ["client_id", sa.text("lower(name)")],
        unique=True,
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "project_id",
            sa.Integer(),
            sa.ForeignKey("projects.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("is_archived", sa.Boolean(), nullable=False, server_default=sa.false()),
        _created_at(),
    )
    op.create_index(
        "ix_tasks_project_name_lower",
        "tasks",
        ["project_id", sa.text("lower(name)")],
        unique=True,
    )


def downgrade() -> None:
    op.drop_table("tasks")
    op.drop_table("projects")
    op.drop_table("clients")
