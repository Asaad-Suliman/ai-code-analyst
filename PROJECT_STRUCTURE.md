# AI Code Analyst — Project Structure

```
ai-code-analyst/
│
├── agents/                    # All 4 AI agents
│   ├── __init__.py
│   ├── bug_detector.py        # [Ibro] Finds bugs via Gemini
│   ├── performance_analyzer.py # [Omer] Runs code + measures metrics
│   ├── optimizer.py           # [Ibro] Rewrites code via Gemini
│   └── validator.py           # [Asaad] Compares before/after
│
├── core/                      # Shared utilities
│   ├── __init__.py
│   ├── config.py              # [Asaad] Environment variables, settings
│   ├── schemas.py             # [Asaad] Data contracts (JSON models)
│   ├── code_executor.py       # [Omer] Sandbox execution engine
│   ├── metrics.py             # [Omer] Timing, memory, complexity
│   └── prompts.py             # [Ibro] All Gemini prompt templates
│
├── rag/                       # RAG pipeline (optional, Sprint 3+)
│   ├── __init__.py
│   └── retriever.py           # [Ibro] ChromaDB retrieval
│
├── web/                       # Frontend + API
│   ├── __init__.py
│   ├── app.py                 # [Abdulkadir] FastAPI routes
│   └── streamlit_app.py       # [Abdulkadir] Streamlit UI
│
├── tests/                     # Test files
│   ├── __init__.py
│   ├── test_agents.py         # Agent unit tests
│   ├── test_executor.py       # Sandbox tests
│   └── test_pipeline.py       # Integration tests
│
├── datasets/                  # Bug patterns, sample code
│   └── sample_code/           # Test inputs for demo
│
├── docs/                      # Diagrams, report drafts
│
├── orchestrator.py            # [Asaad] Main pipeline controller
├── requirements.txt           # Dependencies
├── .env.example               # Template for environment variables
├── .gitignore
├── Dockerfile                 # [Omer] Sandbox container
└── README.md
```

## Owner Map
| Member      | Files                                              |
|-------------|---------------------------------------------------|
| Asaad       | orchestrator.py, validator.py, schemas.py, config.py |
| Ibro        | bug_detector.py, optimizer.py, prompts.py, retriever.py |
| Omer        | performance_analyzer.py, code_executor.py, metrics.py, Dockerfile |
| Abdulkadir  | app.py, streamlit_app.py, all web/ files           |
