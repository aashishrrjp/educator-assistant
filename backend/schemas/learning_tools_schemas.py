from pydantic import BaseModel, Field
from typing import Optional # Ensure Optional is imported

class VideoGenerationRequest(BaseModel):
    prompt: str = Field(..., description="The prompt to generate the video from.")
    
    duration_seconds: Optional[float] = Field(
        default=8.0, 
        gt=0, 
        description="Optional: The desired duration of the generated video in seconds. Defaults to 8."
    )
    fps: Optional[int] = Field(
        None, 
        gt=0, 
        description="Optional: The desired frames per second (fps) for the video."
    )

class VideoGenerationResponse(BaseModel):
    suggested_title: str
    video_uri: str
    status: str