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

class QuestionRead(BaseSchema, CamelModel):
    prompt: str
    type: QuestionType
    options: Optional[Any]
    meta: Optional[Any]
    group_id: Optional[UUID] = None
    example_answer: Optional[str] = None
    tags: List[QuestionTagRead]

class QuestionCreate(BaseSchema, CamelModel):
    prompt: str
    type: QuestionType
    options: Optional[Any]
    meta: Optional[Any]
    group_id: Optional[UUID] = None
    example_answer: Optional[str] = None
    tag_ids: Optional[List[UUID]] = None




class QuestionGroupRead(BaseSchema, CamelModel):
    name: str
    description: Optional[str] = None

class QuestionGroupCreate(QuestionGroupRead):
    pass