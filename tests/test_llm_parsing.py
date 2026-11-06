"""Offline tests for model-dependent parsing. No API key or Docker needed."""

import importlib
from core import config


def test_empty_llm_model_falls_back_to_default(monkeypatch):
    monkeypatch.setenv("LLM_MODEL", "")
    try:
        importlib.reload(config)
        assert config.LLM_MODEL == "gpt-6-luna"
    finally:
        monkeypatch.undo()
        importlib.reload(config)
