from fastapi import APIRouter, Depends
# from backend.services.auth_dependencies import (
#     fastapi_users,
#     auth_backend,
# )
from backend.services.user import auth_backend, current_active_user, fastapi_users
from backend.schemas.user import UserRead, UserCreate, UserUpdate
from backend.db.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/jwt"
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)
router.include_router(
    fastapi_users.get_reset_password_router(),    
)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@router.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}

# # ✅ Custom login route that returns JSON token
# @router.post("/jwt/login")
# async def custom_login(
#     credentials: OAuth2PasswordRequestForm = Depends(),
#     user_db=Depends(fastapi_users.get_user_manager),
#     strategy=Depends(auth_backend.get_strategy)
# ):
#     user = await user_db.authenticate(credentials)
#     if not user:
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     token = await strategy.write_token(user)
#     return {"access_token": token, "token_type": "bearer"}

# # ✅ Use FastAPI Users' built-in logout route
# router.include_router(
#     fastapi_users.get_logout_router(auth_backend),
#     prefix="/jwt"
# )

# # ✅ Use FastAPI Users' built-in registration route
# router.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate)
# )


# router.include_router(
#     get_verify_router(UserRead),
#     prefix="/verify",
# )


# router.include_router(
#     fastapi_users.get_reset_password_router(settings.SECRET),
#     prefix="/reset-password"
# )

# router.include_router(
#     fastapi_users.get_users_router(UserRead, UserUpdate),
#     prefix="/users",
#     tags=["users"]
# )