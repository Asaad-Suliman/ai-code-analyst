import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ThemeContext";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Demo", href: "#demo" },
  { label: "Architecture", href: "#architecture" },
  { label: "Metrics", href: "#metrics" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const [bugInfo, setBugInfo] = useState(null);

  useEffect(() => {
    const handler = (e) => setBugInfo(e.detail);
    window.addEventListener("bugCountUpdate", handler);
    return () => window.removeEventListener("bugCountUpdate", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const isActive = (href) => href === `#${activeSection}`;

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition:
            "background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,229,255,0.1)"
            : "1px solid transparent",
        }}
      >
        {/* Logo + badge */}
        <a
          href="#demo"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ears */}
            <polygon points="8,28 18,4 26,24" fill="#00e5ff" opacity="0.9" />
            <polygon points="56,28 46,4 38,24" fill="#00e5ff" opacity="0.9" />
            <polygon points="10,26 18,8 24,22" fill="#ff6b35" opacity="0.85" />
            <polygon points="54,26 46,8 40,22" fill="#ff6b35" opacity="0.85" />
            {/* Head */}
            <ellipse cx="32" cy="36" rx="22" ry="18" fill="#ff6b35" />
            {/* Snout */}
            <ellipse cx="32" cy="44" rx="10" ry="7" fill="#ffd4b3" />
            {/* Nose */}
            <ellipse cx="32" cy="40" rx="3" ry="2" fill="#1a0a00" />
            {/* Eyes */}
            <ellipse cx="23" cy="32" rx="4" ry="4.5" fill="#1a0a00" />
            <ellipse cx="41" cy="32" rx="4" ry="4.5" fill="#1a0a00" />
            {/* Eye shine */}
            <circle cx="24.5" cy="30.5" r="1.2" fill="#00e5ff" />
            <circle cx="42.5" cy="30.5" r="1.2" fill="#00e5ff" />
            {/* Chest patch */}
            <ellipse
              cx="32"
              cy="50"
              rx="7"
              ry="4"
              fill="#ffd4b3"
              opacity="0.6"
            />
            {/* Glow ring */}
            <ellipse
              cx="32"
              cy="36"
              rx="22"
              ry="18"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="1.2"
              opacity="0.35"
            />
          </svg>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "15px",
              color: "#00e5ff",
              letterSpacing: "0.02em",
            }}
          >
            AI Code Analyst
          </span>
        </a>

        {/* Bug count badge */}
        <AnimatePresence>
          {bugInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: bugInfo.error
                  ? "rgba(239,68,68,0.12)"
                  : bugInfo.count > 0
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(16,185,129,0.12)",
                border: `1px solid ${bugInfo.error ? "#ef4444" : bugInfo.count > 0 ? "#f59e0b" : "#10b981"}44`,
                borderRadius: "20px",
                padding: "3px 10px",
                cursor: "pointer",
              }}
              onClick={() =>
                document
                  .querySelector("#demo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span style={{ fontSize: "10px" }}>
                {bugInfo.error ? "✖" : bugInfo.count > 0 ? "⚠" : "✓"}
              </span>
              <span
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.62rem",
                  color: bugInfo.error
                    ? "#ef4444"
                    : bugInfo.count > 0
                      ? "#f59e0b"
                      : "#10b981",
                  letterSpacing: "0.04em",
                }}
              >
                {bugInfo.error
                  ? bugInfo.error.toUpperCase()
                  : bugInfo.count > 0
                    ? `${bugInfo.count} bug${bugInfo.count !== 1 ? "s" : ""} · ${bugInfo.score}/100`
                    : "APPROVED"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop nav */}
        <div
          style={{ display: "flex", gap: "28px", alignItems: "center" }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <div
              key={l.href}
              style={{ position: "relative", paddingBottom: "4px" }}
            >
              <a
                href={l.href}
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.05em",
                  color: isActive(l.href) ? "#00e5ff" : "#94a3b8",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(l.href))
                    e.currentTarget.style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(l.href))
                    e.currentTarget.style.color = "#94a3b8";
                }}
              >
                {l.label}
              </a>
              {isActive(l.href) && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#00e5ff",
                    boxShadow: "0 0 6px #00e5ff",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          ))}

          {/* Theme toggle */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: dark ? "rgba(0,229,255,0.08)" : "rgba(0,0,0,0.06)",
              border: dark
                ? "1px solid rgba(0,229,255,0.25)"
                : "1px solid rgba(0,0,0,0.12)",
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.25s",
              flexShrink: 0,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? "moon" : "sun"}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-block", lineHeight: 1 }}
              >
                {dark ? "🌙" : "☀️"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <a
            href="https://github.com/Fl2vio/ai-code-analyst"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: "1px solid rgba(0,229,255,0.3)",
              color: "#00e5ff",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.72rem",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            GitHub
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#94a3b8",
          }}
          aria-label="Toggle menu"
        >
          <div
            style={{
              width: 22,
              height: 2,
              background: menuOpen ? "#00e5ff" : "#94a3b8",
              marginBottom: 5,
              transition: "all 0.2s",
              transform: menuOpen
                ? "rotate(45deg) translate(5px, 5px)"
                : "none",
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: menuOpen ? "transparent" : "#94a3b8",
              marginBottom: 5,
              transition: "all 0.2s",
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: menuOpen ? "#00e5ff" : "#94a3b8",
              transition: "all 0.2s",
              transform: menuOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "60px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(5,8,16,0.97)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(0,229,255,0.1)",
              padding: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "12px 8px",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.85rem",
                  color: isActive(l.href) ? "#00e5ff" : "#94a3b8",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {isActive(l.href) && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#00e5ff",
                      display: "inline-block",
                    }}
                  />
                )}
                {l.label}
              </a>
            ))}
            <a
              href="https://github.com/Fl2vio/ai-code-analyst"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: "12px",
                padding: "11px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(0,229,255,0.25)",
                color: "#00e5ff",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.8rem",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              GitHub →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
