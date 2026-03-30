"""
Code Executor — STUB
=====================
Owner: Omer
Status: STUB — replace with Docker sandbox implementation.

This module handles safe execution of arbitrary Python code.
Currently uses subprocess (UNSAFE for production).
Omer will replace this with Docker-based sandboxing.

WARNING: Running arbitrary code without sandboxing is dangerous.
This stub is for development only.
"""

import subprocess
import tempfile
import os
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
    Execute Python code and return results.
    
    TODO (Omer):
    1. Replace subprocess with Docker container execution
    2. Add resource limits (CPU, memory via SANDBOX_MEMORY_LIMIT_MB)
    3. Add network isolation (no internet access for user code)
    4. Add filesystem isolation (user code can't read host files)
    5. Use tracemalloc for accurate memory measurement
    6. Handle infinite loops via SANDBOX_TIMEOUT_SECONDS
    
    Args:
        source_code: Python code string to execute
        
    Returns:
        ExecutionResult with stdout, stderr, timing, memory
    """
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False
        ) as f:
            f.write(source_code)
            temp_path = f.name

        start = time.perf_counter()
        
        result = subprocess.run(
            ["python3", temp_path],
            capture_output=True,
            text=True,
            timeout=SANDBOX_TIMEOUT_SECONDS,
        )
        
        elapsed_ms = (time.perf_counter() - start) * 1000

        return ExecutionResult(
            stdout=result.stdout.strip(),
            stderr=result.stderr.strip(),
            exit_code=result.returncode,
            execution_time_ms=elapsed_ms,
            memory_usage_mb=0.0,  # TODO: implement real memory tracking
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
