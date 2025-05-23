from uuid import UUID
from fastapi_users import BaseUserManager, UUIDIDMixin
from backend.models.user import User
from backend.config import settings

class UserManager(UUIDIDMixin, BaseUserManager[User, UUID]):
    reset_password_token_secret = settings.secret
    verification_token_secret = settings.secret