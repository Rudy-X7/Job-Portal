from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    original_filename = Column(
        String,
        nullable=False
    )

    stored_filename = Column(
        String,
        nullable=False,
        unique=True
    )

    file_path = Column(
        String,
        nullable=False
    )

    is_default = Column(
        Boolean,
        default=False,
        nullable=False
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="resumes"
    )