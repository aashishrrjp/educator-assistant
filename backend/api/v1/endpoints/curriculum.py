from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
from schemas.curriculum_schemas import *
from services.gemini_service import *

router = APIRouter()

@router.post("/curriculum/generate", response_model=CurriculumResponse)
async def generate_curriculum(
    target_class: int = Form(...),
    subject: str = Form(...),
    topics: List[str] = Form(...),
    sample_file: Optional[UploadFile] = File(None)
):
    sample_content = None
    if sample_file:
        if sample_file.content_type not in ["application/pdf", "image/jpeg", "image/png", "text/plain"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload PDF, image, or text file.")
        # NOTE: For a real application, you would process the PDF/image here to extract text.
        # For this example, we'll just read it as bytes and pass it on.
        # A more robust solution would use a library like PyPDF2 for PDFs or an OCR for images.
        contents = await sample_file.read()
        sample_content = contents.decode('utf-8', errors='ignore')

    request = CurriculumRequest(target_class=target_class, subject=subject, topics=topics)
    prompt = create_curriculum_prompt(request, sample_content)
    generated_curriculum = await generate_content_from_gemini(prompt)
    return CurriculumResponse(curriculum=generated_curriculum)

@router.post("/lesson-plan/generate", response_model=LessonPlanResponse)
async def generate_lesson_plan(request: LessonPlanRequest):
    prompt = create_lesson_plan_prompt(request)
    plan = await generate_content_from_gemini(prompt)
    return LessonPlanResponse(lesson_plan=plan)

@router.post("/timetable/generate", response_model=TimetableResponse)
async def generate_timetable(request: TimetableRequest):
    prompt = create_timetable_prompt(request)
    table = await generate_content_from_gemini(prompt)
    return TimetableResponse(timetable=table)