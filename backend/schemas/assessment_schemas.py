from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class QuizType(str, Enum):
    objective = "objective"
    subjective = "subjective"
    both = "both"

class DifficultyLevel(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuizRequest(BaseModel):
    quiz_type: QuizType
    total_questions: int = Field(..., gt=0) # Must be greater than 0
    subject: str
    difficulty: DifficultyLevel
    topics:Optional[List[str]] = None

class ActivityRequest(BaseModel):
    target_class: int
    topic: str
    activity_type: str

class QuizResponse(BaseModel):
    quiz_content: str # Can be a JSON string with questions, answers, etc.

class ActivityResponse(BaseModel):
    activity_instructions: str