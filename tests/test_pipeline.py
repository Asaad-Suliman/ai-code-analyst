"""
Pipeline Integration Test
==========================
Tests the full orchestrator pipeline end-to-end.
Run with: python -m pytest tests/test_pipeline.py -v
"""

import pytest
from orchestrator import Orchestrator
from core.schemas import FinalReport, ValidationStatus


class TestPipeline:
    """Test the full agent pipeline."""

    def setup_method(self):
        self.orch = Orchestrator()

    def test_full_pipeline_returns_report(self):
        """Pipeline should return a FinalReport object."""
        code = """
def add(a, b):
    return a + b
print(add(2, 3))
"""
        report = self.orch.run(code)
        assert isinstance(report, FinalReport)
        assert report.source_code == code
        assert report.bug_report is not None
        assert report.performance_report is not None
        assert report.optimization is not None
        assert report.validation is not None

    def test_pipeline_with_slow_code(self):
        """Pipeline should detect and optimize slow code."""
        code = """
def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

print(find_duplicates([1, 2, 3, 2, 4, 5, 1]))
"""
        report = self.orch.run(code)
        assert report.bug_report.bug_score > 0
        assert report.optimized_code != ""
        assert report.overall_summary != ""


class TestValidator:
    """Test the validator agent independently."""

    def test_validator_approves_faster_code(self):
        from agents.validator import validate_optimization

        original = """
import time
time.sleep(0.1)
print("done")
"""
        optimized = """
print("done")
"""
        result = validate_optimization(original, optimized)
        assert result.outputs_match is True
        assert result.status == ValidationStatus.APPROVED

    def test_validator_rejects_wrong_output(self):
        from agents.validator import validate_optimization

        original = 'print("hello")'
        optimized = 'print("goodbye")'

        result = validate_optimization(original, optimized)
        assert result.outputs_match is False
        assert result.status == ValidationStatus.REJECTED

    def test_validator_handles_broken_code(self):
        from agents.validator import validate_optimization

        original = 'print("works")'
        optimized = 'this is not valid python!!!'

        result = validate_optimization(original, optimized)
        assert result.status == ValidationStatus.REJECTED
