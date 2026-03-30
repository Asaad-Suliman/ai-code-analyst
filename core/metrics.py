"""
Metrics Collection
===================
Owner: Omer
Status: STUB — implement real profiling tools.

Utility functions for measuring code performance metrics.
Used by performance_analyzer.py and validator.py.
"""

import time
import ast
from typing import Optional


def measure_execution_time(source_code: str, runs: int = 3) -> Optional[float]:
    """
    Run code multiple times and return average execution time in ms.
    
    TODO (Omer): Use code_executor.py sandbox instead of direct exec.
    """
    # STUB
    return None


def measure_memory_usage(source_code: str) -> Optional[float]:
    """
    Run code with tracemalloc and return peak memory in MB.
    
    TODO (Omer): Implement with tracemalloc inside sandbox.
    """
    # STUB
    return None


def estimate_complexity(source_code: str) -> dict:
    """
    Estimate time/space complexity using AST analysis.
    
    Looks for:
    - Nested loops → O(n^2) or worse
    - Recursive calls → check for memoization
    - List comprehensions inside loops
    - Sorting calls → O(n log n)
    
    TODO (Omer): Implement AST walking logic.
    Can also send to Gemini for more accurate analysis.
    """
    result = {
        "time_complexity": "unknown",
        "space_complexity": "unknown",
        "nested_loop_depth": 0,
        "has_recursion": False,
    }

    try:
        tree = ast.parse(source_code)
        # TODO: Walk the AST and detect patterns
        # Example: count nested For nodes
        for node in ast.walk(tree):
            if isinstance(node, ast.For):
                # Check if there's a For inside this For
                for child in ast.walk(node):
                    if child is not node and isinstance(child, ast.For):
                        result["nested_loop_depth"] = max(
                            result["nested_loop_depth"], 2
                        )
                        result["time_complexity"] = "O(n^2)"
    except SyntaxError:
        pass

    return result
