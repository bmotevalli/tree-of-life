from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Enum as SqlEnum, ForeignKey, Column, UUID
from sqlalchemy.orm import Mapped, mapped_column
from backend.db import BaseModel, get_async_session

from backend.enums.user import Role

class User(SQLAlchemyBaseUserTableUUID, BaseModel):
    role: Mapped[Role] = mapped_column(SqlEnum(Role),  default=Role.VIEWER)

class Coach(BaseModel):
    __tablename__ = "coach"
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    coach_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)