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
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    answer: Optional[Any]
    is_submitted: bool
    comments: Optional[List[CommentRead]] = None

class UserAnswerCreate(BaseSchema, CamelModel):
    question_id: UUID
    timetable_id: UUID
    day_of_plan: int
    answer: Optional[Any]
    is_submitted: Optional[bool] = False



