from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from uuid import UUID
from backend.db import get_async_session
from backend.db.models.question import Question, QuestionGroup, QuestionTag, QuestionTagAssociation
from backend.schemas.question import QuestionCreate, QuestionGroupCreate, QuestionGroupRead, QuestionRead, QuestionTagAssociationRead, QuestionTagAssociationCreate
from backend.schemas.question import QuestionTagRead, QuestionTagCreate
from backend.routes import CustomSQLAlchemyCRUDRouter
from fastapi_crudrouter import SQLAlchemyCRUDRouter
from backend.services.user import current_active_user, admin_required

question_router = CustomSQLAlchemyCRUDRouter(
    schema=QuestionRead,
    create_schema=QuestionCreate,
    update_schema=QuestionCreate,
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
    update_schema=QuestionTagCreate,
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
    update_schema=QuestionGroupCreate,
    db_model=QuestionGroup,
    db=get_async_session,    
    current_user_dependency=current_active_user,
    prefix='question-groups',
    tags=['Question Groups'],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False
)


question_tag_associate_router = SQLAlchemyCRUDRouter(
    schema=QuestionTagAssociationRead,
    create_schema=QuestionTagAssociationCreate,
    update_schema=QuestionTagAssociationCreate,
    db_model=QuestionTagAssociation,
    db=get_async_session,
    prefix='question-tag-associations',
    tags=['Question Tag Associations'],
    get_all_route=[Depends(current_active_user)],
    get_one_route=[Depends(current_active_user)],
    create_route=[Depends(admin_required)],
    update_route=[Depends(admin_required)],
    delete_one_route=[Depends(admin_required)],
    delete_all_route=False
)


@question_tag_associate_router.delete('/by-question/{question_id}', dependencies=[Depends(admin_required)])
async def delete_by_question_id(
    question_id: UUID,
    db: AsyncSession = Depends(get_async_session)
):
    try:
        await db.execute(
            delete(QuestionTagAssociation).where(QuestionTagAssociation.question_id == question_id)
        )
        await db.commit()
        return {"status": "success", "message": f"Deleted tags for question {question_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))