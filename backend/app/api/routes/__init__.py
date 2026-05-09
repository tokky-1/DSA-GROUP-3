from fastapi import APIRouter

from app.api.routes.convert import router as convert_router

api_router = APIRouter()
api_router.include_router(convert_router)
