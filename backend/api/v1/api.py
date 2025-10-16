from fastapi import APIRouter
from .endpoints import curriculum, assessment

api_router = APIRouter()
api_router.include_router(curriculum.router, prefix="/teacher", tags=["Curriculum & Planning"])
api_router.include_router(assessment.router, prefix="/teacher", tags=["Assessments"])