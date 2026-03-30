"""
Performance Analyzer Agent — STUB
===================================
Owner: Omer
Status: STUB — returns fake data. Replace with real sandbox execution.

This agent runs the user's code in a sandbox, measures execution time,
memory usage, and detects complexity patterns.
"""

from core.schemas import UserInput, PerformanceReport


def analyze_performance(user_input: UserInput) -> PerformanceReport:
    """
    Execute code in sandbox and measure performance metrics.
    
    TODO (Omer):
    1. Send source_code to code_executor.py (your sandbox)
    2. Measure execution_time_ms using time.perf_counter or cProfile
    3. Measure memory_usage_mb using tracemalloc
    4. Use Gemini or AST analysis to estimate time/space complexity
    5. Detect bottlenecks (nested loops, repeated allocations, etc.)
    
    Args:
        user_input: UserInput with source_code
        
    Returns:
        PerformanceReport with all metrics
    """
    # ──── STUB: Remove everything below and implement real logic ────
    return PerformanceReport(
        execution_time_ms=340.0,
        memory_usage_mb=2.4,
        time_complexity="O(n^2)",
        space_complexity="O(n)",
        bottlenecks=["Nested loop at line 3-5", "List scan inside loop at line 5"],
        executed_successfully=True,
        execution_error=None,
        summary="Code runs but has O(n^2) complexity due to nested iteration.",
    )
