from fastapi import Depends
from backend.db.models.user_answer import Comment
from backend.schemas.user_answer import CommentRead, CommentCreate, UserAnswerRead, UserAnswerCreate
from backend.db.models.user_answer import UserAnswer
from backend.routes import CustomSQLAlchemyCRUDRouter
from backend.db.models.user import Coach
from backend.schemas.user import CoachRead, CoachCreate
from backend.services.user import current_active_user
from backend.db import get_async_session

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
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False,
)



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