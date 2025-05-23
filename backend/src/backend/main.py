# src/backend/main.py
from fastapi import FastAPI
from backend.schemas.user import UserRead, UserCreate, UserUpdate
from backend.config import settings
from backend.db import engine, Base
from backend.routes.auth import router as auth_router

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Routes
app.include_router(auth_router)
