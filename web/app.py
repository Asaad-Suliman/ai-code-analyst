"""
FastAPI Application
============================
Owner: Abdulkadir
Status: REAL IMPLEMENTATION

This connects the React frontend to the orchestrator backend.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from orchestrator import Orchestrator

app = FastAPI(
    title="AI Code Analyst",
    description="Autonomous AI Code Performance & Debugging Analyst",
    version="0.1.0",
)

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    try:
        report = orchestrator.run(
            source_code=request.source_code,
            description=request.description,
        )
        return report.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))