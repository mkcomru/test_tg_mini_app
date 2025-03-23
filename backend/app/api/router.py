from fastapi import APIRouter

from backend.app.api.endpoints import user, share

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(share.router, prefix="/share", tags=["share"])