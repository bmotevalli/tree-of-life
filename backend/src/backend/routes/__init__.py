from fastapi import Depends, Body, HTTPException
from fastapi_crudrouter import SQLAlchemyCRUDRouter
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from backend.db import get_async_session
from backend.db.models.user import User

from zoneinfo import ZoneInfo


def get_perth_time():
    return datetime.now(ZoneInfo("Australia/Perth")).replace(tzinfo=None)

class CustomSQLAlchemyCRUDRouter(SQLAlchemyCRUDRouter):
    def __init__(self, *args, **kwargs):
        self.current_user_dependency = kwargs.pop("current_user_dependency", None)
        super().__init__(*args, **kwargs)

    def _create(self, *args, **kwargs):
        original_create = super()._create(*args, **kwargs)

        async def create_with_user_context(
            model: self.create_schema,
            db: AsyncSession = Depends(get_async_session),
            user: User = Depends(self.current_user_dependency)
        ):
            model.created_by = user.id
            model.updated_by = user.id
            model.created_at = get_perth_time()
            model.updated_at = get_perth_time()
            return await original_create(model, db)

        return create_with_user_context

    def _update(self, *args, **kwargs):
        original_update = super()._update(*args, **kwargs)
        async def update_with_user_context(
            item_id,
            model: self.update_schema, 
            db: AsyncSession = Depends(get_async_session), 
            user: User = Depends(self.current_user_dependency)
        ):
            model.updated_by = user.id
            model.updated_at = get_perth_time()
            return await original_update(item_id, model, db)
        return update_with_user_context
