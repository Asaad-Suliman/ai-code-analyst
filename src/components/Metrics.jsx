import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { useState } from "react";

const radarData = [
  { subject: "Bug Detection", score: 90 },
  { subject: "Performance", score: 85 },
  { subject: "Optimization", score: 88 },
  { subject: "Validation", score: 92 },
  { subject: "Security", score: 87 },
  { subject: "API Integration", score: 95 },
];

const barData = [
  { name: "Bubble Sort", before: 1240, after: 89 },
  { name: "String Search", before: 3200, after: 45 },
  { name: "Duplicate Finder", before: 2847, after: 12 },
];

const pieData = [
  { name: "Bug Detection", value: 94, color: "#f59e0b" },
  { name: "Perf Analysis", value: 98, color: "#00e5ff" },
  { name: "Optimization", value: 91, color: "#7c3aed" },
  { name: "Validation", value: 96, color: "#10b981" },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#0d1424",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: "8px",
          padding: "12px 16px",
        }}
      >
        <p
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          {label}
        </p>
        {payload.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "12px",
              color: p.fill,
            }}
          >
            {p.name}: {p.value.toLocaleString()} ms
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill="#fff"
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "28px",
        }}
      >
        {value}%
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fill="#94a3b8"
        style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "12px" }}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function Metrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activePieIndex, setActivePieIndex] = useState(0);

  return (
    <section id="metrics" ref={ref} style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            Performance Data
          </div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#fff",
            }}
          >
            Measured. Proven.{" "}
            <span style={{ color: "#00e5ff" }}>Validated.</span>
          </h2>
        </motion.div>

        {/* Headline stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {[
            {
              value: "237×",
              label: "peak speedup achieved",
              sub: "Duplicate Finder: 2847ms → 12ms",
              color: "#10b981",
            },
            {
              value: "96.3%",
              label: "average pipeline success rate",
              sub: "Across all 4 agents",
              color: "#00e5ff",
            },
            {
              value: "< 8s",
              label: "end-to-end pipeline time",
              sub: "Including Docker execution",
              color: "#7c3aed",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, boxShadow: `0 12px 32px ${stat.color}22` }}
              style={{
                background: "rgba(13,20,36,0.8)",
                border: `1px solid ${stat.color}33`,
                borderRadius: "14px",
                padding: "28px 24px",
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
                  background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                }}
              />
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 5vw, 52px)",
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: "10px",
                  textShadow: `0 0 30px ${stat.color}44`,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "11px",
                  color: "#94a3b8",
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "10px",
                  color: "#4b5563",
                }}
              >
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: "rgba(13,20,36,0.7)",
              border: "1px solid rgba(0,229,255,0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              System Capability Coverage
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "11px",
                color: "#6b7a99",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Score out of 100
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,229,255,0.12)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#00e5ff"
                  fill="#00e5ff"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ fill: "#00e5ff", r: 4 }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22 }}
            style={{
              background: "rgba(13,20,36,0.7)",
              border: "1px solid rgba(0,229,255,0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Optimization Results
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "11px",
                color: "#6b7a99",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Runtime (ms) — Before vs After
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ bottom: 10 }}>
                <XAxis
                  dataKey="name"
                  tick={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    fill: "#6b7a99",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(0,229,255,0.05)" }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                />
                <Bar
                  dataKey="before"
                  name="Before"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="after"
                  name="After"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34 }}
            style={{
              background: "rgba(13,20,36,0.7)",
              border: "1px solid rgba(0,229,255,0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Agent Pipeline Success Rate
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "11px",
                color: "#6b7a99",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Click segments to inspect
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  isAnimationActive={true}
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              {pieData.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: d.color,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "11px",
                      color: "#94a3b8",
                    }}
                  >
                    {d.name} {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
