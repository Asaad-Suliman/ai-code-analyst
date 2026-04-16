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
  const severityBg = (s) => s === "critical" ? "#2a0a0a" : s === "warning" ? "#2a1a00" : "#0a2014"
  const severityBorder = (s) => s === "critical" ? "#3a1010" : s === "warning" ? "#3a2800" : "#153d25"

  const styles = {
    app: { background: "#080810", minHeight: "100vh", padding: "36px 28px", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#e2e2f0", maxWidth: "860px", margin: "0 auto" },
    navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" },
    navLogo: { display: "flex", alignItems: "center", gap: "10px" },
    navIcon: { width: "32px", height: "32px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" },
    navTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", letterSpacing: "-0.3px" },
    navBadge: { fontSize: "11px", background: "#1a1a2e", border: "1px solid #2a2a4a", color: "#818cf8", padding: "3px 10px", borderRadius: "20px" },
    hero: { textAlign: "center", marginBottom: "40px" },
    heroTag: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#0f0f1e", border: "1px solid #2a2a4a", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", color: "#818cf8", marginBottom: "18px" },
    heroTagDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8" },
    heroTitle: { fontSize: "36px", fontWeight: "700", color: "#fff", lineHeight: "1.15", letterSpacing: "-1px", marginBottom: "12px" },
    heroSub: { fontSize: "15px", color: "#6b6b8a", maxWidth: "420px", margin: "0 auto 28px" },
    editorWrap: { background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: "16px", overflow: "hidden", marginBottom: "14px" },
    editorBar: { background: "#111120", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1e1e35" },
    fileTab: { marginLeft: "10px", fontSize: "12px", color: "#4a4a7a", background: "#0d0d1a", border: "1px solid #1e1e35", padding: "3px 12px", borderRadius: "6px" },
    textarea: { width: "100%", minHeight: "160px", background: "transparent", border: "none", outline: "none", padding: "20px", fontSize: "14px", fontFamily: "'Courier New', monospace", color: "#a0a0c0", lineHeight: "1.8", resize: "vertical", boxSizing: "border-box" },
    btn: { width: "100%", padding: "15px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "40px", letterSpacing: "0.2px" },
    btnDisabled: { width: "100%", padding: "15px", background: "#2a2a4a", color: "#6b6b8a", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "not-allowed", marginBottom: "40px" },
    sectionLabel: { fontSize: "11px", fontWeight: "600", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px" },
    stagesDone: { display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", background: "#0a1f14", border: "1px solid #153d25", color: "#4ade80", marginBottom: "8px" },
    stagesActive: { display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", background: "#111130", border: "1px solid #6366f1", color: "#c7d2fe", marginBottom: "8px" },
    stagesWait: { display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", background: "#0d0d1a", border: "1px solid #1a1a2e", color: "#2e2e4a", marginBottom: "8px" },
    stageIcon: { width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: "0" },
    errorBox: { background: "#1a0808", border: "1px solid #3a1010", borderRadius: "12px", padding: "16px", color: "#f87171", marginBottom: "24px", fontSize: "14px" },
    perfGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "40px" },
    perfCard: { background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: "14px", padding: "18px", textAlign: "center" },
    perfLabel: { fontSize: "11px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" },
    perfVal: { fontSize: "26px", fontWeight: "700", background: "linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    perfUnit: { fontSize: "12px", color: "#4a4a6a", marginTop: "2px" },
    codeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "40px" },
    codePanel: (type) => ({ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: "14px", overflow: "hidden" }),
    codeHead: (type) => ({ padding: "11px 16px", fontSize: "12px", fontWeight: "600", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: "7px", color: type === "orig" ? "#f87171" : "#4ade80", background: type === "orig" ? "#120a0a" : "#080f0a" }),
    codeDot: (type) => ({ width: "7px", height: "7px", borderRadius: "50%", background: type === "orig" ? "#ef4444" : "#4ade80" }),
    codeBody: { padding: "14px 16px", fontFamily: "monospace", fontSize: "12px", color: "#7070a0", lineHeight: "1.7", overflowX: "auto" },
    valBox: (status) => ({ borderRadius: "14px", padding: "20px 22px", display: "flex", alignItems: "center", gap: "16px", background: status === "approved" ? "#080f0a" : "#0f0808", border: `1px solid ${status === "approved" ? "#153d25" : "#3a1010"}` }),
    valIcon: (status) => ({ width: "42px", height: "42px", borderRadius: "50%", background: status === "approved" ? "#0a2014" : "#200808", border: `1px solid ${status === "approved" ? "#1a4a2a" : "#4a1a1a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: "0" }),
    valBadge: (status) => ({ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", color: status === "approved" ? "#4ade80" : "#f87171", marginBottom: "4px" }),
    valText: { fontSize: "13px", color: "#6b6b8a" },
  }

  const getStageStyle = (i) => {
    if (i < stageIndex) return styles.stagesDone
    if (i === stageIndex) return styles.stagesActive
    return styles.stagesWait
  }

  const getStageIcon = (i) => {
    if (i < stageIndex) return { ...styles.stageIcon, background: "#153d25", color: "#4ade80" }
    if (i === stageIndex) return { ...styles.stageIcon, background: "#1e1e4a", color: "#818cf8" }
    return { ...styles.stageIcon, background: "#1a1a2e", color: "#2e2e4a" }
  }

  return (
    <div style={styles.app}>

      <div style={styles.navbar}>
        <div style={styles.navLogo}>
          <div style={styles.navIcon}>🔍</div>
          <span style={styles.navTitle}>AI Code Analyst</span>
        </div>
        <div style={styles.navBadge}>● Sprint 3</div>
      </div>

      <div style={styles.hero}>
        <div style={styles.heroTag}>
          <div style={styles.heroTagDot}></div>
          Powered by Gemini AI
        </div>
        <div style={styles.heroTitle}>
          Your code,<br />
          <span style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            perfected by AI
          </span>
        </div>
        <div style={styles.heroSub}>
          Paste any Python code and get instant bug detection, performance analysis, and optimized output.
        </div>
      </div>

      <div style={styles.editorWrap}>
        <div style={styles.editorBar}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80" }}></div>
          <div style={styles.fileTab}>main.py</div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="# Paste your Python code here..."
          style={styles.textarea}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={loading ? styles.btnDisabled : styles.btn}
      >
        {loading ? "Analyzing..." : "⚡ Analyze Code"}
      </button>

      {error && (
        <div style={styles.errorBox}>❌ {error}</div>
      )}

      {loading && (
        <div style={{ marginBottom: "40px" }}>
          <div style={styles.sectionLabel}>Analysis Progress</div>
          {STAGES.map((stage, i) => (
            <div key={stage.key} style={getStageStyle(i)}>
              <div style={getStageIcon(i)}>
                {i < stageIndex ? "✓" : i === stageIndex ? "⏳" : "·"}
              </div>
              {stage.label}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div>
          <div style={styles.sectionLabel}>Bug Report</div>
          {result.bug_report?.bugs?.length === 0 && (
            <div style={{ color: "#4ade80", marginBottom: "40px", fontSize: "14px" }}>No bugs found!</div>
          )}
          {result.bug_report?.bugs?.map((bug, i) => (
            <div key={i} style={{ background: "#0d0d1a", borderRadius: "12px", padding: "16px 18px", marginBottom: "10px", borderLeft: `3px solid ${severityColor(bug.severity)}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", padding: "3px 9px", borderRadius: "20px", background: severityBg(bug.severity), color: severityColor(bug.severity), border: `1px solid ${severityBorder(bug.severity)}` }}>
                  {bug.severity?.toUpperCase()}
                </span>
                <span style={{ fontSize: "12px", color: "#4a4a6a" }}>Line {bug.line_number}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#b0b0cc", marginBottom: "5px" }}>{bug.description}</div>
              <div style={{ fontSize: "12px", color: "#5a5a8a" }}>💡 {bug.suggestion}</div>
            </div>
          ))}

          <div style={styles.sectionLabel}>Performance Metrics</div>
          <div style={styles.perfGrid}>
            <div style={styles.perfCard}>
              <div style={styles.perfLabel}>Runtime</div>
              <div style={styles.perfVal}>{result.performance_report?.execution_time_ms}</div>
              <div style={styles.perfUnit}>milliseconds</div>
            </div>
            <div style={styles.perfCard}>
              <div style={styles.perfLabel}>Memory</div>
              <div style={styles.perfVal}>{result.performance_report?.memory_usage_mb}</div>
              <div style={styles.perfUnit}>megabytes</div>
            </div>
            <div style={styles.perfCard}>
              <div style={styles.perfLabel}>Complexity</div>
              <div style={{ ...styles.perfVal, fontSize: "18px", paddingTop: "4px" }}>{result.performance_report?.time_complexity}</div>
              <div style={styles.perfUnit}>time</div>
            </div>
          </div>

          <div style={styles.sectionLabel}>Code Comparison</div>
          <div style={styles.codeGrid}>
            <div style={styles.codePanel("orig")}>
              <div style={styles.codeHead("orig")}>
                <div style={styles.codeDot("orig")}></div>Original
              </div>
              <pre style={styles.codeBody}>{result.source_code}</pre>
            </div>
            <div style={styles.codePanel("opt")}>
              <div style={styles.codeHead("opt")}>
                <div style={styles.codeDot("opt")}></div>Optimized
              </div>
              <pre style={styles.codeBody}>{result.optimized_code}</pre>
            </div>
          </div>

          <div style={styles.sectionLabel}>Validation</div>
          <div style={styles.valBox(result.validation?.status)}>
            <div style={styles.valIcon(result.validation?.status)}>
              {result.validation?.status === "approved" ? "✅" : "❌"}
            </div>
            <div>
              <div style={styles.valBadge(result.validation?.status)}>
                {result.validation?.status?.toUpperCase()}
              </div>
              <div style={styles.valText}>{result.validation?.summary}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App