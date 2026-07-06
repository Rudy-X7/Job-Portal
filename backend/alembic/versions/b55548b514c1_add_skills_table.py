"""Add skills table

Revision ID: b55548b514c1
Revises: 8c960ed0d4a0
Create Date: 2026-07-05 17:25:03.306610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b55548b514c1'
down_revision: Union[str, Sequence[str], None] = '8c960ed0d4a0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id")
    )

    op.create_index(
        op.f("ix_skills_id"),
        "skills",
        ["id"],
        unique=False
    )

    op.create_index(
        op.f("ix_skills_name"),
        "skills",
        ["name"],
        unique=True
    )

def downgrade() -> None:
    op.drop_index(
        op.f("ix_skills_name"),
        table_name="skills"
    )

    op.drop_index(
        op.f("ix_skills_id"),
        table_name="skills"
    )

    op.drop_table("skills")
    