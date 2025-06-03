from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declared_attr
from uuid import uuid4
from datetime import datetime

from backend.config import settings

engine = create_async_engine(settings.POSTGRE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

Base: DeclarativeMeta = declarative_base()


async def get_async_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=True)
    updated_at = Column(DateTime, onupdate=datetime.utcnow, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)


class BaseModel(Base, TimestampMixin):
    __abstract__ = True
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

# =============================
# 👇 EVENT LISTENERS
# =============================
from sqlalchemy import event
from zoneinfo import ZoneInfo
def get_perth_time():
    return datetime.now(ZoneInfo("Australia/Perth"))


@event.listens_for(BaseModel, "before_insert", propagate=True)
def set_created_fields(mapper, connection, target):
    target.created_at = get_perth_time()
    target.updated_at = get_perth_time()

@event.listens_for(BaseModel, "before_update", propagate=True)
def set_updated_fields(mapper, connection, target):
    target.updated_at = get_perth_time()