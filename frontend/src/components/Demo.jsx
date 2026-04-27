import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Python syntax tokenizer
const KW = new Set([
  "def",
  "class",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "in",
  "return",
  "import",
  "from",
  "as",
  "with",
  "try",
  "except",
  "raise",
  "pass",
  "break",
  "continue",
  "and",
  "or",
  "not",
  "is",
  "lambda",
  "True",
  "False",
  "None",
  "global",
  "nonlocal",
  "del",
  "assert",
]);
const BI = new Set([
  "range",
  "len",
  "set",
  "list",
  "dict",
  "tuple",
  "str",
  "int",
  "float",
  "bool",
  "print",
  "append",
  "add",
  "remove",
  "pop",
  "sorted",
  "reversed",
  "enumerate",
  "zip",
  "map",
  "filter",
  "any",
  "all",
  "min",
  "max",
  "sum",
  "abs",
  "type",
]);

function tokenizeLine(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === "#") {
      tokens.push({ t: "comment", v: line.slice(i) });
      break;
    }
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) {
        if (line[j] === "\\") j++;
        j++;
      }
      tokens.push({ t: "string", v: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/\d/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ t: "number", v: line.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const w = line.slice(i, j);
      let k = j;
      while (k < line.length && line[k] === " ") k++;
      const t = KW.has(w)
        ? "kw"
        : BI.has(w)
          ? "bi"
          : line[k] === "("
            ? "fn"
            : "id";
      tokens.push({ t, v: w });
      i = j;
      continue;
    }
    const c = line[i];
    tokens.push({ t: "()[]{},:".includes(c) ? "pu" : "op", v: c });
    i++;
  }
  return tokens;
}

const TC = {
  kw: "#c792ea",
  bi: "#82b1ff",
  fn: "#82aaff",
  string: "#c3e88d",
  number: "#f78c6c",
  comment: "#4b5563",
  pu: "#89ddff",
  op: "#89ddff",
  id: "#eeffff",
};

