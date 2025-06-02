from sqlalchemy import Column, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from backend.db import Base

class UserQuestionSet(Base):
    __tablename__ = "userquestionset"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    question_ids = Column(JSON, nullable=False)  # List of question UUIDs
    created_at = Column(DateTime, default=datetime.utcnow)