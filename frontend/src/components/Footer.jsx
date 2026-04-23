import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer style={{ padding: '60px 24px 40px', textAlign: 'center', position: 'relative' }}>
      {/* Animated gradient line */}
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00e5ff, #7c3aed, #10b981, transparent)',
          backgroundSize: '200% 100%',
        }}
      />

      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: '#fff', marginBottom: '8px' }}>
        AI Code Analyst
      </div>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#00e5ff', letterSpacing: '0.1em', marginBottom: '24px' }}>
        Detect · Optimize · Validate
      </div>

      <a
        href="https://github.com/Fl2vio/ai-code-analyst"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(0,229,255,0.2)',
          color: '#94a3b8',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '13px',
          textDecoration: 'none',
          marginBottom: '32px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; e.currentTarget.style.color = '#94a3b8' }}
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
        github.com/Fl2vio/ai-code-analyst
      </a>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4a5568', lineHeight: 1.7 }}>
        Built with Python, React, Gemini API, and Docker<br />
        © 2025 AI Code Analyst. All rights reserved.
      </div>
    </footer>
  )
}
