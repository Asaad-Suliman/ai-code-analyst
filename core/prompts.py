"""
Prompt Templates
=================
Owner: Ibro
Status: STUB — fill with real prompts for each agent.

All Gemini prompts live here. Centralized so we can iterate on them
without touching agent logic.
"""


BUG_DETECTOR_PROMPT = """
You are a senior code reviewer. Analyze the following Python code and find:
1. Runtime errors
2. Logical errors  
3. Bad practices
4. Security issues

For each bug, provide:
- line_number (int or null)
- severity: "critical", "warning", or "info"
- category: one of "runtime_error", "logic_error", "bad_practice", "security"
- description: what the bug is
- suggestion: how to fix it

Also provide:
- bug_score: 0 (perfect) to 100 (terrible)
- summary: one paragraph overview
- has_critical_bugs: true/false

Return ONLY valid JSON matching this structure. No markdown, no explanation.

Code to analyze:
```python
{source_code}
```
"""


PERFORMANCE_ANALYZER_PROMPT = """
You are a performance analysis expert. Analyze this Python code and identify:
1. Time complexity (Big O notation)
2. Space complexity
3. Performance bottlenecks (nested loops, repeated allocations, etc.)

Return ONLY valid JSON with:
- time_complexity: string like "O(n^2)"
- space_complexity: string like "O(n)"  
- bottlenecks: list of strings describing slow patterns

Code to analyze:
```python
{source_code}
```
"""


OPTIMIZER_PROMPT = """
You are an expert Python optimizer. Given the original code, the bug report,
and the performance analysis, rewrite the code to be:
1. Faster (better time complexity if possible)
2. Cleaner (fix bugs found)
3. Correct (MUST produce the same output as the original)

Bug Report:
{bug_report}

Performance Report:
{performance_report}

Return ONLY valid JSON with:
- optimized_code: the complete rewritten Python code (string)
- changes_made: list of strings explaining each change
- expected_improvement: string like "O(n^2) → O(n), ~90% faster"

CRITICAL: The optimized code MUST produce IDENTICAL output to the original.

Original code:
```python
{source_code}
```
"""
