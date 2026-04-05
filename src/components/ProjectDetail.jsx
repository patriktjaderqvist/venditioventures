import { useEffect } from 'react'
import { motion } from 'framer-motion'

function LinkIcon({ type }) {
  if (type === 'github') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function ProjectDetail({ project, onClose }) {
  // Lock body scroll while open, restore on close
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Escape to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const sectionHeading = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  }

  const bodyText = {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
    lineHeight: 1.8,
    fontWeight: 300,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] overflow-y-auto"
      style={{ background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl mx-auto my-8 sm:my-12 mx-4 sm:mx-auto rounded-2xl overflow-hidden"
        style={{
          background: '#16161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.4)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Hero image */}
        {project.image && (
          <div
            className="w-full aspect-[16/9] overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #252528 0%, #1a1a1e 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          {/* Meta row: year · role */}
          {(project.year || project.role) && (
            <div
              className="flex gap-2 flex-wrap mb-4 text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}
            >
              {project.year && <span>{project.year}</span>}
              {project.year && project.role && <span>·</span>}
              {project.role && <span>{project.role}</span>}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}
          >
            {project.title}
          </h1>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="mt-6" style={{ ...bodyText, fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            {project.description}
          </p>

          {/* Goal */}
          {project.goal && (
            <section className="mt-10">
              <h3 style={sectionHeading}>Goal</h3>
              <div className="mt-2 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <p style={bodyText}>{project.goal}</p>
            </section>
          )}

          {/* Full content */}
          {project.content && (
            <section className="mt-10">
              <h3 style={sectionHeading}>About</h3>
              <div className="mt-2 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              {project.content.split('\n\n').map((para, i) => (
                <p key={i} className={i > 0 ? 'mt-4' : ''} style={bodyText}>
                  {para}
                </p>
              ))}
            </section>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <section className="mt-10">
              <h3 style={sectionHeading}>Highlights</h3>
              <div className="mt-2 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <ul className="space-y-2.5">
                {project.highlights.map((item, i) => (
                  <li key={i} className="flex gap-3" style={bodyText}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Stack */}
          {project.stack && project.stack.length > 0 && (
            <section className="mt-10">
              <h3 style={sectionHeading}>Stack</h3>
              <div className="mt-2 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full"
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: 'clamp(0.7rem, 1vw, 0.78rem)',
                      fontWeight: 300,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          {(project.links?.live || project.links?.github) && (
            <section className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex flex-wrap gap-3">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  >
                    <LinkIcon type="external" />
                    Visit Live
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <LinkIcon type="github" />
                    Source
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
