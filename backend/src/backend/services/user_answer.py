from typing import Any
from uuid import UUID
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from backend.db.models.user_answer import UserAnswer
from backend.schemas.user_answer import UserAnswerCreate
from backend.routes import get_perth_time


class UserAnswerService:

    @classmethod
    async def upsert_user_answer(
        cls,
        answer_data: UserAnswerCreate,
        session: AsyncSession,
        current_user: Any
    ):
        try:
            now = get_perth_time()

            # 1️⃣ Check if answer exists
            query = select(UserAnswer).where(
                and_(
                    UserAnswer.user_id == current_user.id,
                    UserAnswer.question_id == answer_data.question_id,
                    UserAnswer.timetable_id == answer_data.timetable_id,
                    UserAnswer.day_of_plan == answer_data.day_of_plan
                )
            )
            result = await session.execute(query)
            user_answer = result.scalars().first()

            if user_answer:
                # 2️⃣ Update
                user_answer.answer = answer_data.answer
                user_answer.is_submitted = answer_data.is_submitted or False
                user_answer.updated_at = now
                user_answer.updated_by = current_user.id
            else:
                # 3️⃣ Create
                user_answer = UserAnswer(
                    user_id=current_user.id,
                    question_id=answer_data.question_id,
                    timetable_id=answer_data.timetable_id,
                    day_of_plan=answer_data.day_of_plan,
                    answer=answer_data.answer,
                    is_submitted=answer_data.is_submitted or False,
                    created_at=now,
                    updated_at=now,
                    created_by=current_user.id,
                    updated_by=current_user.id
                )
                session.add(user_answer)

            await session.commit()
            await session.refresh(user_answer)

            return user_answer

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upsert user answer: {str(e)}"
            )
        

    @classmethod
    async def get_answers_by_timetable_day(
        cls,
        timetable_id: UUID,
        day_of_plan: int,
        session: AsyncSession,
        current_user: Any
    ):
        try:
            result = await session.execute(
                select(UserAnswer)
                .where(
                    UserAnswer.user_id == current_user.id,
                    UserAnswer.timetable_id == timetable_id,
                    UserAnswer.day_of_plan == day_of_plan
                )
            )
            user_answers = result.scalars().unique().all()

            return user_answers

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get answers: {str(e)}"
            )
        
    @classmethod
    async def get_by_id(
        cls,
        item_id: UUID,
        session: AsyncSession,
        current_user: Any
    ):
        try:
            result = await session.execute(
                select(UserAnswer).where(
                    UserAnswer.id == item_id,
                    UserAnswer.user_id == current_user.id
                )
            )
            user_answer = result.scalars().first()

            if not user_answer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="UserAnswer not found"
                )

            return user_answer

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get user answer: {str(e)}"
            )