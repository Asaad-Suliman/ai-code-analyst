"""
Performance Analyzer Agent
===========================
Owner: Omer
Status: REAL IMPLEMENTATION — uses code_executor and metrics for real data.
"""
import json
from openai import OpenAI
from core.schemas import UserInput, PerformanceReport
from core.metrics import (
    measure_execution_time,
    measure_memory_usage,
    estimate_complexity,
    detect_bottlenecks,
)
from core.config import GEMINI_API_KEY

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=GEMINI_API_KEY,
)


def analyze_performance(user_input: UserInput) -> PerformanceReport:
    """
    Execute code in sandbox and measure real performance metrics.
    """
    source_code = user_input.source_code

    # Step 1 — Measure real execution time
    execution_time = measure_execution_time(source_code, runs=3)

    # Step 2 — Measure real memory usage
    memory_usage = measure_memory_usage(source_code)

    # Step 3 — Static complexity analysis
    complexity = estimate_complexity(source_code)

    # Step 4 — Detect bottlenecks
    bottlenecks = detect_bottlenecks(source_code)

    # Step 5 — Ask AI for deeper analysis
    prompt = f"""You are a performance analysis expert.

Analyze this Python code for performance issues.

STATIC ANALYSIS RESULTS:
- Execution time: {execution_time}ms
- Memory usage: {memory_usage}MB  
- Time complexity: {complexity['time_complexity']}
- Space complexity: {complexity['space_complexity']}
- Nested loop depth: {complexity['nested_loop_depth']}
- Has recursion: {complexity['has_recursion']}
- Detected bottlenecks: {bottlenecks}

CODE:
```python
{source_code}
```

Return ONLY valid JSON:
{{
  "summary": "2-3 sentence performance summary",
  "additional_bottlenecks": ["any bottlenecks not already detected"],
  "space_complexity": "O(...)"
}}"""

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-lite-001",
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.choices[0].message.content
        text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        ai_data = json.loads(text)
        summary = ai_data.get("summary", "")
        extra_bottlenecks = ai_data.get("additional_bottlenecks", [])
        space_complexity = ai_data.get("space_complexity", complexity["space_complexity"])
        all_bottlenecks = list(dict.fromkeys(bottlenecks + extra_bottlenecks))
    except Exception:
        summary = f"Code has {complexity['time_complexity']} time complexity."
        all_bottlenecks = bottlenecks
        space_complexity = complexity["space_complexity"]

    return PerformanceReport(
        execution_time_ms=execution_time if execution_time else 0.0,
        memory_usage_mb=memory_usage if memory_usage else 0.0,
        time_complexity=complexity["time_complexity"],
        space_complexity=space_complexity,
        bottlenecks=all_bottlenecks if all_bottlenecks else ["No bottlenecks detected"],
        executed_successfully=execution_time is not None,
        execution_error=None if execution_time else "Execution failed",
        summary=summary,
    )