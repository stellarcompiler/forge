from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from backend.database.connection import Base
from backend.models.user import User  # noqa: F401


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    idea = Column(Text, nullable=False)
    timeline_weeks = Column(Integer, nullable=False)
    status = Column(
        Enum("planning", "active", "completed"),
        nullable=False,
        default="planning",
        server_default="planning"
    )
    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
