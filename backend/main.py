from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.api import api_router

app = FastAPI(
    title="Educator's Assistant API",
    description="AI-powered tools for teachers.",
    version="1.0.0"
)


origins = [
    "http://localhost:3000",  # Your Next.js app's address
]

# This is the middleware that adds the necessary headers to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# Include the v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "API is running successfully!"}

# To run the app:
# uvicorn main:app --reload