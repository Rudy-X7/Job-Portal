from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    password_hash = Column(String, nullable=False)

    role = Column(String, default="candidate")

    phone = Column(String, nullable=True)

    headline = Column(String, nullable=True)

    bio = Column(Text, nullable=True)

    experience = Column(Integer, nullable=True)

    location = Column(String, nullable=True)

    linkedin = Column(String, nullable=True)

    github = Column(String, nullable=True)

    profile_image = Column(String, nullable=True)
    resumes = relationship(
    "Resume",
    back_populates="user",
    cascade="all, delete-orphan"
)