from sqlalchemy import Column, String, Enum, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from backend.db import Base
from backend.enums.question import QuestionType



# Many-to-many association table for tagging
question_tag_association = Table(
    "question_tag_association",
    Base.metadata,
    Column("question_id", UUID(as_uuid=True), ForeignKey("question.id")),
    Column("tag_id", UUID(as_uuid=True), ForeignKey("questiontag.id"))
)


class QuestionTag(Base):
    __tablename__ = "questiontag"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True, nullable=False)

    questions = relationship("Question", secondary=question_tag_association, back_populates="tags")


class Question(Base):
    __tablename__ = "question"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    prompt = Column(String, nullable=False)
    type = Column(Enum(QuestionType), nullable=False)
    options = Column(JSON, nullable=True)  # For choice-type questions
    meta = Column(JSON, nullable=True)     # Additional config like slider min/max
    
    tags = relationship("QuestionTag", secondary=question_tag_association, back_populates="questions")
