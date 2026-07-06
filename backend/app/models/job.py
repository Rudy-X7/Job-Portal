from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func

from app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False,
        index=True
    )

    company = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    requirements = Column(
        Text,
        nullable=False
    )

    employment_type = Column(
        String,
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )