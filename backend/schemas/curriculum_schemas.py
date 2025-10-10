from pydantic import BaseModel
from typing import List, Optional

class CurriculumRequest(BaseModel):
    target_class: int
    subject: str
    topics: List[str]

class LessonPlanRequest(BaseModel):
    target_class: int
    subject: str

class TimetableRequest(BaseModel):
    teacher_classes: List[str]
    hours_required: int
    rules: Optional[List[str]] = None

class CurriculumResponse(BaseModel):
    curriculum: str # This can be a structured JSON string or Markdown text

class LessonPlanResponse(BaseModel):
    lesson_plan: str

class TimetableResponse(BaseModel):
    timetable: str