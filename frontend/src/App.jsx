import { useState } from "react"

const STAGES = [
  { key: "bugs", label: "Detecting bugs..." },
  { key: "performance", label: "Analyzing performance..." },
  { key: "optimizing", label: "Generating optimized code..." },
  { key: "validating", label: "Validating results..." },
]

function App() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stageIndex, setStageIndex] = useState(-1)
  const [error, setError] = useState(null)

  const runStages = () => {
    return new Promise((resolve) => {
      let i = 0
      setStageIndex(0)
      const interval = setInterval(() => {
        i++
        if (i < STAGES.length) {
          setStageIndex(i)
        } else {
          clearInterval(interval)
          resolve()
        }
      }, 900)
    })
  }

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please paste some code before clicking Analyze.")
      return
    }
    setLoading(true)
    setResult(null)
    setError(null)
    setStageIndex(0)
    try {
      const [response] = await Promise.all([
        fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source_code: code, language: "python" })
        }),
        runStages()
      ])
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Server error: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to the server. Make sure FastAPI is running on port 8000.")
      } else {
        setError("Something went wrong: " + err.message)
      }
    }
    setLoading(false)
    setStageIndex(-1)
  }

  const severityColor = (s) => s === "critical" ? "#ef4444" : s === "warning" ? "#f59e0b" : "#4ade80"

  return (
    <div style={{ background: "#080810", minHeight: "100vh", color: "#e2e2f0", fontFamily: "Inter, Segoe UI, sans-serif", padding: "0" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 28px" }}>

        {/* NAVBAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🔍</div>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>AI Code Analyst</span>
          </div>
          <div style={{ fontSize: "11px", background: "#1a1a2e", border: "1px solid #2a2a4a", color: "#818cf8", padding: "3px 12px", borderRadius: "20px" }}>● Sprint 3</div>
        </div>

        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#0f0f1e", border: "1px solid #2a2a4a", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", color: "#818cf8", marginBottom: "18px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8" }}></div>
            Powered by Gemini AI
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#fff", lineHeight: "1.2", letterSpacing: "-1px", marginBottom: "12px" }}>
            Your code,<br />
            <span style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              perfected by AI
            </span>
          </div>
          <div style={{ fontSize: "15px", color: "#6b6b8a", maxWidth: "400px", margin: "0 auto" }}>
            Paste any Python code and get instant bug detection, performance analysis, and optimized output.
          </div>
        </div>

        {/* CODE EDITOR */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: "16px", overflow: "hidden", marginBottom: "14px" }}>
          <div style={{ background: "#111120", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1e1e35" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80" }}></div>
            <div style={{ marginLeft: "8px", fontSize: "12px", color: "#4a4a7a", background: "#0d0d1a", border: "1px solid #1e1e35", padding: "3px 12px", borderRadius: "6px" }}>main.py</div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="# Paste your Python code here..."
            style={{ width: "100%", minHeight: "160px", background: "transparent", border: "none", outline: "none", padding: "20px", fontSize: "14px", fontFamily: "Courier New, monospace", color: "#a0a0c0", lineHeight: "1.8", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: "100%", padding: "15px", background: loading ? "#2a2a4a" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: loading ? "#6b6b8a" : "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginBottom: "32px" }}
        >
          {loading ? "Analyzing..." : "⚡ Analyze Code"}
        </button>

        {/* ERROR */}
        {error && (
          <div style={{ background: "#1a0808", border: "1px solid #3a1010", borderRadius: "12px", padding: "16px", color: "#f87171", marginBottom: "24px", fontSize: "14px" }}>
            ❌ {error}
          </div>
        )}

        {/* LOADING STAGES */}
        {loading && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px" }}>Analysis Progress</div>
            {STAGES.map((stage, i) => (
              <div key={stage.key} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "13px 16px", borderRadius: "12px", fontSize: "14px", marginBottom: "8px",
                background: i < stageIndex ? "#0a1f14" : i === stageIndex ? "#111130" : "#0d0d1a",
                border: `1px solid ${i < stageIndex ? "#153d25" : i === stageIndex ? "#6366f1" : "#1a1a2e"}`,
                color: i < stageIndex ? "#4ade80" : i === stageIndex ? "#c7d2fe" : "#2e2e4a"
              }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", background: i < stageIndex ? "#153d25" : i === stageIndex ? "#1e1e4a" : "#1a1a2e", color: i < stageIndex ? "#4ade80" : i === stageIndex ? "#818cf8" : "#2e2e4a" }}>
                  {i < stageIndex ? "✓" : i === stageIndex ? "⏳" : "·"}
                </div>
                {stage.label}
              </div>
            ))}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div>
            {/* BUGS */}
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px" }}>Bug Report</div>
            {result.bug_report?.bugs?.length === 0 && <div style={{ color: "#4ade80", marginBottom: "32px", fontSize: "14px" }}>No bugs found!</div>}
            {result.bug_report?.bugs?.map((bug, i) => (
              <div key={i} style={{ background: "#0d0d1a", borderRadius: "12px", padding: "16px 18px", marginBottom: "10px", borderLeft: `3px solid ${severityColor(bug.severity)}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", padding: "3px 9px", borderRadius: "20px", background: bug.severity === "critical" ? "#2a0a0a" : "#2a1a00", color: severityColor(bug.severity), border: `1px solid ${bug.severity === "critical" ? "#3a1010" : "#3a2800"}` }}>
                    {bug.severity?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "12px", color: "#4a4a6a" }}>Line {bug.line_number}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#b0b0cc", marginBottom: "5px" }}>{bug.description}</div>
                <div style={{ fontSize: "12px", color: "#5a5a8a" }}>💡 {bug.suggestion}</div>
              </div>
            ))}

            {/* PERFORMANCE */}
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", margin: "32px 0 14px" }}>Performance Metrics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "32px" }}>
              {[
                { label: "Runtime", value: result.performance_report?.execution_time_ms, unit: "ms" },
                { label: "Memory", value: result.performance_report?.memory_usage_mb, unit: "MB" },
                { label: "Complexity", value: result.performance_report?.time_complexity, unit: "time" },
              ].map((m, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: "14px", padding: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>{m.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#818cf8" }}>{m.value}</div>
                  <div style={{ fontSize: "12px", color: "#4a4a6a", marginTop: "2px" }}>{m.unit}</div>
                </div>
              ))}
            </div>

            {/* CODE COMPARISON */}
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px" }}>Code Comparison</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "32px" }}>
              <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "11px 16px", fontSize: "12px", fontWeight: "600", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: "7px", color: "#f87171", background: "#120a0a" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }}></div>Original
                </div>
                <pre style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "12px", color: "#7070a0", lineHeight: "1.7", overflowX: "auto", margin: "0" }}>{result.source_code}</pre>
              </div>
              <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "11px 16px", fontSize: "12px", fontWeight: "600", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: "7px", color: "#4ade80", background: "#080f0a" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }}></div>Optimized
                </div>
                <pre style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "12px", color: "#7070a0", lineHeight: "1.7", overflowX: "auto", margin: "0" }}>{result.optimized_code}</pre>
              </div>
            </div>

            {/* VALIDATION */}
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px" }}>Validation</div>
            <div style={{ borderRadius: "14px", padding: "20px 22px", display: "flex", alignItems: "center", gap: "16px", background: result.validation?.status === "approved" ? "#080f0a" : "#0f0808", border: `1px solid ${result.validation?.status === "approved" ? "#153d25" : "#3a1010"}` }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: result.validation?.status === "approved" ? "#0a2014" : "#200808", border: `1px solid ${result.validation?.status === "approved" ? "#1a4a2a" : "#4a1a1a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: "0" }}>
                {result.validation?.status === "approved" ? "✅" : "❌"}
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", color: result.validation?.status === "approved" ? "#4ade80" : "#f87171", marginBottom: "4px" }}>
                  {result.validation?.status?.toUpperCase()}
                </div>
                <div style={{ fontSize: "13px", color: "#6b6b8a" }}>{result.validation?.summary}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default App