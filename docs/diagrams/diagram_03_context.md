# Diagram 3 — Context Diagram

```mermaid
graph TD
    User["👤 User\n(Developer)"]
    OpenRouter["🤖 OpenRouter API\n(gpt-6-luna)"]
    Docker["🐳 Docker Sandbox\n(code execution)"]

    subgraph System["AI Code Analyst"]
        Frontend["React Frontend"]
        API["FastAPI Backend"]
        Orch["Orchestrator"]
        Bug["Bug Detector"]
        Perf["Performance Analyzer"]
        Opt["Optimizer"]
        Val["Validator"]
    end

    User -- "Python source code" --> Frontend
    Frontend -- "HTTP POST /analyze" --> API
    API -- "source_code string" --> Orch

    Orch --> Bug
    Orch --> Perf
    Orch --> Opt
    Orch --> Val

    Bug -- "bug analysis prompt" --> OpenRouter
    OpenRouter -- "structured JSON bugs" --> Bug

    Opt -- "optimization prompt" --> OpenRouter
    OpenRouter -- "optimized code" --> Opt

    Val -- "execute original + optimized code" --> Docker
    Docker -- "stdout, timing, exit code" --> Val

    Orch -- "FinalReport JSON" --> API
    API -- "JSON response" --> Frontend
    Frontend -- "Analysis results + optimized code" --> User
```

**System Boundary:** AI Code Analyst — encompasses all backend services, agents, and the React frontend.

**External Entities:**

- **User** — submits Python code, receives structured analysis report.
- **OpenRouter API (gpt-6-luna)** — called by Bug Detector and Optimizer for AI-powered analysis and code generation.
- **Docker Sandbox** — isolated execution environment used by the Validator to safely run user-submitted and optimized code.
