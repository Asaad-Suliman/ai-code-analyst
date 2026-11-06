import json
import re
from core.schemas import UserInput, BugReport, Bug, Severity
from core.prompts import BUG_DETECTOR_PROMPT
from core.config import get_llm_client, get_llm_model

def detect_bugs(user_input: UserInput) -> BugReport:
    # Input validation
    if not user_input.source_code or not user_input.source_code.strip():
        return BugReport(
            bug_score=0,
            bugs=[],
            summary="No code provided. Please submit Python code to analyze.",
            has_critical_bugs=False,
        )

    if len(user_input.source_code) > 10000:
        return BugReport(
            bug_score=0,
            bugs=[],
            summary="Code is too long. Please submit code under 10,000 characters.",
            has_critical_bugs=False,
        )

    if not any(kw in user_input.source_code for kw in ["def ", "class ", "import ", "for ", "while ", "if ", "print", "="]):
        return BugReport(
            bug_score=0,
            bugs=[],
            summary="This does not appear to be Python code. Please submit valid Python.",
            has_critical_bugs=False,
        )

    prompt = BUG_DETECTOR_PROMPT.format(source_code=user_input.source_code)

    response = get_llm_client().chat.completions.create(
        model=get_llm_model(),
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.choices[0].message.content
    text = re.sub(r'```(?:json)?\s*|\s*```', '', text).strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
            except json.JSONDecodeError:
                data = None
        else:
            data = None

    if data is None:
        return BugReport(
            bug_score=0,
            bugs=[],
            summary="Could not parse response.",
            has_critical_bugs=False,
        )

    def _map_severity(s: str) -> str:
        s = (s or "").lower()
        if s in ("critical", "high"):
            return "critical"
        if s in ("medium", "warning"):
            return "warning"
        return "info"

    bugs = []
    for b in data.get("bugs", []):
        bugs.append(Bug(
            line_number=b.get("line") or b.get("line_number"),
            severity=_map_severity(b.get("severity", "info")),
            category=b.get("type") or b.get("category", "bad_practice"),
            description=b.get("description", ""),
            suggestion=b.get("fix") or b.get("suggestion", ""),
        ))

    return BugReport(
        bug_score=data.get("bug_score", 50),
        bugs=bugs,
        summary=data.get("summary", "Analysis complete."),
        # Derived from the parsed bugs: models do not reliably set the flag.
        has_critical_bugs=bool(data.get("has_critical_bugs"))
        or any(b.severity == Severity.CRITICAL for b in bugs),
    )
