# 🤖 Autonomous AI Code Performance & Debugging Analyst

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai&logoColor=white)

> Copilot and ChatGPT _suggest_ code changes. They never _run_ them.
> This system optimizes your Python — then **proves** the optimization is real by
> executing the original and the rewrite in a locked-down sandbox and comparing
> timing and output, byte for byte.

A multi-agent AI pipeline that analyzes Python for bugs and performance problems,
rewrites it with an LLM, and **validates** the result through sandboxed execution —
closing the "suggest but never verify" gap left by conventional AI coding assistants.

Built as the Software Engineering capstone (WEX 428) at **OSTİM Technical University**, May 2026.

---

## 🎯 Key Results

On a 150-line, 6-function benchmark where every function was accidentally O(n²):

| Metric          | Result                                             |
| --------------- | -------------------------------------------------- |
| **Speedup**     | **77.1% faster** (measured, sandbox-averaged)      |
| **Correctness** | **Byte-identical output** to the original          |
| **Complexity**  | All 6 functions rewritten to **O(n) / O(n log n)** |
| **Verdict**     | `APPROVED` — improvement proven, not assumed       |

**Every optimization is guaranteed, not guessed.** The validator runs the original and
the optimized code **3× each** in the sandbox, averages the timing, and requires a **≥5%
speedup with matching output** before it will report `APPROVED`. Anything slower than
−5%, or with mismatched output, is `REJECTED`.

---

## ⚙️ How It Works — The 6-Stage Pipeline

A single request streams live through six specialized agents plus a central
orchestrator. Stage results are pushed to the UI over Server-Sent Events as they
complete, so you watch the analysis happen in real time.

```mermaid
flowchart TD
    A[Python source code] --> ORCH[Central Orchestrator]

    ORCH --> S1[1 · Architect Agent<br/>AST analysis, complexity, function map]
    S1 --> S2[2 · Security Scanner<br/>vulnerability + risk scan]
    S2 --> RAG[(ChromaDB RAG<br/>recall similar past fixes)]
    RAG --> S3[3 · Bug Detector<br/>LLM bug + code-smell report]
    S3 --> S4[4 · Performance Analyzer<br/>sandbox execution + timing + memory]
    S4 --> S5[5 · Optimizer<br/>LLM rewrite w/ bug + perf + security context]
    S5 --> S6[6 · Validator<br/>run original vs optimized 3x each]

    S6 -->|"≥5% faster &amp; output matches"| OK[✅ APPROVED]
    S6 -->|"slower or output differs"| NO[❌ REJECTED]

    subgraph SANDBOX [🔒 Docker sandbox · no network · 0.5 CPU · 128 MB]
        S4
        S6
    end

    OK --> OUT[Final Report<br/>Code DNA radar + Resource Timeline]
    NO --> OUT

    ORCH -.->|Server-Sent Events, live| UI[React Dashboard]
    S1 -.-> UI
    S6 -.-> UI
```

![Live pipeline](docs/images/2-live-pipeline.png)
_Live 6-stage pipeline streaming results via SSE — Optimizer running, 4 stages complete_

**Signature outputs**

- **Code DNA Fingerprint** — a 6-axis radar (complexity, security, performance,
  readability, bug density, optimization) comparing original vs optimized at a glance.
- **Resource Timeline** — CPU and RSS memory sampled every 100 ms during execution.
- **RAG memory** — a ChromaDB engine that learns from past optimizations and surfaces
  similar prior fixes as context for the Optimizer.

---

## 📸 Screenshots

![Landing page](docs/images/1-home.png)
_Landing page_

![Insights report](docs/images/3-insights.png)
_Insights report: APPROVED verdict, Code DNA Fingerprint (baseline vs optimized), Resource Timeline_

![Code health trend](docs/images/4-history.png)
_Code health trend across analysis sessions_

---

## 🧱 Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Backend         | Python · FastAPI · Uvicorn             |
| AI / LLM        | OpenAI `gpt-4o-mini`                   |
| Data contracts  | Pydantic schemas (typed, end to end)   |
| Knowledge / RAG | ChromaDB                               |
| Sandbox         | Docker (no network · 0.5 CPU · 128 MB) |
| Streaming       | Server-Sent Events (SSE)               |
| Frontend        | React · Vite                           |
| Auth & storage  | Supabase                               |

---

## 🚀 Quick Start

**Prerequisites:** Python 3.11+, Node 18+, Docker.

### 1. Backend

```bash
# from the repo root
cp .env.example .env          # then fill in the keys below

# .env:
#   OPENAI_API_KEY=sk-...
#   SUPABASE_URL=https://<project>.supabase.co
#   SUPABASE_ANON_KEY=<anon-key>

docker build -t code-sandbox .          # required — validation runs code in this image
pip install -r requirements.txt
python main.py                          # API on http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                             # open http://localhost:5173
```

---

## 👥 Team & Credits

- **Asaad Suliman Idris** — System Architect: orchestrator, validator, Pydantic schemas, system integration
- **Ibrahim Abdu Sutota** — AI & Knowledge Engineer: Bug Detector, Optimizer agents, prompt engineering, RAG pipeline
- **Omar Abdulkadir Nur Hassan** — Performance Engineer: Docker sandbox, code executor, performance measurement, AST analysis
- **Abdulkadir Khalif Hassan Wasuge** — Frontend & Integration Engineer: React UI, Supabase auth, FastAPI integration

**Advisor:** Prof. Dr. Yücel Tekin — OSTİM Technical University
Software Engineering Capstone (WEX 428), May 2026

---

## ⚠️ Limitations & Future Work

**Known limitations**

- **Non-deterministic code** (functions using `random`, wall-clock time, etc.) can
  trigger false `REJECTED` verdicts, because the validator compares outputs across runs
  and those outputs legitimately differ each time.

**Future work**

- Support for more languages beyond Python
- Cloud deployment
- A VS Code extension for in-editor analysis
