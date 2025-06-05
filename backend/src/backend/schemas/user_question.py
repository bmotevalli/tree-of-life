# backend/schemas/user_timetable.py
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from backend.schemas import CamelModel, BaseSchema

class QuestionTimeTableRead(BaseSchema, CamelModel):
    question_id: UUID
    timetable_id: UUID

class UserTimeTableRead(BaseSchema, CamelModel):
    user_id: UUID
    start_date: datetime
    end_date: datetime
    questions: List[QuestionTimeTableRead]

class UserTimeTableCreate(BaseSchema, CamelModel):
    start_date: datetime
    end_date: datetime
    question_ids: List[UUID]
