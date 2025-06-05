from sqlalchemy import Column, String, Enum, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from typing import Optional, List
from uuid import uuid4

from backend.db import BaseModel, Base
from backend.enums.question import QuestionType

# Many-to-many association table for tagging
class QuestionTagAssociation(Base):
    __tablename__ = "question_tag_association"
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("question_tag.id"), primary_key=True)

class QuestionTag(BaseModel):
    __tablename__ = "question_tag"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True, nullable=False)

    questions = relationship("Question", secondary="question_tag_association", back_populates="tags")

class QuestionGroup(BaseModel):
    __tablename__ = "question_group"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)

    questions = relationship("Question", back_populates="group")

class Question(BaseModel):
    __tablename__ = "question"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    prompt = Column(String, nullable=False)
    title = Column(String, nullable=True)
    type = Column(Enum(QuestionType), nullable=False)
    options = Column(JSON, nullable=True)  # For choice-type questions
    example_answer = Column(String, nullable=True)  # Example answer for guidance
    meta = Column(JSON, nullable=True)     # Additional config like slider min/max
    group_id = Column(UUID(as_uuid=True), ForeignKey("question_group.id"), nullable=True)

    group = relationship("QuestionGroup", back_populates="questions", lazy="joined")
    tags = relationship("QuestionTag", secondary="question_tag_association", back_populates="questions", lazy="selectin")

    @property
    def group_name(self) -> Optional[str]:
        return self.group.name if self.group else None

    
    
