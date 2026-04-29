import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const isFloat = String(target).includes(".");
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 73,
    suffix: "%",
    label: "of performance bugs go undetected in code review",
    accent: "#f59e0b",
  },
  {
    value: 4,
    suffix: "x",
    label: "slower: average unoptimized vs optimized algorithm runtime",
    accent: "#00e5ff",
  },
  {
    value: 0,
    suffix: "",
    label:
      "existing tools that validate AI-suggested fixes with real execution",
    accent: "#7c3aed",
  },
  {
    value: 4,
    suffix: "",
    label: "specialized AI agents working in one unified pipeline",
    accent: "#10b981",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="problem"
      ref={ref}
      style={{ padding: "120px 24px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: "72px" }}
      >
        <div className="section-label" style={{ marginBottom: "16px" }}>
          The Problem
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
          Existing AI tools give advice.
          <br />
          <span style={{ color: "#00e5ff" }}>We give proof.</span>
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            color: "#94a3b8",
            fontSize: "17px",
            lineHeight: 1.75,
            maxWidth: "660px",
            margin: "24px auto 0",
          }}
        >
          ChatGPT and Claude give generic suggestions — but they don't execute
          code, don't measure real speedup, and can't prove their suggestions
          actually work. Our system doesn't just suggest. It runs, measures, and
          validates.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{
              background: "rgba(13,20,36,0.7)",
              border: `1px solid ${stat.accent}22`,
              borderRadius: "16px",
              padding: "36px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px, 6vw, 72px)",
                color: stat.accent,
                lineHeight: 1,
                marginBottom: "16px",
                textShadow: `0 0 30px ${stat.accent}55`,
              }}
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
