import { useState } from "react"

function App() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code, language: "python" })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      alert("Error connecting to server: " + error.message)
    }
    setLoading(false)
  }

  const severityColor = (severity) => {
    if (severity === "critical") return "#ff4444"
    if (severity === "warning") return "#ff9900"
    return "#4CAF50"
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      
      <h1 style={{ color: "#4F46E5" }}>🔍 AI Code Analyst</h1>
      <p>Paste your Python code below and click Analyze</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your Python code here..."
        style={{
          width: "100%",
          height: "200px",
          padding: "12px",
          fontSize: "14px",
          fontFamily: "monospace",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          marginTop: "12px",
          padding: "10px 24px",
          fontSize: "16px",
          backgroundColor: loading ? "#999" : "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "32px" }}>

          {/* BUG REPORT */}
          <h2>🐛 Bug Report</h2>
          {result.bug_report?.bugs?.map((bug, i) => (
            <div key={i} style={{
              border: `2px solid ${severityColor(bug.severity)}`,
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              backgroundColor: "#1e1e1e",
              color: "#fff"
            }}>
              <div style={{ color: severityColor(bug.severity), fontWeight: "bold" }}>
                {bug.severity?.toUpperCase()} — Line {bug.line_number}
              </div>
              <div style={{ marginTop: "4px" }}>{bug.description}</div>
              <div style={{ marginTop: "4px", color: "#aaa" }}>💡 {bug.suggestion}</div>
            </div>
          ))}

          {/* PERFORMANCE */}
          <h2>⚡ Performance</h2>
          <div style={{
            background: "#1e1e1e",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap"
          }}>
            <div><strong>Runtime:</strong> {result.performance_report?.execution_time_ms}ms</div>
            <div><strong>Memory:</strong> {result.performance_report?.memory_usage_mb}MB</div>
            <div><strong>Complexity:</strong> {result.performance_report?.time_complexity}</div>
          </div>

          {/* CODE COMPARISON */}
          <h2>🔧 Code Comparison</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <h4 style={{ color: "#ff4444" }}>Original Code</h4>
              <pre style={{
                background: "#1e1e1e",
                color: "#d4d4d4",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "12px"
              }}>{result.source_code}</pre>
            </div>
            <div>
              <h4 style={{ color: "#4CAF50" }}>Optimized Code</h4>
              <pre style={{
                background: "#1e1e1e",
                color: "#d4d4d4",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "12px"
              }}>{result.optimized_code}</pre>
            </div>
          </div>

          {/* VALIDATION */}
          <h2>✅ Validation</h2>
          <div style={{
            background: result.validation?.status === "approved" ? "#1a3a1a" : "#3a1a1a",
            border: `2px solid ${result.validation?.status === "approved" ? "#4CAF50" : "#ff4444"}`,
            borderRadius: "8px",
            padding: "16px",
            color: "#fff"
          }}>
            <div style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: result.validation?.status === "approved" ? "#4CAF50" : "#ff4444"
            }}>
              {result.validation?.status?.toUpperCase()}
            </div>
            <div style={{ marginTop: "8px" }}>{result.validation?.summary}</div>
          </div>

        </div>
      )}
    </div>
  )
}

export default App