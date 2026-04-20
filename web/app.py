"""
FastAPI Application — STUB
============================
Owner: Abdulkadir
Status: STUB — basic route structure. Implement full API.

This connects the Streamlit frontend to the orchestrator backend.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from orchestrator import Orchestrator

app = FastAPI(
    title="AI Code Analyst",
    description="Autonomous AI Code Performance & Debugging Analyst",
    version="0.1.0",
)

orchestrator = Orchestrator()


class AnalyzeRequest(BaseModel):
    source_code: str
    description: Optional[str] = None


@app.get("/")
def root():
    return {"status": "running", "service": "AI Code Analyst"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
def analyze_code(request: AnalyzeRequest):
    """
    Main endpoint: analyze code through the full pipeline.
    
    TODO (Abdulkadir):
    1. Add error handling for each pipeline stage
    2. Add request validation (code not empty, not too long)
    3. Add response formatting
    4. Consider adding async support for long-running analysis
    5. Add rate limiting
    """
    try:
        report = orchestrator.run(
            source_code=request.source_code,
            description=request.description,
        )
        return report.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run with: uvicorn web.app:app --reload --host 0.0.0.0 --port 8000
