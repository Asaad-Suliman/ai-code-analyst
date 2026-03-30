"""
Bug Detector Agent — STUB
==========================
Owner: Ibro
Status: STUB — returns fake data. Replace with real Gemini implementation.

This agent receives user code and returns a BugReport with detected issues.
"""

from core.schemas import UserInput, BugReport, Bug, Severity


def detect_bugs(user_input: UserInput) -> BugReport:
    """
    Analyze code for bugs, logical errors, and risky patterns.
    
    TODO (Ibro):
    1. Send user_input.source_code to Gemini API with a prompt from core/prompts.py
    2. Parse Gemini's response into Bug objects
    3. Calculate bug_score based on severity and count
    4. Return a BugReport
    
    Args:
        user_input: UserInput with source_code and optional description
        
    Returns:
        BugReport with list of bugs, score, and summary
    """
    # ──── STUB: Remove everything below and implement real logic ────
    return BugReport(
        bug_score=45,
        bugs=[
            Bug(
                line_number=3,
                severity=Severity.WARNING,
                category="performance",
                description="Nested loop causes O(n^2) complexity",
                suggestion="Use a set or dictionary for O(n) lookup",
            ),
            Bug(
                line_number=5,
                severity=Severity.INFO,
                category="bad_practice",
                description="Using 'not in' on a list inside a loop is O(n) per check",
                suggestion="Use a set for the duplicates collection",
            ),
        ],
        summary="Code has performance issues due to nested iteration patterns.",
        has_critical_bugs=False,
    )
