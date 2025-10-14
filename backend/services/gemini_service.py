# import google.generativeai as genai
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import time
# from google.genai.types import GenerateVideosConfig
from fastapi.concurrency import run_in_threadpool
from typing import Optional 
# from google.longrunning.operations_pb2 import GetOperationRequest

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file")
# genai.configure(api_key=api_key)

GCS_BUCKET = os.getenv("GCS_BUCKET_NAME")
if not GCS_BUCKET:
    raise ValueError("GCS_BUCKET_NAME not found in .env file")

if GCS_BUCKET.startswith("gs://"):
    GCS_BUCKET = GCS_BUCKET[5:]
    print(f"Warning: Removed gs:// prefix from GCS_BUCKET_NAME. Using: {GCS_BUCKET}")

try:
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Error creating genai.Client: {e}")
    raise

project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
if not project_id:
    raise ValueError("GOOGLE_CLOUD_PROJECT not found in .env file")

try:
    # Initialize client without api_key to use ADC
    client = genai.Client(project=project_id)
    print("genai.Client initialized successfully using ADC.")
except Exception as e:
    print(f"Error creating genai.Client: {e}")
    raise

async def generate_content_from_gemini(prompt: str) -> str:
    """
    Generic function to generate content from Gemini Pro.
    """
    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.5-pro',
            contents=prompt
        )
        return response.text
    except Exception as e:
        # Handle potential API errors gracefully
        print(f"Error calling Gemini API: {e}")
        return "Error: Could not generate content from AI model."

# --- PROMPT TEMPLATES ---

def create_curriculum_prompt(req, sample_content: str = None) -> str:
    prompt = f"""
    Act as an expert curriculum designer for Indian schools.
    Generate a detailed curriculum for:
    - Class: {req.target_class}
    - Subject: {req.subject}
    - Topics to include: {', '.join(req.topics)}

    The output should be a structured markdown format with columns for:
    'Topic', 'Sub-topics', 'Learning Objectives', 'Estimated Hours', and 'Suggested Activities'.
    """
    if sample_content:
        prompt += f"\n\nUse the following sample curriculum as a reference for style and structure:\n---SAMPLE---\n{sample_content}\n---END SAMPLE---"
    return prompt

def create_lesson_plan_prompt(req) -> str:
    return f"""
    Create a detailed lesson plan for Class {req.target_class} for the subject {req.subject}.
    Break it down week-by-week for a month. Include subtopics, content to be covered, and the hours required for each part.
    Output in a clean, easy-to-read markdown format.
    """

def create_timetable_prompt(req) -> str:
    rules = '\n- '.join(req.rules) if req.rules else 'No specific rules provided.'
    return f"""
    Design a weekly teacher's timetable.
    - Teacher's assigned classes and batches: {', '.join(req.teacher_classes)}
    - Total syllabus completion hours required: {req.hours_required}
    - Follow these rules:
      - {rules}
    
    Generate a timetable in a markdown table format for a 5-day week (Monday to Friday).
    """

def create_quiz_prompt(req) -> str:
    prompt = f"""
    Generate a quiz with a total of {req.total_questions} questions for the subject '{req.subject}' with a difficulty level of '{req.difficulty}'.
    The quiz type is '{req.quiz_type}'.

    Your response MUST be a single valid JSON object.
    The JSON object should have a key "questions" which is an array of question objects.
    """

    if req.topics:
        topics_str = ", ".join(req.topics)
        prompt += f"\nThe quiz must specifically cover the following topics: {topics_str}.\n"

    prompt += """
    Your response MUST be a single valid JSON object.
    The JSON object should have a key "questions" which is an array of question objects.
    """

    if req.quiz_type in ["objective", "both"]:
        prompt += """
        For each multiple-choice (objective) question, provide:
        - "question_text": The question itself.
        - "options": An array of 4 strings.
        - "correct_answer": The exact string of the correct option.
        - "explanation": A brief explanation for the correct answer.
        """

    if req.quiz_type in ["subjective", "both"]:
        prompt += """
        For each subjective question, provide:
        - "question_text": The question itself.
        - "reference_answer": A concise, ideal answer for comparison and grading.
        """
    return prompt

