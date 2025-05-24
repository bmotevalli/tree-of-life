from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column
from backend.db import Base, get_async_session

from backend.enums.user import Role

class User(SQLAlchemyBaseUserTableUUID, Base):
    role: Mapped[Role] = mapped_column(SqlEnum(Role),  default=Role.VIEWER)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)