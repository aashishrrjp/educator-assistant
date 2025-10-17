import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-pro')

async def generate_content_from_gemini(prompt: str) -> str:
    """
    Generic function to generate content from Gemini Pro.
    """
    try:
        response = await model.generate_content_async(prompt)
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

    The output should be in a detailed bulletin format with columns for:
    'Topic', 'Sub-topics', 'Learning Objectives', 'Estimated Hours', and 'Suggested Activities'. Dont include any messages like ofcourse i can help you, etc. Just provide the curriculum directly.
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