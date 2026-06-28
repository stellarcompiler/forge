from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from backend.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
