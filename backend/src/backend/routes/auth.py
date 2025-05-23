from fastapi import APIRouter
from backend.services.auth_dependencies import fastapi_users, auth_backend
from backend.schemas.user import UserRead, UserCreate, UserUpdate

router = APIRouter()

# JWT login/logout
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

# Registration
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# Users CRUD
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)