import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const capabilityRows = [
  "Detects bugs and code issues",
  "Suggests code optimizations",
  "Actually executes the code",
  "Measures real runtime (ms)",
  "Validates fix correctness",
  "Proves output match before/after",
  "Sandboxed execution environment",
  "Multi-agent pipeline architecture",
];

const tools = [
  {
    name: "Generic AI",
    sub: "ChatGPT · Claude · Gemini",
    supported: [true, true, false, false, false, false, false, false],
    highlight: false,
  },
  {
    name: "GitHub Copilot",
    sub: "Code completion & review",
    supported: [true, true, false, false, false, false, false, false],
    highlight: false,
  },
  {
    name: "AI Code Analyst",
    sub: "← Our system",
    supported: [true, true, true, true, true, true, true, true],
    highlight: true,
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      style={{ padding: "120px 24px", background: "rgba(13,20,36,0.4)" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            Why It's Different
          </div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            Other tools suggest.
            <br />
            <span style={{ color: "#00e5ff" }}>We prove it works.</span>
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#94a3b8",
              fontSize: "16px",
              marginTop: "14px",
              maxWidth: "560px",
              margin: "14px auto 0",
            }}
          >
            ChatGPT and Copilot stop at the suggestion. Our system executes,
            measures, and validates — in Docker.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ overflowX: "auto" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "14px 20px",
                    textAlign: "left",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#4b5563",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontWeight: 400,
                  }}
                >
                  Capability
                </th>
                {tools.map((tool, ti) => (
                  <th
                    key={ti}
                    style={{
                      padding: "18px 24px",
                      textAlign: "center",
                      minWidth: "170px",
                      fontWeight: 400,
                      borderBottom: `1px solid ${tool.highlight ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                      background: tool.highlight
                        ? "rgba(0,229,255,0.05)"
                        : "transparent",
                      borderLeft: tool.highlight
                        ? "1px solid rgba(0,229,255,0.15)"
                        : "none",
                      borderRight: tool.highlight
                        ? "1px solid rgba(0,229,255,0.15)"
                        : "none",
                      borderTop: tool.highlight
                        ? "1px solid rgba(0,229,255,0.2)"
                        : "none",
                      borderRadius: tool.highlight ? "12px 12px 0 0" : "0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: tool.highlight ? "#00e5ff" : "#6b7a99",
                        marginBottom: "5px",
                      }}
                    >
                      {tool.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "10px",
                        color: "#374151",
                      }}
                    >
                      {tool.sub}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilityRows.map((cap, ri) => (
                <motion.tr
                  key={ri}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + ri * 0.055 }}
                >
                  <td
                    style={{
                      padding: "13px 20px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#94a3b8",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cap}
                  </td>
                  {tools.map((tool, ti) => {
                    const has = tool.supported[ri];
                    return (
                      <td
                        key={ti}
                        style={{
                          padding: "13px 24px",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: tool.highlight
                            ? "rgba(0,229,255,0.025)"
                            : "transparent",
                          borderLeft: tool.highlight
                            ? "1px solid rgba(0,229,255,0.1)"
                            : "none",
                          borderRight: tool.highlight
                            ? "1px solid rgba(0,229,255,0.1)"
                            : "none",
                        }}
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{
                            delay: 0.4 + ri * 0.055,
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                          }}
                          style={{
                            display: "inline-block",
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: "16px",
                            color: has ? "#10b981" : "#1f2937",
                            fontWeight: 700,
                          }}
                        >
                          {has ? "✓" : "✕"}
                        </motion.span>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
              <tr>
                <td style={{ padding: 0 }} />
                {tools.map((tool, ti) => (
                  <td
                    key={ti}
                    style={{
                      padding: "10px 0 0 0",
                      background: tool.highlight
                        ? "rgba(0,229,255,0.025)"
                        : "transparent",
                      borderLeft: tool.highlight
                        ? "1px solid rgba(0,229,255,0.1)"
                        : "none",
                      borderRight: tool.highlight
                        ? "1px solid rgba(0,229,255,0.1)"
                        : "none",
                      borderBottom: tool.highlight
                        ? "1px solid rgba(0,229,255,0.2)"
                        : "none",
                      borderRadius: tool.highlight ? "0 0 12px 12px" : "0",
                    }}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
