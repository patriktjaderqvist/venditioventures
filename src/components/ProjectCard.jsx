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

export default function ProjectCard({ project, index, isAdmin, onRemove }) {
  // Fan-out: cards start stacked at center, then spread to their grid positions
  const fanAngles = [-12, 0, 12, -8, 8]
  const angle = fanAngles[index % fanAngles.length]

  return (
    <motion.div
      className="relative group rounded-2xl overflow-hidden"
      whileHover={{
        y: -4,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      style={{
        background: '#1c1c20',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.12)',
      }}
    >
      {/* Admin remove button */}
      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(255,0,0,0.15)',
            border: '1px solid rgba(255,0,0,0.2)',
            color: 'rgba(255,100,100,0.8)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.15)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Image area — dark with wireframe placeholder */}
      <div
        className="aspect-[16/10] w-full relative overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #252528 0%, #1a1a1e 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          /* Wireframe-style placeholder like the reference */
          <div className="w-[75%] h-[70%] relative">
            {/* Top bar */}
            <div className="h-2 w-16 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.14)' }} />
            {/* Title line */}
            <div className="h-2.5 w-28 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.16)' }} />
            {/* Subtitle */}
            <div className="h-2 w-20 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
            {/* Content blocks */}
            <div className="flex gap-2 mb-2">
              <div className="h-10 w-16 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-10 w-16 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-10 w-16 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
            {/* Text lines */}
            <div className="h-1.5 w-full rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-1.5 w-3/4 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-sm font-medium tracking-wide"
          style={{ color: 'rgba(255,255,255,0.92)' }}
        >
          {project.title}
        </h3>
        <p
          className="text-xs mt-2 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase"
              style={{
                color: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.08)',
                fontWeight: 400,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div
          className="flex gap-4 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase transition-colors duration-300 hover:!text-white"
              style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}
            >
              <LinkIcon type="external" />
              Live
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase transition-colors duration-300 hover:!text-white"
              style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}
            >
              <LinkIcon type="github" />
              Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
