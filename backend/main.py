from fastapi import FastAPI
from api.v1.api import api_router

app = FastAPI(
    title="Educator's Assistant API",
    description="AI-powered tools for teachers.",
    version="1.0.0"
)

# Include the v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "API is running successfully!"}

# To run the app:
# uvicorn main:app --reload