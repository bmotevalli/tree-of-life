from typing import Optional, Any, List
from uuid import UUID
from datetime import datetime
from pydantic import ConfigDict
from backend.schemas import CamelModel
from backend.enums.question import QuestionType

class QuestionTagRead(CamelModel):
    id: UUID
    name: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class QuestionTagCreate(CamelModel):
    name: str

class QuestionRead(CamelModel):
    id: UUID
    prompt: str
    type: QuestionType
    options: Optional[Any]
    meta: Optional[Any]
    tags: List[QuestionTagRead]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class QuestionCreate(CamelModel):
    prompt: str
    type: QuestionType
    options: Optional[Any]
    meta: Optional[Any]
    tag_ids: Optional[List[UUID]] = None




class QuestionGroupBase(CamelModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    name: str
    description: Optional[str] = None

class QuestionGroupCreate(QuestionGroupBase):
    pass

class QuestionGroupUpdate(QuestionGroupBase):
    pass

class QuestionGroupRead(QuestionGroupBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]