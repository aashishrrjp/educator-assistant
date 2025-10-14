from fastapi import APIRouter, HTTPException, status
from schemas.learning_tools_schemas import VideoGenerationRequest, VideoGenerationResponse
from services.gemini_service import generate_video_and_suggest_title

router = APIRouter()

@router.post(
    "/video/generate",
    response_model=VideoGenerationResponse,
    summary="Generate a video from a prompt"
)
async def generate_video(request: VideoGenerationRequest):
    """
    Accepts a prompt and a desired file name, generates a video, saves it to a GCS bucket,
    and returns the video URI along with a suggested title.
    
    You can optionally specify `duration_seconds` and `fps`.
    
    **Note:** This is a long-running operation and may take several minutes to complete.
    """
    try:
        # --- UPDATED: Pass the new optional parameters to the service function ---
        title, uri = await generate_video_and_suggest_title(
            prompt=request.prompt,
            # file_name=request.file_name,
            duration_seconds=request.duration_seconds,
            fps=request.fps
        )
        return VideoGenerationResponse(
            suggested_title=title,
            video_uri=uri,
            status="Completed"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during video generation: {str(e)}"
        )