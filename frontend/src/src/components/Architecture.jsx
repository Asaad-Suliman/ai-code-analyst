import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const layers = [
  {
    label: 'Layer 1 — User Interface',
    sublabel: 'React Frontend',
    color: '#00e5ff',
    components: [
      { name: 'CodeEditor', file: 'frontend/components/Editor.jsx', tech: 'React + CodeMirror' },
      { name: 'ResultsPanel', file: 'frontend/components/Results.jsx', tech: 'React + Recharts' },
      { name: 'PipelineStatus', file: 'frontend/components/Status.jsx', tech: 'Framer Motion' },
    ],
  },
  {
    label: 'Layer 2 — API Gateway',
    sublabel: 'FastAPI + Orchestrator',
    color: '#7c3aed',
    components: [
      { name: 'FastAPI App', file: 'api/app.py', tech: 'FastAPI + Uvicorn' },
      { name: 'Orchestrator', file: 'orchestrator.py', tech: 'Async pipeline runner' },
      { name: 'Schemas', file: 'schemas.py', tech: 'Pydantic v2' },
    ],
  },
  {
    label: 'Layer 3 — Agent Layer',
    sublabel: '4 Specialized Agents + Docker Sandbox',
    color: '#10b981',
    components: [
      { name: 'Bug Detector', file: 'bug_detector.py', tech: 'Gemini 2.0 + OpenRouter' },
      { name: 'Perf Analyzer', file: 'performance_analyzer.py', tech: 'Docker + AST' },
      { name: 'Optimizer', file: 'optimizer.py', tech: 'Gemini 2.0 + Retry' },
      { name: 'Validator', file: 'validator.py', tech: 'Docker sandbox' },
    ],
  },
]

const techBadges = [
  { name: 'Python', role: 'Backend', icon: '🐍', color: '#3b82f6' },
  { name: 'FastAPI', role: 'Gateway', icon: '⚡', color: '#10b981' },
  { name: 'React', role: 'Frontend', icon: '⚛️', color: '#00e5ff' },
  { name: 'Gemini API', role: 'AI Engine', icon: '🤖', color: '#7c3aed' },
  { name: 'Docker', role: 'Sandbox', icon: '🐳', color: '#2563eb' },
  { name: 'Pydantic', role: 'Schemas', icon: '📐', color: '#f59e0b' },
  { name: 'Three.js', role: 'Visualization', icon: '🌐', color: '#00e5ff' },
  { name: 'OpenRouter', role: 'LLM Router', icon: '🔀', color: '#ef4444' },
]

export default function Architecture() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="architecture" ref={ref} style={{ padding: '120px 24px', background: 'rgba(13,20,36,0.4)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div className="section-label" style={{ marginBottom: '16px' }}>System Design</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff' }}>
            System Architecture
          </h2>
        </motion.div>

        {/* 3D-style layered diagram */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', perspective: '800px', marginBottom: '72px' }}>
          {layers.map((layer, li) => (
            <motion.div
              key={li}
              initial={{ opacity: 0, rotateX: -15, y: 40 }}
              animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + li * 0.18 }}
              style={{
                transformStyle: 'preserve-3d',
                marginBottom: li < layers.length - 1 ? '0' : '0',
              }}
            >
              {/* Layer plane */}
              <div style={{
                background: `linear-gradient(135deg, ${layer.color}10, rgba(13,20,36,0.9))`,
                border: `1px solid ${layer.color}33`,
                borderRadius: '16px',
                padding: '28px 32px',
                position: 'relative',
                marginBottom: li < layers.length - 1 ? '2px' : '0',
              }}>
                {/* Left label */}
                <div style={{
                  position: 'absolute',
                  left: '-1px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: layer.color,
                  borderRadius: '0 4px 4px 0',
                }} />

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.12em', color: layer.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {layer.label}
                  </div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff' }}>
                    {layer.sublabel}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {layer.components.map((comp, ci) => (
                    <motion.div
                      key={ci}
                      whileHover={{ scale: 1.03, borderColor: layer.color }}
                      style={{
                        background: 'rgba(5,8,16,0.6)',
                        border: `1px solid rgba(255,255,255,0.08)`,
                        borderRadius: '10px',
                        padding: '14px 18px',
                        transition: 'border 0.2s',
                        minWidth: '180px',
                        cursor: 'default',
                      }}
                    >
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#e2e8f0', marginBottom: '4px' }}>
                        {comp.name}
                      </div>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: layer.color, marginBottom: '4px' }}>
                        {comp.file}
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6b7a99' }}>
                        {comp.tech}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Flow arrow between layers */}
              {li < layers.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2, delay: li * 0.5 }}
                    style={{
                      width: '2px',
                      height: '32px',
                      background: `linear-gradient(to bottom, ${layers[li].color}, ${layers[li + 1].color})`,
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `8px solid ${layers[li + 1].color}`,
                    }} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#6b7a99', textTransform: 'uppercase', textAlign: 'center', marginBottom: '24px' }}>
            Technology Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {techBadges.map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, boxShadow: `0 8px 24px ${badge.color}33` }}
                style={{
                  background: 'rgba(13,20,36,0.8)',
                  border: `1px solid ${badge.color}33`,
                  borderRadius: '10px',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff' }}>{badge.name}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: badge.color }}>{badge.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
