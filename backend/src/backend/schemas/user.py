from typing import Optional
from fastapi_users import schemas
from pydantic import Field
from uuid import UUID
from backend.enums.user import Role
from datetime import datetime
from backend.schemas import CamelModel

class UserRead(schemas.BaseUser[UUID]):
    role: Role

class UserCreate(schemas.BaseUserCreate):
    role: Role = Field(default=Role.VIEWER)

class UserUpdate(schemas.BaseUserUpdate):
    role: Role | None = None


class CoachRead(CamelModel):
    id: UUID
    user_id: UUID
    coach_id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

class CoachCreate(CamelModel):
    user_id: UUID
    coach_id: UUID