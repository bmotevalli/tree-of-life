from sqlalchemy import Column, DateTime, JSON, Date, Integer, ForeignKey, Boolean, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime

from backend.db import BaseModel

class UserAnswer(BaseModel):
    __tablename__ = "user_answer"
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), nullable=False)
    timetable_id = Column(UUID(as_uuid=True), ForeignKey("user_timetable.id"), nullable=False)
    day_of_plan = Column(Integer, nullable=False)
    date_of_plan = Column(Date, nullable=False)
    answer = Column(JSON, nullable=True)  # Can store different answer formats# key = question.id, value = response
    is_submitted = Column(Boolean, default=False)
    comments = relationship("Comment", back_populates="answer", cascade="all, delete-orphan")


class Comment(BaseModel):
    __tablename__ = "comment"
    answer_id = Column(UUID(as_uuid=True), ForeignKey("user_answer.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    comment = Column(String, nullable=False)

    answer = relationship("UserAnswer", back_populates="comments")