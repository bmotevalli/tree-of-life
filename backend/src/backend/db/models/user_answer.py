from sqlalchemy import Column, DateTime, JSON, Date
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from backend.db import Base

class UserAnswer(Base):
    __tablename__ = "useranswer"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    date = Column(Date, nullable=False)
    answers = Column(JSON, nullable=False)  # key = question.id, value = response

    created_at = Column(DateTime, default=datetime.utcnow)
