from typing import Optional, Any, List
from uuid import UUID
from datetime import datetime
from pydantic import ConfigDict, BaseModel
from backend.schemas import CamelModel, BaseSchema
from backend.enums.question import QuestionType

class QuestionTagRead(BaseSchema, CamelModel):
    name: str

class QuestionTagCreate(QuestionTagRead):
    pass


class QuestionGroupRead(BaseSchema, CamelModel):
    name: str
    description: Optional[str] = None

class QuestionGroupCreate(QuestionGroupRead):
    pass

class QuestionBase(BaseSchema, CamelModel):
    prompt: str
    type: QuestionType
    title: Optional[str] = None
    options: Optional[Any]
    meta: Optional[Any]
    example_answer: Optional[str] = None
    group_id: Optional[UUID] = None


class QuestionRead(QuestionBase):
    group_name: Optional[str]
    tags: List[QuestionTagRead] = []

    class Config:
        orm_mode = True

class QuestionCreate(QuestionBase):
    pass




class QuestionTagAssociationBase(CamelModel):
    question_id: UUID
    tag_id: UUID
# For creating a new association:
class QuestionTagAssociationCreate(QuestionTagAssociationBase):
    pass

# For reading an association:
class QuestionTagAssociationRead(QuestionTagAssociationBase):
    class Config:
        orm_mode = True

