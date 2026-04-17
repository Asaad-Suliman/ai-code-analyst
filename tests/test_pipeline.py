"""
Pipeline Integration Test
==========================
Tests the full orchestrator pipeline end-to-end.
Run with: python -m pytest tests/test_pipeline.py -v
"""

import pytest
from orchestrator import Orchestrator
from core.schemas import FinalReport, ValidationStatus
from core.code_executor import execute_code


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


# SECURITY TESTS (Sprint 3 - Omer)

def test_block_os_system():
    """Malicious code trying to run system commands must be blocked."""
    result = execute_code("import os; os.system('echo hacked')")
    assert result.exit_code != 0 or "hacked" not in result.stdout
    print("PASS - os.system blocked")

def test_block_file_write():
    """Malicious code trying to write files must be blocked."""
    result = execute_code("open('/etc/passwd', 'w').write('hacked')")
    assert result.exit_code != 0
    print("PASS - file write blocked")

def test_block_network():
    """Malicious code trying to access network must be blocked."""
    result = execute_code("import urllib.request; urllib.request.urlopen('http://google.com')")
    assert result.exit_code != 0
    print("PASS - network blocked")

def test_timeout():
    """Infinite loop must be killed by timeout."""
    result = execute_code("while True: pass")
    assert result.timed_out or result.exit_code != 0
    print("PASS - infinite loop killed")

def test_memory_limit():
    """Code trying to use too much memory must be killed."""
    result = execute_code("x = ' ' * (200 * 1024 * 1024)")
    assert result.exit_code != 0 or result.timed_out
    print("PASS - memory limit enforced")


if __name__ == "__main__":
    test_block_os_system()
    test_block_file_write()
    test_block_network()
    test_timeout()
    test_memory_limit()
    print("\nAll security tests passed!")