def create_activity_prompt(req) -> str:
    return f"""
    Design a creative and engaging {req.activity_type} for Class {req.target_class} students on the topic of '{req.topic}'.
    Provide a clear, step-by-step set of instructions on how to conduct this activity.
    Include materials needed, objectives, and evaluation criteria.
    """


import time
import re
import uuid
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

def run_in_threadpool(func, *args, **kwargs):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        return loop.run_in_executor(pool, lambda: func(*args, **kwargs))

# --- ADDED: Helper function to create a safe filename from a title ---
def _sanitize_filename(title: str) -> str:
    """Converts a string into a safe, URL-friendly filename slug."""
    # 1. Convert to lowercase
    s = title.lower()
    # 2. Remove special characters
    s = re.sub(r'[^\w\s-]', '', s)
    # 3. Replace whitespace and hyphens with a single underscore
    s = re.sub(r'[\s-]+', '_', s).strip('_')
    # 4. Truncate to a reasonable length (e.g., 50 chars)
    s = s[:50]
    # 5. Add a short unique ID to prevent collisions
    unique_id = str(uuid.uuid4())[:8]
    return f"{s}_{unique_id}"

def _blocking_video_generation(prompt: str, file_name: str, duration_seconds: Optional[float] = None, fps: Optional[int] = None):
    output_gcs_uri = f"gs://{GCS_BUCKET}/{file_name}.mp4"

    # --- ADDED: Dynamically build the config dictionary ---
    config_params = {
        "aspect_ratio": "16:9",
        "output_gcs_uri": output_gcs_uri,
        # "duration_seconds": duration_seconds,
    }
    if duration_seconds:
        config_params["duration_seconds"] = duration_seconds
    if fps:
        config_params["fps"] = fps
    
    # Use the dynamically built config
    # config = GenerateVideosConfig(**config_params)
    config=types.GenerateVideosConfig(**config_params)

    print(f"Starting video generation with config: {config_params}")
    try:
        operation = client.models.generate_videos(
            model="veo-3.0-generate-001",
            prompt=prompt,
            config=config,
        )
        print(f"Started video generation operation: {operation.name}")
    except Exception as e:
        print(f"Error starting video generation: {e}")
        raise

    while not operation.done:
        time.sleep(15)
        print(f"Polling operation {operation.name}...")
        try:
            operation = client.operations.get(operation)
        except Exception as e:
            print(f"Error polling operation: {e}")
            raise

    if operation.error:
        print(f"Video generation failed: {operation.error}")
        raise Exception(f"Video generation failed: {operation.error}")

    if operation.response:
        print(f"Video generation complete. Output should be at: {output_gcs_uri}")
        # Assuming the API respects the output_gcs_uri in the config
        return output_gcs_uri
    else:
        print("Video generation operation finished but no response received.")
        return None

async def generate_video_and_suggest_title(prompt: str, duration_seconds: Optional[float] = None, fps: Optional[int] = None):
    title_prompt = f"Suggest a short, educational title for a video based on this prompt: '{prompt}'. Only return the title text."
    try:
        title_response = await client.aio.models.generate_content(
            model='gemini-2.5-pro',
            contents=title_prompt
        )
        suggested_title = title_response.text.strip().replace('"', '')
    except Exception as e:
        print(f"Error generating title: {e}")
        suggested_title = "Generated Video" # Fallback title

    try:
        # --- KEY CHANGE: Sanitize the suggested title to create the filename ---
        safe_file_name = _sanitize_filename(suggested_title)
        print(f"Suggested Title: '{suggested_title}' -> Sanitized Filename: '{safe_file_name}'")

        video_uri = await run_in_threadpool(
            _blocking_video_generation,
            prompt,
            safe_file_name, # Pass the new, safe filename here
            duration_seconds,
            fps
        )
        if not video_uri:
            raise Exception("Video generation completed but no URI was returned.")
        
        # Return the original, human-readable title and the final URI
        return suggested_title, video_uri
    except Exception as e:
        print(f"Error in video generation thread: {e}")
        raise e