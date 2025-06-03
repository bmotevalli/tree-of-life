# backend/routes/user_timetable.py
from fastapi import Depends
from backend.db.models.user_question import UserTimeTable
from backend.schemas.user_question import UserTimeTableRead, UserTimeTableCreate
from backend.routes import CustomSQLAlchemyCRUDRouter
from backend.services.user import current_active_user
from backend.db import get_async_session

user_timetable_router = CustomSQLAlchemyCRUDRouter(
    schema=UserTimeTableRead,
    create_schema=UserTimeTableCreate,
    db_model=UserTimeTable,
    db=get_async_session,
    current_user_dependency=current_active_user,
    tags=["UserTimeTables"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False
)

