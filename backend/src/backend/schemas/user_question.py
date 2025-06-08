# backend/schemas/user_timetable.py
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from backend.schemas import CamelModel, BaseSchema
from backend.schemas.question import QuestionRead

class QuestionTimeTableRead(BaseSchema, CamelModel):
    question_id: UUID
    timetable_id: UUID
    question: QuestionRead

class QuestionTimetableBulkCreate(BaseSchema, CamelModel):
    timetable_id: UUID
    question_ids: List[UUID]

class UserTimeTableRead(BaseSchema, CamelModel):
    user_id: UUID
    start_date: datetime
    end_date: datetime
    questions: Optional[List[QuestionTimeTableRead]] = None
    is_submitted: bool
    title: Optional[str] = None
    notes: Optional[str] = None

class UserTimeTableCreate(BaseSchema, CamelModel):
    start_date: datetime
    end_date: datetime
    question_ids: List[UUID]
    is_submitted: bool
    title: Optional[str] = None
    notes: Optional[str] = None
