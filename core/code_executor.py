"""
Code Executor
=============
Owner: Omer
Status: REAL IMPLEMENTATION — subprocess with real timing and memory.

This module handles safe execution of arbitrary Python code.
Uses subprocess with the correct Python executable for Windows.
Memory tracked using tracemalloc injected into user code.
"""

import subprocess
import tempfile
import os
import sys
import time
from core.config import SANDBOX_TIMEOUT_SECONDS, SANDBOX_MEMORY_LIMIT_MB


class ExecutionResult:
    """Result of running code in the sandbox."""
    def __init__(self, stdout="", stderr="", exit_code=0,
                 execution_time_ms=0.0, memory_usage_mb=0.0, timed_out=False):
        self.stdout = stdout
        self.stderr = stderr
        self.exit_code = exit_code
        self.execution_time_ms = execution_time_ms
        self.memory_usage_mb = memory_usage_mb
        self.timed_out = timed_out
        self.success = exit_code == 0 and not timed_out


def execute_code(source_code: str) -> ExecutionResult:
    """
    Execute Python code and return results with real timing and memory.

    Args:
        source_code: Python code string to execute

    Returns:
        ExecutionResult with stdout, stderr, timing, memory
    """

    # Wrap user code with memory tracking
    wrapped_code = f"""
import tracemalloc
import sys

tracemalloc.start()

# ── USER CODE START ──
{source_code}
# ── USER CODE END ──

current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
print(f"__MEMORY_PEAK_MB__:{{peak / 1024 / 1024:.4f}}", file=sys.stderr)
"""

    temp_path = None
    try:
        # Write wrapped code to a temp file
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False, encoding="utf-8"
        ) as f:
            f.write(wrapped_code)
            temp_path = f.name

        # Use the same Python that is running this project
        python_executable = sys.executable

        start = time.perf_counter()

        result = subprocess.run(
            [python_executable, temp_path],
            capture_output=True,
            text=True,
            timeout=SANDBOX_TIMEOUT_SECONDS,
        )

        elapsed_ms = (time.perf_counter() - start) * 1000

        # Extract memory from stderr
        memory_mb = 0.0
        clean_stderr = ""
        for line in result.stderr.splitlines():
            if line.startswith("__MEMORY_PEAK_MB__:"):
                try:
                    memory_mb = float(line.split(":")[1])
                except ValueError:
                    pass
            else:
                clean_stderr += line + "\n"

        return ExecutionResult(
            stdout=result.stdout.strip(),
            stderr=clean_stderr.strip(),
            exit_code=result.returncode,
            execution_time_ms=round(elapsed_ms, 3),
            memory_usage_mb=round(memory_mb, 4),
        )

    except subprocess.TimeoutExpired:
        return ExecutionResult(
            stderr=f"Timed out after {SANDBOX_TIMEOUT_SECONDS}s",
            exit_code=-1,
            timed_out=True,
        )
    except Exception as e:
        return ExecutionResult(
            stderr=str(e),
            exit_code=-1,
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)