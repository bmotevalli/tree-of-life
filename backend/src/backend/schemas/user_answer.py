# backend/schemas/comment.py
from typing import Optional, Any, List
from uuid import UUID
from datetime import date, datetime
from backend.schemas import CamelModel

class CommentRead(CamelModel):
    id: UUID
    answer_id: UUID
    user_id: UUID
    comment: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class CommentCreate(CamelModel):
    answer_id: UUID
    comment: str


class UserAnswerRead(CamelModel):
    id: UUID
    user_id: UUID
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    date_of_plan: date
    answer: Optional[Any]
    is_submitted: bool
    comments: List[CommentRead]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class UserAnswerCreate(CamelModel):
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    date_of_plan: date
    answer: Optional[Any]
    is_submitted: Optional[bool] = False



