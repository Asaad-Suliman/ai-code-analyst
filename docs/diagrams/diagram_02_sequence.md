# Diagram 2 — Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant API as FastAPI
    participant Orch as Orchestrator
    participant Bug as Bug Detector
    participant Perf as Performance Analyzer
    participant Opt as Optimizer
    participant Val as Validator
    participant Gemini as Gemini API (OpenRouter)

    User->>Frontend: Paste Python code & submit
    Frontend->>API: POST /analyze { source_code }
    API->>Orch: run(source_code)

    Orch->>Bug: detect_bugs(user_input)
    Bug->>Gemini: Chat completion (bug analysis prompt)
    Gemini-->>Bug: JSON bug report
    Bug-->>Orch: BugReport

    Orch->>Perf: analyze_performance(user_input)
    Perf-->>Orch: PerformanceReport (execution time, complexity)

    Orch->>Opt: optimize_code(user_input, bug_report, perf_report)
    Opt->>Gemini: Chat completion (optimization prompt)
    Gemini-->>Opt: Optimized code
    Opt-->>Orch: OptimizationResult

    Orch->>Val: validate_optimization(original, optimized)
    Val-->>Orch: ValidationResult (status, speedup, outputs_match)

    Orch-->>API: FinalReport (JSON)
    API-->>Frontend: FinalReport (JSON)
    Frontend-->>User: Display bug report, performance metrics, optimized code, speedup
```
