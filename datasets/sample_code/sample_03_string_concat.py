# Sample 3: String concatenation in a loop — O(n^2) memory copies
# Expected: Optimizer should replace with ''.join() or list approach

def build_report(n):
    report = ""
    for i in range(n):
        report = report + f"Line {i}: This is entry number {i} in the report.\n"
    return report

result = build_report(50000)
print(f"Report length: {len(result)} characters")
print(result[:200])
