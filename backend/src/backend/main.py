# src/backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.db import create_db_and_tables
from backend.routes.auth import router as auth_router
from backend.routes.question import question_router, question_tag_router, question_group_router, question_tag_associate_router
from backend.routes.user_answer import user_answer_router, comment_router, coach_router
from backend.routes.user_question import user_timetable_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()

# Routes
app.include_router(auth_router)
app.include_router(question_router)
app.include_router(question_tag_router)
app.include_router(question_group_router)
app.include_router(question_tag_associate_router)
app.include_router(user_answer_router)
app.include_router(comment_router)
app.include_router(coach_router)
app.include_router(user_timetable_router)