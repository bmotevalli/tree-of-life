# backend/schemas/user_timetable.py
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from backend.schemas import CamelModel

class QuestionTimeTableRead(CamelModel):
    id: UUID
    question_id: UUID
    timetable_id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class UserTimeTableRead(CamelModel):
    id: UUID
    user_id: UUID
    start_date: datetime
    end_date: datetime
    questions: List[QuestionTimeTableRead]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class UserTimeTableCreate(CamelModel):
    start_date: datetime
    end_date: datetime
    question_ids: List[UUID]
