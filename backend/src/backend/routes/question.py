from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.db import get_async_session
from backend.db.models.question import Question
from backend.schemas.question import QuestionCreate, QuestionRead
from fastapi_crudrouter import SQLAlchemyCRUDRouter
from backend.services.user import current_active_user, admin_required

router = SQLAlchemyCRUDRouter(
    schema=QuestionRead,
    create_schema=QuestionCreate,
    db_model=Question,
    db=get_async_session,
    paginate=100,
    prefix="questions",
    tags=["Questions"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False, #[Depends(admin_required)],
)