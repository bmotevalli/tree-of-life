from datetime import timedelta
from datetime import datetime
from typing import Any, List

from fastapi import HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.routes import get_perth_time
from backend.db.models.user_question import UserTimeTable, QuestionTimeTable
from backend.schemas.user_question import UserTimeTableRead, UserTimeTableCreate, QuestionTimeTableRead, QuestionTimetableBulkCreate


class UserTimeTableService:

    @classmethod
    async def get_my_timetable(
        cls, 
        include_questions: bool,
        show_active: bool,
        show_pending: bool,
        session: AsyncSession,
        current_user: Any
    ) -> List[UserTimeTableRead]:
        try:
            query = select(UserTimeTable).where(UserTimeTable.user_id == current_user.id)

            # Optional: include questions
            if include_questions:
                query = query.options(selectinload(UserTimeTable.questions))

            # Active filter: current date between start and end
            if show_active:
                now = get_perth_time()
                query = query.where(UserTimeTable.start_date <= now, UserTimeTable.end_date >= now)

            # Pending filter: is_submitted == False
            if show_pending:
                query = query.where(UserTimeTable.is_submitted == "false")

            result = await session.execute(query)
            timetables = result.scalars().unique().all()

            return timetables

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get user timetables: {str(e)}"
            )


    @classmethod
    async def upsert_user_timetable(
        cls,
        timetable_data: UserTimeTableCreate,
        session: AsyncSession,
        current_user: Any
    ) -> UserTimeTableRead:
        try:
            now = get_perth_time()

            requested_start_date = timetable_data.start_date.date()
            requested_end_date = timetable_data.end_date.date()

            # 1️⃣ Fetch existing submitted timetables overlapping the requested period
            active_timetables_query = (
                select(UserTimeTable)
                .where(UserTimeTable.user_id == current_user.id)
                .where(UserTimeTable.is_submitted == True)
                .where(UserTimeTable.start_date <= requested_end_date)
                .where(UserTimeTable.end_date >= requested_start_date)
            )

            # Exclude current record if updating
            if getattr(timetable_data, "id", None):
                active_timetables_query = active_timetables_query.where(UserTimeTable.id != timetable_data.id)

            result = await session.execute(active_timetables_query)
            active_timetables = result.scalars().all()

            # 2️⃣ Check for overlaps
            if timetable_data.is_submitted:
                date_cursor = requested_start_date
                while date_cursor <= requested_end_date:
                    active_count = 1  # including the new timetable
                    for t in active_timetables:
                        # Extract just the date parts
                        t_start = t.start_date.date() if isinstance(t.start_date, datetime) else t.start_date
                        t_end = t.end_date.date() if isinstance(t.end_date, datetime) else t.end_date
                        if t_start <= date_cursor <= t_end:
                            active_count += 1
                    if active_count > 2:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"بازه تعریف شده برای این برنامه با دو برنامه دیگر در تلاقی است. حداکثر برنامه های همزمان 2 عدد می باشد. لطفا، بازه زمانی تان رو عوض کنید.."
                        )
                    date_cursor += timedelta(days=1)

            # 3️⃣ Check if timetable exists
            user_timetable = None
            if getattr(timetable_data, "id", None):
                result = await session.execute(
                    select(UserTimeTable)
                    .where(UserTimeTable.id == timetable_data.id)
                    .where(UserTimeTable.user_id == current_user.id)
                )
                user_timetable = result.scalars().first()

            # 4️⃣ Update existing or create new
            if user_timetable:
                user_timetable.start_date = timetable_data.start_date
                user_timetable.end_date = timetable_data.end_date
                user_timetable.title = timetable_data.title
                user_timetable.notes = timetable_data.notes
                user_timetable.is_submitted = timetable_data.is_submitted
                user_timetable.updated_at = now
                user_timetable.updated_by = current_user.id

                await session.execute(
                    QuestionTimeTable.__table__.delete().where(
                        QuestionTimeTable.timetable_id == user_timetable.id
                    )
                )
            else:
                user_timetable = UserTimeTable(
                    user_id=current_user.id,
                    start_date=timetable_data.start_date,
                    end_date=timetable_data.end_date,
                    title=timetable_data.title,
                    notes=timetable_data.notes,
                    is_submitted=timetable_data.is_submitted,
                    created_at=now,
                    updated_at=now,
                    created_by=current_user.id,
                    updated_by=current_user.id
                )
                session.add(user_timetable)
                await session.flush()  # get generated id

            # 5️⃣ Add questions
            if timetable_data.question_ids:
                question_timelines = [
                    QuestionTimeTable(
                        timetable_id=user_timetable.id,
                        question_id=question_id,
                        created_at=now,
                        updated_at=now,
                        created_by=current_user.id,
                        updated_by=current_user.id
                    )
                    for question_id in timetable_data.question_ids
                ]
                session.add_all(question_timelines)

            # 6️⃣ Commit
            await session.commit()

            # 7️⃣ Fetch with relationships
            result = await session.execute(
                select(UserTimeTable)
                .options(
                    selectinload(UserTimeTable.questions).selectinload(QuestionTimeTable.question)
                )
                .where(UserTimeTable.id == user_timetable.id)
            )
            user_timetable = result.scalars().first()

            return user_timetable

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save UserTimetable: {str(e)}"
            )