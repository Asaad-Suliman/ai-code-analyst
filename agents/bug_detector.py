import json
from openai import OpenAI
from core.schemas import UserInput, BugReport, Bug, Severity
from core.prompts import BUG_DETECTOR_PROMPT
from core.config import GEMINI_API_KEY

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=GEMINI_API_KEY,
)

def detect_bugs(user_input: UserInput) -> BugReport:
    prompt = BUG_DETECTOR_PROMPT.format(source_code=user_input.source_code)

    response = client.chat.completions.create(
        model="google/gemini-2.0-flash-lite-001",
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.choices[0].message.content
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(text)

    bugs = []
    for b in data["bugs"]:
        bugs.append(Bug(
            line_number=b.get("line_number"),
            severity=b["severity"],
            category=b["category"],
            description=b["description"],
            suggestion=b["suggestion"],
        ))

    return BugReport(
        bug_score=data["bug_score"],
        bugs=bugs,
        summary=data["summary"],
        has_critical_bugs=data["has_critical_bugs"],
    )
