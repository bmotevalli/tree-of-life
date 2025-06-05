from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.db import get_async_session
from backend.db.models.question import Question, QuestionGroup
from backend.schemas.question import QuestionCreate, QuestionGroupCreate, QuestionGroupRead, QuestionGroupUpdate, QuestionRead
from backend.db.models.question import QuestionTag
from backend.schemas.question import QuestionTagRead, QuestionTagCreate
from backend.routes import CustomSQLAlchemyCRUDRouter
from backend.services.user import current_active_user, admin_required

question_router = CustomSQLAlchemyCRUDRouter(
    schema=QuestionRead,
    create_schema=QuestionCreate,
    db_model=Question,
    db=get_async_session,
    paginate=100,
    prefix="questions",
    tags=["Questions"],
    current_user_dependency=current_active_user,
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False, #[Depends(admin_required)],
)


question_tag_router = CustomSQLAlchemyCRUDRouter(
    schema=QuestionTagRead,
    create_schema=QuestionTagCreate,
    db_model=QuestionTag,
    db=get_async_session,
    current_user_dependency=current_active_user,
    prefix='question-tags',
    tags=["QuestionTags"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False, # Typically avoid mass delete
)


question_group_router = CustomSQLAlchemyCRUDRouter(
    schema=QuestionGroupRead,
    create_schema=QuestionGroupCreate,
    update_schema=QuestionGroupUpdate,
    db_model=QuestionGroup,
    db=get_async_session,
    prefix='question-groups',
    tags=['Question Groups'],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False
)