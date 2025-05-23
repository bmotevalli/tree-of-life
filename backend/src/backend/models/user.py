from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column
from backend.db import Base

from backend.enums.user import Role

class User(SQLAlchemyBaseUserTableUUID, Base):
    role: Mapped[Role] = mapped_column(SqlEnum(Role),  default=Role.VIEWER)