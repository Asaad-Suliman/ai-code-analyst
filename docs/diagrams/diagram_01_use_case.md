# Diagram 1 — Use Case Diagram

```mermaid
%%{init: {'theme': 'default'}}%%
graph TD
    actor["👤 Developer"]

    actor --> UC1["Submit Code"]
    actor --> UC2["View Bug Report"]
    actor --> UC3["View Performance Report"]
    actor --> UC4["View Optimized Code"]
    actor --> UC5["Compare Before / After"]

    subgraph System["AI Code Analyst System"]
        UC1
        UC2
        UC3
        UC4
        UC5
    end

    UC1 --> UC2
    UC1 --> UC3
    UC1 --> UC4
    UC4 --> UC5
```

**Actors:**

- **Developer** — the primary user who submits Python code and consumes reports.

**Use Cases:**

- **Submit Code** — user pastes Python code into the web interface and triggers the pipeline.
- **View Bug Report** — user reads detected bugs, severity levels, and fix suggestions.
- **View Performance Report** — user reads execution time, complexity, and memory usage.
- **View Optimized Code** — user sees the AI-generated optimized version of their code.
- **Compare Before / After** — user views side-by-side diff of original vs. optimized code with speedup metrics.
