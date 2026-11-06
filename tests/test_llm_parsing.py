"""Offline tests for model-dependent parsing. No API key or Docker needed."""

import importlib
from types import SimpleNamespace

from agents import bug_detector
from core import config
from core.schemas import UserInput


def _fake_client(answer: str):
    message = SimpleNamespace(content=answer)
    response = SimpleNamespace(choices=[SimpleNamespace(message=message)])
    create = lambda **kwargs: response  # noqa: E731
    return SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))


def _detect(monkeypatch, answer: str):
    monkeypatch.setattr(bug_detector, "get_llm_client", lambda: _fake_client(answer))
    return bug_detector.detect_bugs(UserInput(source_code="print(1 / 0)"))


def test_critical_bug_sets_flag_even_if_model_omits_it(monkeypatch):
    answer = (
        '```json\n{"bug_score": 40, "summary": "x", "bugs": ['
        '{"line": 1, "severity": "critical", "type": "runtime error", '
        '"description": "division by zero", "fix": "guard it"}]}\n```'
    )
    report = _detect(monkeypatch, answer)
    assert len(report.bugs) == 1
    assert report.has_critical_bugs is True


def test_no_critical_bug_leaves_flag_false(monkeypatch):
    answer = (
        '{"bug_score": 80, "summary": "x", "has_critical_bugs": false, "bugs": ['
        '{"line": 1, "severity": "warning", "type": "style", '
        '"description": "d", "fix": "f"}]}'
    )
    assert _detect(monkeypatch, answer).has_critical_bugs is False


def test_empty_llm_model_falls_back_to_default(monkeypatch):
    monkeypatch.setenv("LLM_MODEL", "")
    try:
        importlib.reload(config)
        assert config.LLM_MODEL == "gpt-6-luna"
    finally:
        monkeypatch.undo()
        importlib.reload(config)
