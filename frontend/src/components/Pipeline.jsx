import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const agents = [
  {
    id: 1,
    name: "Bug Detector",
    icon: "🛡️",
    description: "Analyzes code for bugs, vulnerabilities, and anti-patterns",
    accent: "#f59e0b",
    input: {
      name: "UserInput",
      fields: ["source_code: string", "language: string"],
    },
    output: {
      name: "BugReport",
      fields: [
        "bug_score: 0–100",
        "bugs: Bug[]",
        "summary: string",
        "has_critical_bugs: bool",
      ],
    },
    tech: "Gemini 2.0 Flash via OpenRouter API",
  },
  {
    id: 2,
    name: "Performance Analyzer",
    icon: "⚡",
    description: "Executes code in sandbox and measures real runtime & memory",
    accent: "#00e5ff",
    input: {
      name: "UserInput",
      fields: ["source_code: string", "language: string"],
    },
    output: {
      name: "PerformanceReport",
      fields: [
        "runtime_ms: float",
        "memory_mb: float",
        "complexity: string",
        "bottlenecks: string[]",
      ],
    },
    tech: "Docker sandbox + AST analysis + Gemini 2.0 Flash",
  },
  {
    id: 3,
    name: "Optimizer",
    icon: "✨",
    description: "Generates optimized code using bug & performance context",
    accent: "#7c3aed",
    input: {
      name: "UserInput + BugReport + PerformanceReport",
      fields: [
        "source_code: string",
        "bug_score: int",
        "bottlenecks: string[]",
        "complexity: string",
      ],
    },
    output: {
      name: "OptimizationResult",
      fields: [
        "optimized_code: string",
        "changes: Change[]",
        "expected_improvement: string",
      ],
    },
    tech: "Gemini 2.0 Flash with retry logic + prompt chaining",
  },
  {
    id: 4,
    name: "Validator",
    icon: "✅",
    description: "Proves the optimization works with side-by-side execution",
    accent: "#10b981",
    input: {
      name: "original_code + optimized_code",
      fields: ["original_code: string", "optimized_code: string"],
    },
    output: {
      name: "ValidationResult",
      fields: [
        "status: APPROVED | REJECTED",
        "speedup_percent: float",
        "outputs_match: bool",
      ],
    },
    tech: "Docker sandbox (3-run average, output normalization)",
  },
];

function AgentCard({ agent, active, onClick, index }) {
  const isLast = index === agents.length - 1;

  return (
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
      <motion.div
        onClick={onClick}
        whileHover={{ y: -4 }}
        style={{
          flex: 1,
          padding: "24px 20px",
          borderRadius: "14px",
          background: active ? `${agent.accent}18` : "rgba(13,20,36,0.7)",
          border: `1.5px solid ${active ? agent.accent : "rgba(0,229,255,0.1)"}`,
          cursor: "pointer",
          transition: "border 0.2s, background 0.2s",
          boxShadow: active ? `0 0 32px ${agent.accent}33` : "none",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "10px" }}>
          {agent.icon}
        </div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: agent.accent,
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Agent {agent.id}
        </div>
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#fff",
            marginBottom: "8px",
          }}
        >
          {agent.name}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          {agent.description}
        </div>
        <div
          style={{
            marginTop: "14px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: `${agent.accent}22`,
            color: agent.accent,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.6rem",
            display: "inline-block",
          }}
        >
          {active ? "collapse ▲" : "details ▼"}
        </div>
      </motion.div>

      {!isLast && (
        <div
          style={{
            width: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "2px",
              background: `linear-gradient(90deg, ${agent.accent}, ${agents[index + 1].accent})`,
              opacity: 0.5,
            }}
          />
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: agent.accent,
              boxShadow: `0 0 8px ${agent.accent}`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Pipeline() {
  const [activeAgent, setActiveAgent] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const toggle = (id) => setActiveAgent((prev) => (prev === id ? null : id));
  const selected = agents.find((a) => a.id === activeAgent);

  return (
    <section
      id="pipeline"
      ref={ref}
      style={{ padding: "120px 24px", background: "rgba(13,20,36,0.4)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#fff",
            }}
          >
            The 4-Agent Pipeline
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#94a3b8",
              fontSize: "16px",
              marginTop: "14px",
            }}
          >
            Click any agent to inspect its inputs, outputs, and technology.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              active={activeAgent === agent.id}
              onClick={() => toggle(agent.id)}
              index={i}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden", marginTop: "20px" }}
            >
              <div
                style={{
                  padding: "32px",
                  borderRadius: "14px",
                  background: `${selected.accent}0d`,
                  border: `1px solid ${selected.accent}33`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "28px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: selected.accent,
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Input Schema
                  </div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "#c7d2fe",
                      marginBottom: "8px",
                    }}
                  >
                    {selected.input.name} {"{"}
                  </div>
                  {selected.input.fields.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "12px",
                        color: "#94a3b8",
                        paddingLeft: "16px",
                      }}
                    >
                      {f}
                    </div>
                  ))}
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "#c7d2fe",
                      marginTop: "4px",
                    }}
                  >
                    {"}"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: selected.accent,
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Output Schema
                  </div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "#c7d2fe",
                      marginBottom: "8px",
                    }}
                  >
                    {selected.output.name} {"{"}
                  </div>
                  {selected.output.fields.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "12px",
                        color: "#94a3b8",
                        paddingLeft: "16px",
                      }}
                    >
                      {f}
                    </div>
                  ))}
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "#c7d2fe",
                      marginTop: "4px",
                    }}
                  >
                    {"}"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: selected.accent,
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Technology
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "8px",
                      background: "rgba(13,20,36,0.6)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#e2e8f0",
                      lineHeight: 1.6,
                    }}
                  >
                    {selected.tech}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
