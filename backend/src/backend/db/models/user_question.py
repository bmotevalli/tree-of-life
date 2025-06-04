from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from backend.db import BaseModel


class QuestionTimeTable(BaseModel):
    __tablename__ = "question_timetable"
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), nullable=False)
    timetable_id = Column(UUID(as_uuid=True), ForeignKey("user_timetable.id"), nullable=False)

    question = relationship("Question")
    timetable = relationship("UserTimeTable", back_populates="questions")

class UserTimeTable(BaseModel):
    __tablename__ = "user_timetable"
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    title = Column(String, nullable=True)

    questions = relationship("QuestionTimeTable", back_populates="timetable", cascade="all, delete-orphan")