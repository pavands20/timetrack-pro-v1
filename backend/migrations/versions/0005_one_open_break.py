"""at most one open break per time entry

Revision ID: 0005
Revises: 0004
Create Date: 2026-11-09
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: str | None = "0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index(
        "ux_breaks_one_open_per_entry",
        "breaks",
        ["time_entry_id"],
        unique=True,
        postgresql_where=sa.text("end_at IS NULL"),
    )


def downgrade() -> None:
    op.drop_index("ux_breaks_one_open_per_entry", table_name="breaks")
