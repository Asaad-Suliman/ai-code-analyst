"""
Validator Agent
================
Author: Asaad (System Architect)

The validator is the PROOF engine. It:
1. Runs the original code and captures output + timing
2. Runs the optimized code and captures output + timing  
3. Compares outputs (they MUST match — same input → same output)
4. Compares performance (the optimized code should be faster)
5. Returns APPROVED, REJECTED, or UNCHANGED

This is what makes our project different from ChatGPT — we PROVE the improvement.

NOTE: For MVP, this uses subprocess directly. When Omer's Docker sandbox
is ready, we switch to core/code_executor.py for safe execution.
"""

import subprocess
import time
import tempfile
import os
from core.schemas import ValidationResult, ValidationStatus
from core.config import SANDBOX_TIMEOUT_SECONDS


def validate_optimization(
    original_code: str,
    optimized_code: str,
    num_runs: int = 3,
) -> ValidationResult:
    """
    Run both original and optimized code, compare results.
    
    Args:
        original_code: The user's original Python code
        optimized_code: The optimizer's improved version
        num_runs: Number of times to run each for reliable timing
        
    Returns:
        ValidationResult with comparison metrics
    """
    # Run original code
    orig_result = _execute_code(original_code, num_runs)
    
    # Run optimized code
    opt_result = _execute_code(optimized_code, num_runs)

    # ─── Handle execution failures ───────────────────────
    
    if not orig_result["success"] and not opt_result["success"]:
        return ValidationResult(
            status=ValidationStatus.REJECTED,
            summary=f"Both versions failed. Original: {orig_result['error']}. Optimized: {opt_result['error']}",
            outputs_match=False,
        )

    if not opt_result["success"]:
        return ValidationResult(
            status=ValidationStatus.REJECTED,
            original_time_ms=orig_result["avg_time_ms"],
            original_output=orig_result["output"],
            summary=f"Optimized code failed to execute: {opt_result['error']}",
            outputs_match=False,
        )

    if not orig_result["success"]:
        # Original fails but optimized works — that's a bug fix!
        return ValidationResult(
            status=ValidationStatus.APPROVED,
            optimized_time_ms=opt_result["avg_time_ms"],
            optimized_output=opt_result["output"],
            summary=f"Original code had errors. Optimized code runs successfully in {opt_result['avg_time_ms']:.1f}ms.",
            outputs_match=False,
        )

    # ─── Compare outputs ─────────────────────────────────
    
    outputs_match = _normalize_output(orig_result["output"]) == _normalize_output(opt_result["output"])

    # ─── Compare performance ─────────────────────────────
    
    orig_time = orig_result["avg_time_ms"]
    opt_time = opt_result["avg_time_ms"]

    if orig_time > 0:
        speedup = ((orig_time - opt_time) / orig_time) * 100
    else:
        speedup = 0.0

    # ─── Determine status ────────────────────────────────
    
    if not outputs_match:
        status = ValidationStatus.REJECTED
        summary = (
            f"REJECTED: Output mismatch. The optimized code produces different results. "
            f"Original output: '{orig_result['output'][:100]}', "
            f"Optimized output: '{opt_result['output'][:100]}'"
        )
    elif speedup > 5:  # At least 5% improvement to count
        status = ValidationStatus.APPROVED
        summary = (
            f"APPROVED: {speedup:.1f}% faster. "
            f"Original: {orig_time:.1f}ms → Optimized: {opt_time:.1f}ms. "
            f"Outputs match."
        )
    elif speedup < -5:  # Got slower
        status = ValidationStatus.REJECTED
        summary = (
            f"REJECTED: Optimized code is {abs(speedup):.1f}% SLOWER. "
            f"Original: {orig_time:.1f}ms → Optimized: {opt_time:.1f}ms."
        )
    else:
        status = ValidationStatus.UNCHANGED
        summary = (
            f"UNCHANGED: No significant performance difference "
            f"({orig_time:.1f}ms vs {opt_time:.1f}ms). Outputs match."
        )

    return ValidationResult(
        status=status,
        original_time_ms=round(orig_time, 2),
        optimized_time_ms=round(opt_time, 2),
        speedup_percentage=round(speedup, 2) if speedup > 0 else None,
        original_output=orig_result["output"][:500],  # Truncate for safety
        optimized_output=opt_result["output"][:500],
        outputs_match=outputs_match,
        summary=summary,
    )


