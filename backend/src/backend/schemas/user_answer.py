# backend/schemas/comment.py
from typing import Optional, Any, List
from uuid import UUID
from datetime import date, datetime
from backend.schemas import CamelModel, BaseSchema

class CommentRead(BaseSchema, CamelModel):
    answer_id: UUID
    user_id: UUID
    comment: str

class CommentCreate(BaseSchema, CamelModel):
    answer_id: UUID
    comment: str


class UserAnswerRead(BaseSchema, CamelModel):
    user_id: UUID
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    date_of_plan: date
    answer: Optional[Any]
    is_submitted: bool
    comments: List[CommentRead]

class UserAnswerCreate(BaseSchema, CamelModel):
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    date_of_plan: date
    answer: Optional[Any]
    is_submitted: Optional[bool] = False



