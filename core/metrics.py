"""
Metrics Collection
===================
Owner: Omer
Status: REAL IMPLEMENTATION — actual timing, memory, and AST analysis.
"""
import ast
import sys
import time
import subprocess
import tempfile
import os
import tracemalloc
from typing import Optional
from core.code_executor import execute_code


def measure_execution_time(source_code: str, runs: int = 3) -> Optional[float]:
    """
    Run code multiple times using sandbox and return average execution time in ms.
    """
    times = []
    for _ in range(runs):
        result = execute_code(source_code)
        if result.success and result.execution_time_ms is not None:
            times.append(result.execution_time_ms)
    if not times:
        return None
    return round(sum(times) / len(times), 3)


def measure_memory_usage(source_code: str) -> Optional[float]:
    """
    Run code and return peak memory usage in MB using tracemalloc.
    """
    result = execute_code(source_code)
    if result.success and result.memory_usage_mb is not None:
        return result.memory_usage_mb
    return None


def estimate_complexity(source_code: str) -> dict:
    """
    Estimate time/space complexity using AST analysis.
    Detects:
    - Nested loops → O(n^2) or worse
    - Single loops → O(n)
    - Recursive calls → flags recursion
    - Sorting calls → O(n log n)
    - No loops → O(1)
    """
    result = {
        "time_complexity": "O(1)",
        "space_complexity": "O(1)",
        "nested_loop_depth": 0,
        "has_recursion": False,
        "has_sorting": False,
        "loop_count": 0,
        "function_count": 0,
        "max_nesting_depth": 0,
    }

    try:
        tree = ast.parse(source_code)
    except SyntaxError:
        result["time_complexity"] = "unknown"
        return result

    # Count functions
    functions = [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]
    result["function_count"] = len(functions)

    # Count all loops
    all_loops = [n for n in ast.walk(tree) if isinstance(n, (ast.For, ast.While))]
    result["loop_count"] = len(all_loops)

    # Detect nested loops
    max_depth = 0
    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.While)):
            depth = _count_loop_depth(node)
            max_depth = max(max_depth, depth)

    result["nested_loop_depth"] = max_depth
    result["max_nesting_depth"] = max_depth

    # Detect recursion
    for func in functions:
        func_name = func.name
        for node in ast.walk(func):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == func_name:
                    result["has_recursion"] = True

    # Detect sorting
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in ("sort", "sorted"):
                result["has_sorting"] = True
            if isinstance(node.func, ast.Attribute) and node.func.attr == "sort":
                result["has_sorting"] = True

    # Determine complexity
    if max_depth >= 3:
        result["time_complexity"] = "O(n^3)"
        result["space_complexity"] = "O(n)"
    elif max_depth == 2:
        result["time_complexity"] = "O(n^2)"
        result["space_complexity"] = "O(n)"
    elif result["has_recursion"]:
        result["time_complexity"] = "O(2^n)"
        result["space_complexity"] = "O(n)"
    elif result["has_sorting"]:
        result["time_complexity"] = "O(n log n)"
        result["space_complexity"] = "O(n)"
    elif result["loop_count"] > 0:
        result["time_complexity"] = "O(n)"
        result["space_complexity"] = "O(n)"
    else:
        result["time_complexity"] = "O(1)"
        result["space_complexity"] = "O(1)"

    return result


def _count_loop_depth(node, current_depth=1) -> int:
    """Recursively count the maximum loop nesting depth."""
    max_depth = current_depth
    for child in ast.walk(node):
        if child is not node and isinstance(child, (ast.For, ast.While)):
            depth = _count_loop_depth(child, current_depth + 1)
            max_depth = max(max_depth, depth)
    return max_depth


def detect_bottlenecks(source_code: str) -> list:
    """
    Detect common performance bottlenecks using AST analysis.
    """
    bottlenecks = []

    try:
        tree = ast.parse(source_code)
    except SyntaxError:
        return bottlenecks

    for node in ast.walk(tree):
        # Nested loops
        if isinstance(node, (ast.For, ast.While)):
            for child in ast.walk(node):
                if child is not node and isinstance(child, (ast.For, ast.While)):
                    line = getattr(node, "lineno", "?")
                    bottlenecks.append(f"Nested loop at line {line}")
                    break

        # List membership check inside loop (x in list)
        if isinstance(node, (ast.For, ast.While)):
            for child in ast.walk(node):
                if isinstance(child, ast.Compare):
                    for op in child.ops:
                        if isinstance(op, ast.In):
                            line = getattr(child, "lineno", "?")
                            bottlenecks.append(
                                f"List membership check 'in' inside loop at line {line} — use set for O(1)"
                            )
                            break

        # String concatenation in loop
        if isinstance(node, (ast.For, ast.While)):
            for child in ast.walk(node):
                if isinstance(child, ast.AugAssign) and isinstance(child.op, ast.Add):
                    if isinstance(child.value, ast.Constant) and isinstance(
                        child.value.value, str
                    ):
                        line = getattr(child, "lineno", "?")
                        bottlenecks.append(
                            f"String concatenation in loop at line {line} — use join() instead"
                        )

    # Remove duplicates
    return list(dict.fromkeys(bottlenecks))