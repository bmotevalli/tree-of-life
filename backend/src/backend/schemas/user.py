from fastapi_users import schemas
from pydantic import Field
from uuid import UUID
from backend.enums.user import Role

class UserRead(schemas.BaseUser[UUID]):
    role: Role

class UserCreate(schemas.BaseUserCreate):
    role: Role = Field(default=Role.VIEWER)

class UserUpdate(schemas.BaseUserUpdate):
    role: Role | None = None