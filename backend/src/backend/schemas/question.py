from typing import Optional, Any, List
from uuid import UUID
from datetime import datetime
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