function PyCode({ code, style, scanning }) {
  return (
    <div
      style={{
        background: "#060d1a",
        border: "1px solid rgba(0,229,255,0.1)",
        borderRadius: "12px",
        padding: "22px 24px",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "13px",
        lineHeight: 1.8,
        overflowX: "auto",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Scanning line */}
      {scanning && (
        <motion.div
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #00e5ff, transparent)",
            boxShadow: "0 0 12px 2px rgba(0,229,255,0.45)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Scan glow overlay */}
      {scanning && (
        <motion.div
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(180deg, transparent, rgba(0,229,255,0.04), transparent)",
            zIndex: 4,
            pointerEvents: "none",
            transform: "translateY(-50%)",
          }}
        />
      )}
      {/* Glowing bracket corners */}
      {[
        { top: 6, left: 6, borderTop: true, borderLeft: true },
        { top: 6, right: 6, borderTop: true, borderRight: true },
        { bottom: 6, left: 6, borderBottom: true, borderLeft: true },
        { bottom: 6, right: 6, borderBottom: true, borderRight: true },
      ].map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...(corner.top !== undefined ? { top: corner.top } : {}),
            ...(corner.bottom !== undefined ? { bottom: corner.bottom } : {}),
            ...(corner.left !== undefined ? { left: corner.left } : {}),
            ...(corner.right !== undefined ? { right: corner.right } : {}),
            width: 10,
            height: 10,
            borderTop: corner.borderTop ? "2px solid #00e5ff" : "none",
            borderBottom: corner.borderBottom ? "2px solid #00e5ff" : "none",
            borderLeft: corner.borderLeft ? "2px solid #00e5ff" : "none",
            borderRight: corner.borderRight ? "2px solid #00e5ff" : "none",
            filter: "drop-shadow(0 0 4px #00e5ff)",
            zIndex: 6,
            pointerEvents: "none",
          }}
        />
      ))}

      {code.split("\n").map((line, li) => (
        <div
          key={li}
          style={{
            whiteSpace: "pre",
            minHeight: "1em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {tokenizeLine(line).map((tk, ti) => (
            <span key={ti} style={{ color: TC[tk.t] || "#eeffff" }}>
              {tk.v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Terminal pipeline animation
const STEPS = [
  {
    text: "$ ai-analyst run --file find_duplicates.py",
    color: "#94a3b8",
    delay: 0,
  },
  { text: "", delay: 350 },
  {
    text: "[1/4] Bug Detector  →  scanning source...",
    color: "#f59e0b",
    delay: 600,
  },
  {
    text: "  bug_score: 42/100   has_critical: false",
    color: "#6b7a99",
    delay: 1350,
  },
  {
    text: "  issues: ['nested_loop', 'o(n²)_membership_check']",
    color: "#6b7a99",
    delay: 1650,
  },
  { text: "", delay: 1900 },
  {
    text: "[2/4] Performance Analyzer  →  executing in Docker...",
    color: "#00e5ff",
    delay: 2100,
  },
  {
    text: "  runtime: 2,847ms   memory: 12.4 MB   complexity: O(n²)",
    color: "#6b7a99",
    delay: 3550,
  },
  { text: "", delay: 3750 },
  {
    text: "[3/4] Optimizer  →  generating optimized solution...",
    color: "#7c3aed",
    delay: 3950,
  },
  {
    text: "  strategy: hash-set deduplication   changes: 2 sections",
    color: "#6b7a99",
    delay: 5000,
  },
  { text: "", delay: 5200 },
  {
    text: "[4/4] Validator  →  3-pass side-by-side comparison...",
    color: "#10b981",
    delay: 5400,
  },
  {
    text: "  pass 1: 2847ms → 12ms   pass 2: 2851ms → 11ms   pass 3: 2843ms → 13ms",
    color: "#6b7a99",
    delay: 6900,
  },
  {
    text: "  outputs_match: true   avg_speedup: 237×",
    color: "#6b7a99",
    delay: 7250,
  },
  { text: "", delay: 7450 },
  {
    text: "──────────────────────────────────────────────────────",
    color: "#1e293b",
    delay: 7550,
  },
  {
    text: "✅ APPROVED  ·  237× faster  ·  O(n²) → O(n)  ·  outputs verified",
    color: "#10b981",
    delay: 7750,
  },
];

function PipelineTerminal({ lines, running }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div
      style={{
        background: "#020609",
        border: "1px solid rgba(0,229,255,0.14)",
        borderRadius: "12px",
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#0a1020",
          padding: "9px 16px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "11px",
            color: "#374151",
            marginLeft: "8px",
          }}
        >
          ai-analyst — terminal
        </span>
      </div>
      <div
        style={{
          padding: "18px 22px",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "12.5px",
          lineHeight: 1.8,
          minHeight: "220px",
          maxHeight: "340px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {lines.length === 0 && !running && (
          <div style={{ color: "#1e293b" }}>
            Press ▶ Run Pipeline to execute
          </div>
        )}
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            style={{
              color: line.color,
              whiteSpace: "pre",
              minHeight: line.text === "" ? "0.5em" : undefined,
            }}
          >
            {line.text}
          </motion.div>
        ))}
        {running && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "steps(1)" }}
            style={{ color: "#00e5ff", display: "inline-block" }}
          >
            █
          </motion.span>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

const ERROR_SCENARIOS = {
  syntax: {
    label: "SYNTAX ERROR",
    color: "#ef4444",
    lines: [
      {
        text: "$ ai-analyst run --file find_duplicates.py",
        color: "#94a3b8",
        delay: 0,
      },
      { text: "", delay: 300 },
      {
        text: "[1/4] Bug Detector  →  scanning source...",
        color: "#f59e0b",
        delay: 500,
      },
      {
        text: "  ❌ SyntaxError: unexpected indent on line 3",
        color: "#ef4444",
        delay: 1200,
      },
      {
        text: "  ❌ SyntaxError: missing colon after function definition",
        color: "#ef4444",
        delay: 1500,
      },
      {
        text: '  ❌ SyntaxError: invalid token "==" outside expression',
        color: "#ef4444",
        delay: 1800,
      },
      { text: "", delay: 2000 },
      {
        text: "✖ REJECTED  ·  3 syntax errors found  ·  cannot continue",
        color: "#ef4444",
        delay: 2200,
      },
    ],
  },
  timeout: {
    label: "TIMEOUT",
    color: "#f59e0b",
    lines: [
      {
        text: "$ ai-analyst run --file find_duplicates.py",
        color: "#94a3b8",
        delay: 0,
      },
      { text: "", delay: 300 },
      {
        text: "[1/4] Bug Detector  →  scanning source...",
        color: "#f59e0b",
        delay: 500,
      },
      {
        text: "  bug_score: 71/100   has_critical: true",
        color: "#6b7a99",
        delay: 1000,
      },
      { text: "", delay: 1200 },
      {
        text: "[2/4] Performance Analyzer  →  executing in Docker...",
        color: "#00e5ff",
        delay: 1400,
      },
      {
        text: "  ⚠ Execution time exceeded 30s limit",
        color: "#f59e0b",
        delay: 4200,
      },
      {
        text: "  ⚠ Possible infinite loop or unbounded recursion detected",
        color: "#f59e0b",
        delay: 4500,
      },
      { text: "", delay: 4700 },
      {
        text: "✖ TIMEOUT  ·  pipeline halted at step 2/4  ·  review your loop conditions",
        color: "#f59e0b",
        delay: 4900,
      },
    ],
  },
  noImprovement: {
    label: "NO IMPROVEMENT",
    color: "#7c3aed",
    lines: [
      {
        text: "$ ai-analyst run --file find_duplicates.py",
        color: "#94a3b8",
        delay: 0,
      },
      { text: "", delay: 300 },
      {
        text: "[1/4] Bug Detector  →  scanning source...",
        color: "#f59e0b",
        delay: 500,
      },
      {
        text: "  bug_score: 12/100   has_critical: false",
        color: "#6b7a99",
        delay: 1000,
      },
      { text: "", delay: 1200 },
      {
        text: "[2/4] Performance Analyzer  →  executing in Docker...",
        color: "#00e5ff",
        delay: 1400,
      },
      {
        text: "  runtime: 11ms   memory: 2.1 MB   complexity: O(n)",
        color: "#6b7a99",
        delay: 2600,
      },
      { text: "", delay: 2800 },
      {
        text: "[3/4] Optimizer  →  generating optimized solution...",
        color: "#7c3aed",
        delay: 3000,
      },
      {
        text: "  strategy: already optimal   delta: < 2%",
        color: "#6b7a99",
        delay: 4000,
      },
      { text: "", delay: 4200 },
      {
        text: "[4/4] Validator  →  skipped (no changes to validate)",
        color: "#10b981",
        delay: 4400,
      },
      { text: "", delay: 4600 },
      {
        text: "⚠ NO IMPROVEMENT  ·  code is already optimal  ·  nothing to do",
        color: "#7c3aed",
        delay: 4800,
      },
    ],
  },
};

// Static data
const INPUT_CODE = `def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                if arr[i] not in duplicates:
                    duplicates.append(arr[i])
    return duplicates`;

const DIFF_LINES = [
  { line: "def find_duplicates(arr):", type: "unchanged" },
  { line: "-    duplicates = []", type: "removed" },
  { line: "-    for i in range(len(arr)):", type: "removed" },
  { line: "-        for j in range(i + 1, len(arr)):", type: "removed" },
  { line: "-            if arr[i] == arr[j]:", type: "removed" },
  { line: "-                if arr[i] not in duplicates:", type: "removed" },
  { line: "-                    duplicates.append(arr[i])", type: "removed" },
  { line: "+    seen = set()", type: "added" },
  { line: "+    duplicates = set()", type: "added" },
  { line: "+    for item in arr:", type: "added" },
  { line: "+        if item in seen:", type: "added" },
  { line: "+            duplicates.add(item)", type: "added" },
  { line: "+        else:", type: "added" },
  { line: "+            seen.add(item)", type: "added" },
  { line: "    return list(duplicates)", type: "unchanged" },
];

const RESULT_CARDS = [
  {
    label: "Bug Score",
    value: "42 / 100",
    sub: "moderate risk detected",
    color: "#f59e0b",
  },
  {
    label: "Runtime Before",
    value: "2,847 ms",
    sub: "O(n²) complexity",
    color: "#ef4444",
  },
  {
    label: "Runtime After",
    value: "12 ms",
    sub: "O(n) complexity",
    color: "#10b981",
  },
  {
    label: "Speedup",
    value: "237× faster",
    sub: "✅ APPROVED — outputs match",
    color: "#00e5ff",
  },
];

const CHART_DATA = [
  { name: "Before", ms: 2847, fill: "#ef4444" },
  { name: "After", ms: 12, fill: "#10b981" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0d1424",
        border: "1px solid rgba(0,229,255,0.2)",
        borderRadius: "8px",
        padding: "10px 16px",
      }}
    >
      <p
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "13px",
          color: payload[0].fill,
        }}
      >
        {payload[0].payload.name}: {payload[0].value.toLocaleString()} ms
      </p>
    </div>
  );
};