def _execute_code(code: str, num_runs: int = 3) -> dict:
    """
    Execute Python code in a subprocess and measure timing.
    
    Returns dict with: success, output, error, avg_time_ms, times
    
    WARNING: This is a TEMPORARY implementation using subprocess.
    When Omer's Docker sandbox is ready, replace this with:
        from core.code_executor import execute_in_sandbox
    """
    times = []
    last_output = ""
    last_error = ""

    for i in range(num_runs):
        try:
            # Write code to a temp file
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".py", delete=False
            ) as f:
                f.write(code)
                temp_path = f.name

            start = time.perf_counter()
            
            result = subprocess.run(
                ["python3", temp_path],
                capture_output=True,
                text=True,
                timeout=SANDBOX_TIMEOUT_SECONDS,
            )
            
            elapsed_ms = (time.perf_counter() - start) * 1000
            times.append(elapsed_ms)
            last_output = result.stdout.strip()
            
            if result.returncode != 0:
                last_error = result.stderr.strip()
                return {
                    "success": False,
                    "output": last_output,
                    "error": last_error[:300],
                    "avg_time_ms": 0,
                    "times": [],
                }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Code timed out after {SANDBOX_TIMEOUT_SECONDS}s",
                "avg_time_ms": 0,
                "times": [],
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e)[:300],
                "avg_time_ms": 0,
                "times": [],
            }
        finally:
            # Clean up temp file
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.unlink(temp_path)

    avg_time = sum(times) / len(times) if times else 0

    return {
        "success": True,
        "output": last_output,
        "error": "",
        "avg_time_ms": avg_time,
        "times": times,
    }


def _normalize_output(output: str) -> str:
    """
    Normalize output for comparison.

    Handles these real-world cases:
    1. Sets returned in different order  → sort before comparing
    2. Floats with tiny differences      → round to 6 decimal places
    3. set() vs list() output format     → normalize both to sorted list
    4. Multi-line output                 → compare line by line after stripping
    """
    import ast
    import re

    # Step 4: Normalize multi-line — strip each line, drop blanks, rejoin
    lines = [line.strip() for line in output.strip().splitlines()]
    lines = [l for l in lines if l]  # drop blank lines

    normalized_lines = []
    for line in lines:
        # Step 3 & 1: Handle list/set literals — normalize to sorted list
        if (line.startswith("[") and line.endswith("]")) or \
           (line.startswith("{") and line.endswith("}")):
            try:
                parsed = ast.literal_eval(line)
                if isinstance(parsed, (list, set)):
                    normalized_lines.append(str(sorted(parsed)))
                    continue
            except (ValueError, SyntaxError):
                pass

        # Step 2: Round floats in the line to 6 decimal places
        def round_float(match):
            return str(round(float(match.group()), 6))

        line = re.sub(r"-?\d+\.\d+", round_float, line)
        normalized_lines.append(line)

    return "\n".join(normalized_lines)


# ─── Quick test ──────────────────────────────────────────

if __name__ == "__main__":
    original = '''
def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

print(find_duplicates([1, 2, 3, 2, 4, 5, 1, 6, 7, 5]))
'''

    optimized = '''
def find_duplicates(lst):
    seen = set()
    duplicates = set()
    for item in lst:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return list(duplicates)

print(find_duplicates([1, 2, 3, 2, 4, 5, 1, 6, 7, 5]))
'''

    result = validate_optimization(original, optimized)
    print(f"Status: {result.status.value}")
    print(f"Original: {result.original_time_ms}ms")
    print(f"Optimized: {result.optimized_time_ms}ms")
    print(f"Speedup: {result.speedup_percentage}%")
    print(f"Outputs match: {result.outputs_match}")