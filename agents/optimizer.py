import json
from openai import OpenAI
from core.schemas import UserInput, BugReport, PerformanceReport, OptimizationResult
from core.prompts import OPTIMIZER_PROMPT
from core.config import GEMINI_API_KEY

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=GEMINI_API_KEY,
)

def optimize_code(
    user_input: UserInput,
    bug_report: BugReport,
    performance_report: PerformanceReport,
) -> OptimizationResult:
    prompt = OPTIMIZER_PROMPT.format(
        source_code=user_input.source_code,
        bug_report=bug_report.model_dump_json(indent=2),
        performance_report=performance_report.model_dump_json(indent=2),
    )

    response = client.chat.completions.create(
        model="google/gemini-2.0-flash-lite-001",
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.choices[0].message.content
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(text)

    return OptimizationResult(
        optimized_code=data.get("optimized_code", user_input.source_code),
        changes_made=data.get("changes_made", []),
        expected_improvement=data.get("expected_improvement", "No improvement estimated."),
    )
