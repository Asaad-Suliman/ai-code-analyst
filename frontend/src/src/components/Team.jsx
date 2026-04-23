import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const members = [
  {
    name: 'Jordan Lee',
    initials: 'JL',
    role: 'System Architect & Pipeline Lead',
    avatarColor: '#7c3aed',
    files: ['orchestrator.py', 'validator.py', 'schemas.py', 'config.py'],
    quote: 'Designed the multi-agent pipeline and the Docker-backed validator that proves every optimization works.',
    accent: '#7c3aed',
  },
  {
    name: 'Marcus Reid',
    initials: 'MR',
    role: 'AI Agent Developer',
    avatarColor: '#f59e0b',
    files: ['bug_detector.py', 'optimizer.py', 'prompts.py'],
    quote: 'Built the AI agents that detect bugs and generate optimized code using Gemini 2.0.',
    accent: '#f59e0b',
  },
  {
    name: 'Kai Nakamura',
    initials: 'KN',
    role: 'Performance & Sandbox Engineer',
    avatarColor: '#00e5ff',
    files: ['performance_analyzer.py', 'code_executor.py', 'metrics.py', 'Dockerfile'],
    quote: 'Built the Docker sandbox that safely executes untrusted code and measures real performance.',
    accent: '#00e5ff',
  },
  {
    name: 'Sofia Vance',
    initials: 'SV',
    role: 'Frontend & Integration Engineer',
    avatarColor: '#10b981',
    files: ['api/app.py', 'frontend/'],
    quote: 'Built the React web interface and FastAPI integration that connects all agents into one product.',
    accent: '#10b981',
  },
]

export default function Team() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="team" ref={ref} style={{ padding: '120px 24px', background: 'rgba(13,20,36,0.4)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div className="section-label" style={{ marginBottom: '16px' }}>Our Team</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff' }}>
            Built by Engineers,<br /><span style={{ color: '#00e5ff' }}>For Engineers.</span>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '16px', marginTop: '14px' }}>
            A focused team of specialists — every component of the pipeline owned end-to-end.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: `0 20px 48px ${m.accent}22` }}
              style={{
                background: 'rgba(13,20,36,0.8)',
                border: `1px solid ${m.accent}22`,
                borderRadius: '16px',
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${m.accent}, transparent)`,
              }} />

              {/* Avatar */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `${m.avatarColor}22`,
                border: `2px solid ${m.avatarColor}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: m.avatarColor,
                marginBottom: '20px',
                boxShadow: `0 0 20px ${m.avatarColor}33`,
              }}>
                {m.initials}
              </div>

              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>
                {m.name}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: m.accent, letterSpacing: '0.05em', marginBottom: '20px' }}>
                {m.role}
              </div>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '20px' }}>
                "{m.quote}"
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {m.files.map((f, fi) => (
                  <span key={fi} style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10px',
                    color: '#6b7a99',
                    background: 'rgba(5,8,16,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
