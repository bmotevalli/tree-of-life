from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
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

