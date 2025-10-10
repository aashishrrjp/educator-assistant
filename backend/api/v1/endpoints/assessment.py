from fastapi import APIRouter
from schemas.assessment_schemas import *
from services.gemini_service import *

router = APIRouter()

@router.post("/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    prompt = create_quiz_prompt(request)
    quiz = await generate_content_from_gemini(prompt)
    return QuizResponse(quiz_content=quiz)

@router.post("/activity/generate", response_model=ActivityResponse)
async def generate_activity(request: ActivityRequest):
    prompt = create_activity_prompt(request)
    activity = await generate_content_from_gemini(prompt)
    return ActivityResponse(activity_instructions=activity)