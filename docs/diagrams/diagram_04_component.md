# Diagram 4 — Component Diagram

```mermaid
graph TD
    subgraph API Layer
        App["api/app.py\n(FastAPI routes)"]
    end

    subgraph Orchestration
        Orch["orchestrator.py\n(pipeline controller)"]
    end

    subgraph Agents
        Bug["agents/bug_detector.py"]
        Perf["agents/performance_analyzer.py"]
        Opt["agents/optimizer.py"]
        Val["agents/validator.py"]
    end

    subgraph Core
        Schemas["core/schemas.py\n(shared Pydantic models)"]
        Executor["core/code_executor.py\n(subprocess sandbox)"]
        Prompts["core/prompts.py\n(LLM prompt templates)"]
        Config["core/config.py\n(API keys, timeouts)"]
        Metrics["core/metrics.py\n(performance helpers)"]
    end

    App --> Orch

    Orch --> Bug
    Orch --> Perf
    Orch --> Opt
    Orch --> Val
    Orch --> Schemas

    Bug --> Schemas
    Bug --> Prompts
    Bug --> Config

    Perf --> Schemas
    Perf --> Executor
    Perf --> Metrics

    Opt --> Schemas
    Opt --> Prompts
    Opt --> Config

    Val --> Schemas
    Val --> Executor
    Val --> Config
```

**Module Relationships:**

- `api/app.py` — FastAPI entry point; receives HTTP requests and delegates to the Orchestrator.
- `orchestrator.py` — coordinates all 4 agents in sequence; constructs the `FinalReport`.
- `agents/` — each agent has a single responsibility and communicates exclusively via Pydantic models from `core/schemas.py`.
- `core/schemas.py` — shared data contracts; defines `UserInput`, `BugReport`, `PerformanceReport`, `OptimizationResult`, `ValidationResult`, and `FinalReport`.
- `core/code_executor.py` — used by `validator.py` (and `performance_analyzer.py`) to safely run Python code in a subprocess with timing and memory tracking.
- `core/prompts.py` — LLM prompt templates used by `bug_detector.py` and `optimizer.py`.
- `core/config.py` — centralizes API keys, sandbox timeout, and memory limits.
