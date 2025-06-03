import uuid
from pydantic import BaseModel
from backend.enums.question import QuestionType

class QuestionBase(BaseModel):
    text: str
    type: QuestionType

class QuestionCreate(QuestionBase):
    pass

class QuestionRead(QuestionBase):
    id: uuid.UUID
