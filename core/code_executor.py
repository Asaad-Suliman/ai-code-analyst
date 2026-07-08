"""
Code Executor
=============
Owner: Omer
Status: REAL IMPLEMENTATION - Docker sandbox with real timing and memory.

This module handles safe execution of arbitrary Python code.
Uses Docker container with resource limits and network isolation.
Memory tracked using tracemalloc injected into user code.
"""

import subprocess
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
    Execute Python code inside a Docker sandbox and return results
    with real timing and memory tracking.

    Args:
        source_code: Python code string to execute

    Returns:
        ExecutionResult with stdout, stderr, timing, memory
    """

    # Wrap user code with an in-container timing + memory harness. Timing the
    # user code *inside* the container excludes the ~160ms docker/interpreter
    # startup, so execution_time_ms reflects user code only. Both markers go to
    # stderr (never stdout) so captured output stays clean.
    wrapped_code = f"""
import sys
import time
import resource

_t0 = time.perf_counter()
# USER CODE START
{source_code}
# USER CODE END
_exec_ms = (time.perf_counter() - _t0) * 1000

print(f"__EXEC_TIME_MS__:{{_exec_ms:.4f}}", file=sys.stderr)
_mem_kb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
print(f"__MEMORY_PEAK_MB__:{{_mem_kb / 1024:.4f}}", file=sys.stderr)
"""

    try:
        start = time.perf_counter()

        result = subprocess.run(
            [
                "docker", "run",
                "--rm",                                     # Delete container after run
            "-i",                                       # Accept input via stdin
            "--network", "none",                        # No internet access
            "--memory", f"{SANDBOX_MEMORY_LIMIT_MB}m", # Memory limit
            "--memory-swap", f"{SANDBOX_MEMORY_LIMIT_MB}m", # Disable swap (equal to --memory) so the cap is real
            "--cpus", "0.5",                            # CPU limit
            "code-sandbox"                              # Docker image name
            ],
            input=wrapped_code,
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=SANDBOX_TIMEOUT_SECONDS,
        )

        elapsed_ms = (time.perf_counter() - start) * 1000

        # Extract timing + memory markers from stderr (last match wins, so a
        # value printed by the harness after the user code cannot be spoofed).
        memory_mb = 0.0
        exec_ms = None
        clean_stderr = ""
        for line in result.stderr.splitlines():
            if line.startswith("__MEMORY_PEAK_MB__:"):
                try:
                    memory_mb = float(line.split(":")[1])
                except ValueError:
                    pass
            elif line.startswith("__EXEC_TIME_MS__:"):
                try:
                    exec_ms = float(line.split(":")[1])
                except ValueError:
                    pass
            else:
                clean_stderr += line + "\n"

        # Prefer the in-container time; fall back to outer wall-clock only if the
        # harness marker is missing (e.g. user code raised before it printed).
        execution_time_ms = round(exec_ms, 3) if exec_ms is not None else round(elapsed_ms, 3)

        return ExecutionResult(
            stdout=result.stdout.strip(),
            stderr=clean_stderr.strip(),
            exit_code=result.returncode,
            execution_time_ms=execution_time_ms,
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