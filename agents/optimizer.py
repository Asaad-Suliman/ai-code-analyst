"""
Optimizer Agent — STUB
=======================
Owner: Ibro
Status: STUB — returns fake data. Replace with real Gemini implementation.

This agent takes bug and performance reports, then asks Gemini to rewrite
the code to be faster and cleaner.
"""

from core.schemas import UserInput, BugReport, PerformanceReport, OptimizationResult


def optimize_code(
    user_input: UserInput,
    bug_report: BugReport,
    performance_report: PerformanceReport,
) -> OptimizationResult:
    """
    Generate optimized version of the code using Gemini.
    
    TODO (Ibro):
    1. Build a prompt that includes:
       - The original source code
       - The bug report (so Gemini knows what to fix)
       - The performance report (so Gemini knows what's slow)
    2. Send to Gemini API
    3. Parse the response to extract the optimized code
    4. List the changes made
    
    Args:
        user_input: Original code
        bug_report: Bugs found by bug detector
        performance_report: Performance metrics
        
    Returns:
        OptimizationResult with new code and explanation
    """
    # ──── STUB: Remove everything below and implement real logic ────
    optimized = '''
def find_duplicates(lst):
    seen = set()
    duplicates = set()
    for item in lst:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return list(duplicates)

# Test
print(find_duplicates([1, 2, 3, 2, 4, 5, 1, 6, 7, 5]))
'''
    return OptimizationResult(
        optimized_code=optimized,
        changes_made=[
            "Replaced nested loop with single-pass set-based approach",
            "Changed duplicates from list to set for O(1) lookup",
            "Reduced time complexity from O(n^2) to O(n)",
        ],
        expected_improvement="O(n^2) → O(n), estimated ~96% faster for large inputs",
    )
