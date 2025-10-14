from fastapi import APIRouter
from .endpoints import curriculum, assessment, learning_tools

api_router = APIRouter()
api_router.include_router(curriculum.router, prefix="/teacher", tags=["Curriculum & Planning"])
api_router.include_router(assessment.router, prefix="/teacher", tags=["Assessments"])
api_router.include_router(learning_tools.router, prefix="/student", tags=["Learning Tools"])