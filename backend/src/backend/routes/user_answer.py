from typing import Any
from uuid import UUID
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.models.user_answer import Comment
from backend.schemas.user_answer import CommentRead, CommentCreate, UserAnswerRead, UserAnswerCreate
from backend.db.models.user_answer import UserAnswer
from backend.routes import CustomSQLAlchemyCRUDRouter
from backend.db.models.user import Coach
from backend.schemas.user import CoachRead, CoachCreate
from backend.services.user import current_active_user
from backend.db import get_async_session
from backend.services.user_answer import UserAnswerService

comment_router = CustomSQLAlchemyCRUDRouter(
    schema=CommentRead,
    create_schema=CommentCreate,
    db_model=Comment,
    db=get_async_session,
    current_user_dependency=current_active_user,
    prefix='comments',
    tags=["Comments"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False,
)


user_answer_router = CustomSQLAlchemyCRUDRouter(
    schema=UserAnswerRead,
    create_schema=UserAnswerCreate,
    db_model=UserAnswer,
    db=get_async_session,
    current_user_dependency=current_active_user,
    tags=["UserAnswers"],
    prefix='user-answers',
    get_all_route=[Depends(current_active_user)],
    get_one_route=False, # [Depends(current_active_user)],
    create_route=False, # [Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False,
)

@user_answer_router.post("", response_model=UserAnswerRead)
async def save_user_answer(
    answer_data: UserAnswerCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: Any = Depends(current_active_user)
):
    return await UserAnswerService.upsert_user_answer(answer_data, session, current_user)


@user_answer_router.get("/timetable-day", response_model=list[UserAnswerRead])
async def get_my_answers_by_timetable_day(
    timetable_id: UUID = Query(..., description="ID of the timetable"),
    day_of_plan: int = Query(..., description="Day of the plan"),
    session: AsyncSession = Depends(get_async_session),
    current_user: Any = Depends(current_active_user)
):
    return await UserAnswerService.get_answers_by_timetable_day(
        timetable_id, 
        day_of_plan, 
        session,
        current_user
    )


@user_answer_router.get("/{item_id}", response_model=UserAnswerRead)
async def get_user_answer_by_id(
    item_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: Any = Depends(current_active_user)
):
    return await UserAnswerService.get_by_id(item_id, session, current_user)


coach_router = CustomSQLAlchemyCRUDRouter(
    schema=CoachRead,
    create_schema=CoachCreate,
    db_model=Coach,
    db=get_async_session,
    current_user_dependency=current_active_user,
    prefix='coaches',
    tags=["Coaches"],
    delete_all_route=False
)