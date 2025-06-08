# backend/routes/user_timetable.py
from typing import List
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert
from fastapi import Depends, Query
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from backend.db.models.user_question import UserTimeTable, QuestionTimeTable
from backend.schemas.user_question import UserTimeTableRead, UserTimeTableCreate, QuestionTimeTableRead, QuestionTimetableBulkCreate
from backend.routes import CustomSQLAlchemyCRUDRouter, get_perth_time
from backend.services.user import current_active_user
from backend.db import get_async_session
from backend.services.user_question import UserTimeTableService

user_timetable_router = CustomSQLAlchemyCRUDRouter(
    schema=UserTimeTableRead,
    create_schema=UserTimeTableRead,
    db_model=UserTimeTable,
    db=get_async_session,
    current_user_dependency=current_active_user,
    prefix='user-timetables',
    tags=["UserTimeTables"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route= False, # [Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False
)


@user_timetable_router.get(
    "/me",
    response_model=List[UserTimeTableRead],
    status_code=status.HTTP_200_OK
)
async def get_user_timetables(
    include_questions: bool = Query(False, description="Include questions"),
    show_active: bool = Query(False, description="Show only active timetables"),
    show_pending: bool = Query(False, description="Show only pending timetables"),
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(current_active_user)
):
    return await UserTimeTableService.get_my_timetable(
        include_questions,
        show_active,
        show_pending,
        session,
        current_user
    )


@user_timetable_router.post("", response_model=UserTimeTableRead, status_code=status.HTTP_201_CREATED)
async def save_user_timetable(
    timetable_data: UserTimeTableCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(current_active_user)
):
    return await UserTimeTableService.upsert_user_timetable(
        timetable_data,
        session,
        current_user
    )


question_timetable_router = CustomSQLAlchemyCRUDRouter(
    schema=QuestionTimeTableRead,
    create_schema=QuestionTimeTableRead,
    db_model=QuestionTimeTable,
    db=get_async_session,
    current_user_dependency=current_active_user,
    prefix='timetable-questions',
    tags=["TimeTableQuestions"],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route= [Depends(current_active_user)],
    update_route=[Depends(current_active_user)],
    delete_one_route=[Depends(current_active_user)],
    delete_all_route=False
)




# question_timetable_router.post("", status_code=status.HTTP_201_CREATED)
# async def bulk_create_question_timetables(
#     payload: QuestionTimetableBulkCreate,
#     session: AsyncSession = Depends(get_async_session),
#     current_user=Depends(current_active_user)
# ):
#     try:
#         now = get_perth_time()
#         user_id = current_user.id  # Assuming current_user.id is the UUID

#         values = [
#             {
#                 "timetable_id": payload.timetable_id,
#                 "question_id": qid,
#                 "created_at": now,
#                 "updated_at": now,
#                 "created_by": user_id,
#                 "updated_by": user_id
#             }
#             for qid in payload.question_ids
#         ]

#         await session.execute(
#             insert(QuestionTimeTable).values(values)
#             .on_conflict_do_nothing()  # Optional: skip duplicates if needed
#         )
#         await session.commit()

#         return {"message": f"{len(values)} question timetables created successfully."}

#     except Exception as e:
#         await session.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to bulk create question timetables: {str(e)}"
#         )