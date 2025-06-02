from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from backend.db import Base
from backend.db.models.question import question_tag_association

class QuestionTag(Base):
    __tablename__ = "questiontag"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, unique=True, nullable=False)

    questions = relationship("Question", secondary=question_tag_association, back_populates="tags")
