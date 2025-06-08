from sqlalchemy import Column, DateTime, ForeignKey, String, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from backend.db import BaseModel


class QuestionTimeTable(BaseModel):
    __tablename__ = "question_timetable"
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), nullable=False)
    timetable_id = Column(UUID(as_uuid=True), ForeignKey("user_timetable.id"), nullable=False)

    question = relationship("Question", lazy="selectin")
    timetable = relationship("UserTimeTable", back_populates="questions", lazy="selectin")

class UserTimeTable(BaseModel):
    __tablename__ = "user_timetable"
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    title = Column(String, nullable=True)
    is_submitted = Column(Boolean, nullable=False, default="false")
    notes = Column(String, nullable=True, default="")

    questions = relationship("QuestionTimeTable", back_populates="timetable", cascade="all, delete-orphan", lazy="selectin")