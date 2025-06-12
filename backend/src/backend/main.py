# src/backend/main.py
import os
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.db import create_db_and_tables
from backend.routes.auth import router as auth_router
from backend.routes.question import question_router, question_tag_router, question_group_router, question_tag_associate_router
from backend.routes.user_answer import user_answer_router, comment_router, coach_router
from backend.routes.user_question import user_timetable_router, question_timetable_router


app = FastAPI(
    docs_url=f"{settings.API_PRE_PATH}/docs" if settings.API_PRE_PATH else "/docs",
    redoc_url=f"{settings.API_PRE_PATH}/redoc" if settings.API_PRE_PATH else "/redoc",
)

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


@app.get(f"{settings.API_PRE_PATH}/")
async def health_check():
    """API Health Check."""
    return {
        "returnValue": "true",
        "details": "API is Healthy, visit /docs to view the docs.",
    }

# Routes
api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(question_router)
api_router.include_router(question_tag_router)
api_router.include_router(question_group_router)
api_router.include_router(question_tag_associate_router)
api_router.include_router(user_answer_router)
api_router.include_router(comment_router)
api_router.include_router(coach_router)
api_router.include_router(user_timetable_router)
api_router.include_router(question_timetable_router)

app.include_router(api_router, prefix=settings.API_PRE_PATH)


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


if settings.EMBED_UI:
    dirname = os.path.dirname(__file__)
    static_path = os.path.join(dirname, "static", "browser")

    app.mount("/", SPAStaticFiles(directory=static_path, html=True), name="static")