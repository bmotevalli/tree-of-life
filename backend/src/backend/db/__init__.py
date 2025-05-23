from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from backend.config import settings

engine = create_async_engine(settings.POSTGRE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_async_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session