function DotLabel({ color }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        marginRight: 8,
      }}
    />
  );
}

const OPTIMIZED_CODE = `def find_duplicates(arr):
    seen = set()
    duplicates = set()
    for item in arr:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    return list(duplicates)`;

export default function Demo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleLines, setVisibleLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMode, setErrorMode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const timeouts = useRef([]);

  const copyOptimized = () => {
    const code = apiResult?.optimization?.optimized_code || OPTIMIZED_CODE;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const reset = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setVisibleLines([]);
    setRunning(false);
    setDone(false);
    setErrorMode(null);
    setApiResult(null);
    setApiError(null);
  };

  const runScenario = (steps, errKey = null) => {
    reset();
    setRunning(true);
    setErrorMode(errKey);
    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, step]);
        if (i === steps.length - 1) {
          setRunning(false);
          setDone(true);
          const bugCount = errKey ? 0 : 2;
          const score = errKey ? null : 42;
          window.dispatchEvent(
            new CustomEvent("bugCountUpdate", {
              detail: { count: bugCount, score, error: errKey },
            }),
          );
        }
      }, step.delay);
      timeouts.current.push(t);
    });
  };

  const runPipeline = async () => {
    if (running) return;
    setApiResult(null);
    setApiError(null);
    runScenario(STEPS);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: INPUT_CODE, language: "python" }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setApiResult(data);
    } catch {
      setApiError("Backend not running. Start FastAPI on port 8000.");
    }
  };

  const liveResultCards = apiResult
    ? [
        {
          label: "Bug Score",
          value: `${apiResult.bug_report?.bug_score ?? "--"} / 100`,
          sub: apiResult.bug_report?.has_critical_bugs
            ? "critical bugs detected"
            : "moderate risk detected",
          color: "#f59e0b",
        },
        {
          label: "Runtime Before",
          value: `${
            apiResult.performance_report?.execution_time_ms != null
              ? Math.round(
                  apiResult.performance_report.execution_time_ms,
                ).toLocaleString()
              : "--"
          } ms`,
          sub:
            apiResult.performance_report?.time_complexity ||
            "measured in Docker",
          color: "#ef4444",
        },
        {
          label: "Runtime After",
          value: `${
            apiResult.validation?.optimized_time_ms != null
              ? Math.round(
                  apiResult.validation.optimized_time_ms,
                ).toLocaleString()
              : "--"
          } ms`,
          sub: "optimized",
          color: "#10b981",
        },
        {
          label: "Speedup",
          value: `${
            apiResult.validation?.speedup_percentage != null
              ? Math.round(apiResult.validation.speedup_percentage)
              : "--"
          }× faster`,
          sub: `${
            apiResult.validation?.status === "approved"
              ? "✅ APPROVED"
              : (apiResult.validation?.status?.toUpperCase() ?? "--")
          } — outputs ${apiResult.validation?.outputs_match ? "match" : "differ"}`,
          color: "#00e5ff",
        },
      ]
    : RESULT_CARDS;

  const liveChartData = apiResult
    ? [
        {
          name: "Before",
          ms: Math.round(
            apiResult.validation?.original_time_ms ??
              apiResult.performance_report?.execution_time_ms ??
              2847,
          ),
          fill: "#ef4444",
        },
        {
          name: "After",
          ms: Math.round(apiResult.validation?.optimized_time_ms ?? 12),
          fill: "#10b981",
        },
      ]
    : CHART_DATA;

  return (
    <section id="demo" ref={ref} style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            Live Demo
          </div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#fff",
            }}
          >
            Real Results.{" "}
            <span style={{ color: "#10b981" }}>Real Numbers.</span>
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#94a3b8",
              fontSize: "16px",
              marginTop: "14px",
            }}
          >
            Input: a naive O(n²) duplicate finder. Output: 237× speed
            improvement, validated in Docker.
          </p>
        </motion.div>

        {/* Two-column: input code + terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
            alignItems: "stretch",
          }}
        >
          {/* Input code */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.64rem",
                letterSpacing: "0.12em",
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <DotLabel color="#ef4444" />
              Input — find_duplicates.py
            </div>
            <PyCode code={INPUT_CODE} style={{ flex: 1 }} scanning={running} />
          </div>

          {/* Terminal */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.64rem",
                letterSpacing: "0.12em",
                color: "#10b981",
                textTransform: "uppercase",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <DotLabel color="#10b981" />
              Pipeline Execution
            </div>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <motion.button
                onClick={runPipeline}
                disabled={running}
                whileHover={!running ? { scale: 1.02 } : {}}
                whileTap={!running ? { scale: 0.97 } : {}}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 22px",
                  borderRadius: "8px",
                  background: running ? "transparent" : "#00e5ff",
                  color: running ? "#00e5ff" : "#050810",
                  border: running ? "1px solid rgba(0,229,255,0.3)" : "none",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: running ? "not-allowed" : "pointer",
                  boxShadow: running ? "none" : "0 0 18px rgba(0,229,255,0.22)",
                  transition: "all 0.2s",
                }}
              >
                {running ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      style={{ display: "inline-block" }}
                    >
                      ↻
                    </motion.span>
                    Running...
                  </>
                ) : done ? (
                  "↺ Run Again"
                ) : (
                  "▶ Run Pipeline"
                )}
              </motion.button>

              {/* Reset button */}
              {(done || visibleLines.length > 0) && (
                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "7px 13px",
                    borderRadius: "7px",
                    background: "transparent",
                    color: "#6b7a99",
                    border: "1px solid rgba(107,122,153,0.3)",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#6b7a99";
                    e.currentTarget.style.borderColor = "rgba(107,122,153,0.3)";
                  }}
                >
                  ✕ Reset
                </motion.button>
              )}

              {/* Error scenario buttons */}
              {Object.entries(ERROR_SCENARIOS).map(([key, scenario]) => (
                <motion.button
                  key={key}
                  onClick={() => runScenario(scenario.lines, key)}
                  disabled={running}
                  whileHover={!running ? { scale: 1.04 } : {}}
                  whileTap={!running ? { scale: 0.96 } : {}}
                  style={{
                    padding: "7px 13px",
                    borderRadius: "7px",
                    background:
                      errorMode === key && done
                        ? `${scenario.color}18`
                        : "transparent",
                    color: scenario.color,
                    border: `1px solid ${scenario.color}44`,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                    cursor: running ? "not-allowed" : "pointer",
                    opacity: running ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {scenario.label}
                </motion.button>
              ))}
            </div>
            <PipelineTerminal lines={visibleLines} running={running} />
          </div>
        </motion.div>

        {/* Backend error banner */}
        {apiError && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: "10px",
              padding: "14px 20px",
              marginBottom: "24px",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "13px",
              color: "#fca5a5",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠</span>
            {apiError}
          </div>
        )}

        {/* Result cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {liveResultCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, boxShadow: `0 12px 32px ${card.color}22` }}
              style={{
                background: "rgba(13,20,36,0.8)",
                border: `1px solid ${card.color}33`,
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: card.color,
                }}
              />
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "#6b7a99",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 2.5vw, 27px)",
                  color: card.color,
                  textShadow: `0 0 20px ${card.color}44`,
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "11px",
                  color: "#6b7a99",
                  marginTop: "6px",
                }}
              >
                {card.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.38 }}
          style={{
            background: "rgba(13,20,36,0.7)",
            border: "1px solid rgba(0,229,255,0.1)",
            borderRadius: "14px",
            padding: "28px 32px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "#fff",
              marginBottom: "22px",
            }}
          >
            Runtime Comparison (ms)
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart
              data={liveChartData}
              layout="vertical"
              margin={{ left: 10, right: 60 }}
            >
              <XAxis
                type="number"
                tick={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 11,
                  fill: "#6b7a99",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 12,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,229,255,0.04)" }}
              />
              <Bar
                dataKey="ms"
                radius={[0, 6, 6, 0]}
                isAnimationActive
                animationDuration={1200}
              >
                {CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Diff view */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.48 }}
        >
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.64rem",
              letterSpacing: "0.12em",
              color: "#10b981",
              textTransform: "uppercase",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DotLabel color="#10b981" />
              Optimized Code — Diff View
            </div>
            <motion.button
              onClick={copyOptimized}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "6px",
                background: copied
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: copied ? "#10b981" : "#94a3b8",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "none",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "check" : "copy"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
          <div
            style={{
              background: "#060d1a",
              border: "1px solid rgba(16,185,129,0.15)",
              borderRadius: "12px",
              padding: "22px 24px",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "13px",
              lineHeight: 1.78,
              overflowX: "auto",
            }}
          >
            {DIFF_LINES.map((l, i) => (
              <div
                key={i}
                style={{
                  paddingLeft: "12px",
                  borderLeft:
                    l.type === "removed"
                      ? "3px solid #ef4444"
                      : l.type === "added"
                        ? "3px solid #10b981"
                        : "3px solid transparent",
                  background:
                    l.type === "removed"
                      ? "rgba(239,68,68,0.07)"
                      : l.type === "added"
                        ? "rgba(16,185,129,0.07)"
                        : "transparent",
                  color:
                    l.type === "removed"
                      ? "#fca5a5"
                      : l.type === "added"
                        ? "#6ee7b7"
                        : "#6b7a99",
                  whiteSpace: "pre",
                }}
              >
                {l.line}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
