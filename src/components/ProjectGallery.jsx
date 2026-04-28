import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'
import defaultProjects from '../data/projects.json'
import AddProjectModal from './AddProjectModal'
import vvLogoSrc from '../assets/vv-logo.png'

/* ── Icons ─────────────────────────────────────────────── */

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function CVIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

/* ── Constants ──────────────────────────────────────────── */

const BORDER_DESKTOP = 'clamp(20px, 3vw, 50px)'
const BORDER_MOBILE = 10
const TAB_HEIGHT = 48

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

const TABS = [
  { id: 'story', label: 'Story' },
  { id: 'ventures', label: 'Work' },
  { id: 'consulting', label: 'Consult' },
  { id: 'academic', label: 'Academic' },
  { id: 'connect', label: 'Connect' },
]

/* ── Helpers ────────────────────────────────────────────── */

function SocialLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300"
      style={{
        color: 'var(--text-secondary)',
        background: 'rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.07)'
        e.currentTarget.style.color = 'rgba(0,0,0,0.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
    >
      {children}
    </a>
  )
}

// Admin auth: triple-click the close button area or press Ctrl+Shift+K to open login
// Session stored in sessionStorage (cleared on tab close)
// Passphrase is hashed and compared against env var
const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || ''

async function hashPassphrase(passphrase) {
  const encoder = new TextEncoder()
  const data = encoder.encode(passphrase)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('vv_admin') === 'true'
  })
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Ctrl+Shift+K to toggle admin login prompt
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        if (isAdmin) {
          // Logout
          sessionStorage.removeItem('vv_admin')
          setIsAdmin(false)
        } else {
          setShowLogin(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isAdmin])

  const tryLogin = async (passphrase) => {
    if (!ADMIN_HASH) {
      setShowLogin(false)
      return false
    }
    const hash = await hashPassphrase(passphrase)
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem('vv_admin', 'true')
      setIsAdmin(true)
      setShowLogin(false)
      return true
    }
    return false
  }

  const closeLogin = () => setShowLogin(false)

  return { isAdmin, showLogin, tryLogin, closeLogin }
}

function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('vv_custom_projects')
      if (saved) {
        const custom = JSON.parse(saved)
        return [...defaultProjects, ...custom]
      }
    } catch {}
    return defaultProjects
  })

  const addProject = (project) => {
    const newProject = { ...project, id: String(Date.now()) }
    setProjects((prev) => {
      const updated = [...prev, newProject]
      const customOnly = updated.filter(
        (p) => !defaultProjects.find((d) => d.id === p.id)
      )
      localStorage.setItem('vv_custom_projects', JSON.stringify(customOnly))
      return updated
    })
  }

  const removeProject = (id) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      const customOnly = updated.filter(
        (p) => !defaultProjects.find((d) => d.id === p.id)
      )
      localStorage.setItem('vv_custom_projects', JSON.stringify(customOnly))
      return updated
    })
  }

  return { projects, addProject, removeProject }
}

/* ── Folder Tab ─────────────────────────────────────────── */

function FolderTab({ tab, isActive, onClick, index, total, isMobile }) {
  const bg = 'var(--bg-elevated)'
  const EAR = isMobile ? 5 : 8
  const isFirst = index === 0
  const isLast = index === total - 1

  // Build clip-path for folder-shaped tabs
  // First tab: angled left edge (like 3D folder tab left side)
  // Last tab: angled right edge (like 3D folder tab right side)
  // Middle tabs: standard rectangular with rounded top
  // Match the 3D folder tab: subtle left angle, steeper right angle
  let tabClipPath
  if (isFirst) {
    tabClipPath = 'polygon(0% 100%, 0% 18%, 6% 0%, 100% 0%, 100% 100%)'
  } else if (isLast) {
    tabClipPath = 'polygon(0% 0%, 78% 0%, 100% 50%, 100% 100%, 0% 100%)'
  }

  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
      style={{
        zIndex: isActive ? 20 : (total - index),
        transform: isActive ? 'translateY(4px)' : 'translateY(10px)',
        marginRight: isLast ? 0 : `-${EAR * 2 + 6}px`,
        /* Stacked drop-shadows mirror the leather folder's thickness shadow
           (1–6px hard layers, then a soft drop) — gives each tab depth. */
        filter: `
          drop-shadow(0 1px 0 rgba(0,0,0,0.35))
          drop-shadow(0 2px 0 rgba(0,0,0,0.3))
          drop-shadow(0 3px 0 rgba(0,0,0,0.25))
          drop-shadow(0 4px 0 rgba(0,0,0,0.2))
          drop-shadow(0 6px 10px rgba(0,0,0,0.25))
        `,
      }}
    >
      {/* Left ear — inverse radius curve (not on first tab) */}
      {!isFirst && (
        <div
          className="absolute bottom-0 left-0"
          style={{ width: EAR, height: EAR, background: 'transparent', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: EAR * 2, height: EAR * 2,
            borderRadius: `0 0 ${EAR}px 0`,
            boxShadow: `${EAR / 2}px ${EAR / 2}px 0 ${EAR / 2}px ${bg}`,
          }} />
        </div>
      )}

      {/* Right ear — inverse radius curve (not on last tab) */}
      {!isLast && (
        <div
          className="absolute bottom-0 right-0"
          style={{ width: EAR, height: EAR, background: 'transparent', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            width: EAR * 2, height: EAR * 2,
            borderRadius: `0 0 0 ${EAR}px`,
            boxShadow: `-${EAR / 2}px ${EAR / 2}px 0 ${EAR / 2}px ${bg}`,
          }} />
        </div>
      )}

      {/* Main tab body — fluid sizing scales with viewport width */}
      <button
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        className="relative cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        style={{
          height: 'clamp(36px, 7vw, 54px)',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: isFirst
            ? 'clamp(10px, 2.5vw, 32px)'
            : 'clamp(6px, 1.6vw, 24px)',
          paddingRight: isLast
            ? 'clamp(10px, 2.5vw, 32px)'
            : 'clamp(6px, 1.6vw, 24px)',
          margin: `0 ${EAR}px`,
          marginLeft: isFirst ? 0 : `${EAR}px`,
          marginRight: isLast ? 0 : `${EAR}px`,
          fontSize: 'clamp(8px, 1.4vw, 10px)',
          letterSpacing: 'clamp(0.08em, 0.3vw, 0.14em)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: isActive ? 500 : 300,
          color: isActive ? 'var(--text-strong)' : 'var(--text-soft)',
          background: bg,
          borderRadius: '6px 6px 0 0',
          clipPath: tabClipPath || undefined,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = 'var(--text-strong)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = 'var(--text-soft)'
        }}
      >
        {tab.label}
      </button>

      {/* Depth gradient — consistent subtle darkening for all inactive tabs.
          Extend to 0 on the side without an ear so first/last tabs are fully covered. */}
      {!isActive && (
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: isFirst ? 0 : EAR,
            right: isLast ? 0 : EAR,
            height: '100%',
            borderRadius: '6px 6px 0 0',
            clipPath: tabClipPath || undefined,
            background: `linear-gradient(to top,
              rgba(0,0,0,0.25) 0%,
              rgba(0,0,0,0.1) 60%,
              rgba(0,0,0,0.02) 100%)`,
          }}
        />
      )}
    </div>
  )
}

/* ── Tab Content Components ─────────────────────────────── */

function StoryContent() {
  const sectionStyle = {
    color: 'var(--text-body)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
    lineHeight: 1.8,
    fontWeight: 300,
    textAlign: 'justify',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
  }

  const headingStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  }

  return (
    <div className="relative">
      {/* Upside-down A monogram watermark — only on The Story */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(280px, 40vw, 560px)',
            color: 'rgba(0,0,0,0.04)',
            lineHeight: 1,
            transform: 'rotate(180deg)',
            display: 'inline-block',
            userSelect: 'none',
          }}
        >
          A
        </span>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-4">
        <div className="w-full text-center">
          <h1
            className="tracking-[0.25em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            Avendavi
          </h1>
          <div className="mt-4 mx-auto h-px w-12" style={{ background: 'rgba(0,0,0,0.08)' }} />
          <p
            className="mt-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.4)',
              lineHeight: 1.6,
              letterSpacing: '0.03em',
            }}
          >
            Consulting &middot; Ventures &middot; Academic
          </p>
        </div>
      </div>

      {/* Story content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-20 sm:pb-32 space-y-10 sm:space-y-12">

        {/* The Name */}
        <section>
          {/* Dictionary-style pronunciation */}
          <div className="mb-5" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', lineHeight: 1.4 }}>
            <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>a&middot;vend&middot;a&middot;vi</span>
          </div>

          <p style={sectionStyle}>
            Built from two Latin roots — <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>vendere</em>, to sell, and <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>avis</em>, bird — run together into something new: <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>avendavi</em>.
          </p>
          <p className="mt-4" style={sectionStyle}>
            The name lands in two places at once. A career built in sales, and a surname — <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Tj&auml;derqvist</em> — that already carries a bird inside it. <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Tj&auml;der</em>, the capercaillie, a forest grouse native to the Nordics. The bird was there before the brand was.
          </p>
        </section>

        {/* The Person */}
        <section>
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0" style={{ marginTop: '4px' }}>
              <div
                className="overflow-hidden"
                style={{
                  width: 'clamp(100px, 15vw, 140px)',
                  height: 'clamp(100px, 15vw, 140px)',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  background: 'rgba(0,0,0,0.03)',
                }}
              >
                <img
                  src="/patrik.png"
                  alt="Patrik Tjäderqvist"
                  style={{
                    width: '115%',
                    height: '115%',
                    objectFit: 'cover',
                    objectPosition: '25% 10%',
                    transform: 'rotate(-0.5deg)',
                  }}
                />
              </div>
            </div>
            <div>
              <h2 style={headingStyle}>Patrik Tj&auml;derqvist</h2>
              <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
              <p style={sectionStyle}>
                Avendavi is one person. Every venture, every client engagement, every product carries the same mind and the same standard. There is no team page because there is no distance between the brand and the person behind it.
              </p>
              <p className="mt-4" style={sectionStyle}>
                The foundation is sales — years of cold calls, objections, and closing taught things no classroom can. How to <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>listen</em> past what people say to what they actually need. That gap is where real value lives, and it is the lens through which every problem gets solved.
              </p>
            </div>
          </div>
        </section>

        {/* The Evolution */}
        <section>
          <h2 style={headingStyle}>The Evolution</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <p style={sectionStyle}>
            The same drive that built a sales career now goes into building things. Python development with an AI specialization at Nackademin. Private investing across stocks, crypto, and NFTs. And Avendavi, the vehicle where it all comes together. Idea, analysis, prototype, product.
          </p>
          <p className="mt-4" style={sectionStyle}>
            Driven by growth and by building systems that create <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>real value</em>. Analytical, research-driven, always looking for where technology meets business.
          </p>
        </section>

        {/* Toolbox */}
        <section>
          <h2 style={headingStyle}>Toolbox</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <div className="flex flex-wrap gap-2 mt-2">
            {['Sales & Account Management', 'Business Development', 'Consulting', 'Entrepreneurship', 'Python Developer', 'Full-Stack Development', 'Agentic Coding', 'AI / ML', 'React', 'Node.js', 'PostgreSQL', 'REST APIs', 'CRM Systems', 'Investor Relations', 'Crypto & Trading'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full"
                style={{
                  color: 'rgba(0,0,0,0.55)',
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* The Approach */}
        <section>
          <h2 style={headingStyle}>The Approach</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <p style={sectionStyle}>
            Most problems hide in plain sight. A workflow everyone tolerates. A product that almost works. A process that exists because nobody questioned it. Avendavi steps in where others see normal and finds what can be <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>better</em> — then builds the solution.
          </p>
          <p className="mt-4" style={sectionStyle}>
            Consulting and product development under one roof. Client work is informed by the discipline of building real products. Own ventures are shaped by the clarity that comes from solving other people's problems first. The two sharpen each other.
          </p>
        </section>


      </div>

    </div>
  )
}

const CATEGORY_INTROS = {
  ventures: {
    title: 'Our Ventures',
    description: 'Products built from the ground up. Each with its own brand, its own audience, all under the Avendavi umbrella.',
  },
  consulting: {
    title: 'Consulting',
    description: 'Work done for clients who needed a sharper eye on their product, process, or strategy.',
  },
  academic: {
    title: 'Academic',
    description: 'Early work from the Nackademin years. The foundations.',
  },
}

function ProjectsContent({ projects, category, isAdmin, onRemove, onAdd, onOpenProject }) {
  const filtered = projects.filter((p) => p.category === category)

  return (
    <div className="max-w-6xl mx-auto" style={{ padding: 'clamp(24px, 3vw, 48px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}>

      {/* Tab intro */}
      <div className="w-full text-center mb-10">
        <h2
          className="tracking-[0.2em] uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {CATEGORY_INTROS[category]?.title}
        </h2>
        <div className="mt-3 mx-auto h-px w-12" style={{ background: 'rgba(0,0,0,0.08)' }} />
        <p
          className="mt-4 mx-auto"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.8rem, 1.1vw, 0.88rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '480px',
          }}
        >
          {CATEGORY_INTROS[category]?.description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(16px, 1.5vw, 20px)' }}>
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isAdmin={isAdmin}
            onRemove={() => onRemove(project.id)}
            onOpen={() => onOpenProject(project)}
          />
        ))}

        {isAdmin && (
          <motion.div
            onClick={onAdd}
            className="rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white/20"
            style={{
              background: 'rgba(0,0,0,0.02)',
              border: '2px dashed rgba(0,0,0,0.1)',
              minHeight: '320px',
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(0,0,0,0.06)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>
                Add Project
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {filtered.length === 0 && !isAdmin && (
        <p
          className="text-center py-20 text-sm tracking-wide"
          style={{ color: 'rgba(0,0,0,0.25)' }}
        >
          Projects coming soon.
        </p>
      )}
    </div>
  )
}

// Web3Forms access key — replace with your own at https://web3forms.com (free)
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''
const CONTACT_EMAIL = 'patriktjaderqvist@gmail.com'

function ConnectContent() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = {
    background: 'rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 'clamp(0.85rem, 1.1vw, 0.875rem)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    // If Web3Forms key is configured, use it
    if (WEB3FORMS_KEY) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Portfolio contact from ${form.name}`,
            from_name: 'Avendavi Portfolio',
          }),
        })
        const data = await res.json()
        if (data.success) {
          setSubmitted(true)
          setSending(false)
          return
        }
        throw new Error(data.message || 'Submission failed')
      } catch (err) {
        // Fall through to mailto fallback
      }
    }

    // Fallback: open user's email client
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
    setSending(false)
  }

  return (
    <div
      className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2
          className="tracking-[0.2em] uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          Connect
        </h2>
        <div className="mt-3 mx-auto h-px w-12" style={{ background: 'rgba(0,0,0,0.08)' }} />
        <p
          className="mt-4 mx-auto"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.8rem, 1.1vw, 0.88rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '480px',
          }}
        >
          Interested in working together, have a question, or just want to say hello? Reach out.
        </p>
      </div>

      {/* Primary CTA — Book a call */}
      <div className="flex justify-center mb-6">
        <a
          href="https://calendly.com/patriktjaderqvist"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-6 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300"
          style={{
            color: 'var(--bg-elevated)',
            background: 'var(--bg)',
            border: '1px solid var(--bg)',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          <CalendarIcon />
          Book a 30-min intro call
        </a>
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-4 flex-wrap mb-12">
        <SocialLink href="https://www.linkedin.com/in/patriktjaderqvist/">
          <LinkedInIcon />
          LinkedIn
        </SocialLink>
        <SocialLink href="https://github.com/patriktjaderqvist">
          <GitHubIcon />
          GitHub
        </SocialLink>
        <SocialLink href="/cv.pdf">
          <CVIcon />
          Resume
        </SocialLink>
      </div>

      {/* Divider */}
      <div className="mx-auto h-px w-full mb-12" style={{ background: 'rgba(0,0,0,0.05)' }} />

      {/* Contact form */}
      <div className="max-w-md mx-auto">
        <p
          className="text-center text-xs tracking-[0.2em] uppercase mb-6"
          style={{ color: 'var(--text-secondary)', fontWeight: 300 }}
        >
          Send a Message
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 300 }}>
              Thank you for reaching out.
            </p>
            <p className="mt-2" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 300 }}>
              I'll get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="sr-only">Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Message</label>
              <textarea
                id="contact-message"
                placeholder="Your message..."
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
              />
            </div>
            {error && (
              <div
                className="text-center"
                style={{ color: 'rgba(255,120,120,0.8)', fontSize: '0.75rem', fontWeight: 300 }}
              >
                {error}
              </div>
            )}
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={sending}
                className="cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
                style={{
                  background: 'rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '10px 32px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                }}
                onMouseEnter={(e) => {
                  if (sending) return
                  e.target.style.background = 'rgba(0,0,0,0.1)'
                  e.target.style.borderColor = 'rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.06)'
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)'
                }}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pb-12">
        <div className="mx-auto h-px w-full mb-10" style={{ background: 'rgba(0,0,0,0.05)' }} />
        <div
          className="mx-auto mb-5"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Avendavi"
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: '34px',
              lineHeight: 1,
              color: 'rgba(0,0,0,0.25)',
              transform: 'rotate(180deg)',
              display: 'inline-block',
              userSelect: 'none',
            }}
          >
            A
          </span>
        </div>
        <p style={{ color: 'rgba(0,0,0,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 300 }}>
          Avendavi AB
        </p>
        <p className="mt-2" style={{ color: 'rgba(0,0,0,0.1)', fontSize: '0.6rem', letterSpacing: '0.08em', fontWeight: 300 }}>
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

/* ── Admin Login Modal ──────────────────────────────────── */

function AdminLoginModal({ onClose, onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await onLogin(pass)
    if (!success) {
      setError(true)
      setPass('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-xl p-6"
        style={{
          background: '#1a1a1e',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passphrase"
            autoFocus
            className="w-full mb-3"
            style={{
              background: 'rgba(0,0,0,0.04)',
              border: error ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: '6px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md text-[11px] tracking-[0.12em] uppercase cursor-pointer"
            style={{
              color: '#0a0a0a',
              background: 'rgba(0,0,0,0.85)',
              border: 'none',
              fontWeight: 500,
            }}
          >
            Enter
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Gallery ───────────────────────────────────────── */

export default function ProjectGallery({ onClose }) {
  const { isAdmin, showLogin, tryLogin, closeLogin } = useIsAdmin()
  const isMobile = useIsMobile()
  const { projects, addProject, removeProject } = useProjects()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('story')
  const [direction, setDirection] = useState(0)
  const [addCategory, setAddCategory] = useState('ventures')
  const [openProject, setOpenProject] = useState(null)

  // Close gallery on Escape (when no modal/project detail is open)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !showAddModal && !showLogin && !openProject) {
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, showAddModal, showLogin, openProject])
  const BORDER = isMobile ? BORDER_MOBILE : BORDER_DESKTOP

  const handleTabChange = (tabId) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab)
    const nextIndex = TABS.findIndex((t) => t.id === tabId)
    setDirection(nextIndex > currentIndex ? 1 : -1)
    setActiveTab(tabId)
  }

  const pageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '10%' : '-10%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-10%' : '10%',
      opacity: 0,
    }),
  }

  const pageTransition = {
    type: 'tween',
    duration: 0.25,
    ease: [0.25, 0.8, 0.25, 1],
  }

  const renderTabContent = () => {
    let content
    switch (activeTab) {
      case 'story':
        content = <StoryContent />
        break
      case 'ventures':
      case 'consulting':
      case 'academic':
        content = (
          <ProjectsContent
            projects={projects}
            category={activeTab}
            isAdmin={isAdmin}
            onRemove={removeProject}
            onAdd={() => {
              setAddCategory(activeTab)
              setShowAddModal(true)
            }}
            onOpenProject={setOpenProject}
          />
        )
        break
      case 'connect':
        content = <ConnectContent />
        break
      default:
        return null
    }

    return (
      <motion.div
        key={activeTab}
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pageTransition}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full"
      style={{ background: 'transparent', overflowX: 'hidden' }}
    >
      {/* The "folder" — dark leather area inset from the page background, three-layer
          composition: page bg (around) → dark folder (here) → white paper (inside).
          Stacked box-shadows simulate the thickness of a leather slab; the soft outer
          shadow lifts the folder off the page background. */}
      <div
        onClick={onClose}
        className="cursor-pointer relative"
        style={{
          background: 'var(--bg)',
          /* Pure vw with min floors so the layout scales linearly at any screen size
             (no upper caps that would break proportions on large viewports) */
          margin: isMobile ? '12px' : 'max(24px, 3vw)',
          marginTop: isMobile ? '50px' : 'max(112px, 10.5vw)',
          borderRadius: isMobile ? '14px' : 'clamp(16px, 1.5vw, 24px)',
          /* Slightly tighter top inset so the paper sits closer to the tab,
             with the side and bottom dark border unchanged. */
          padding: isMobile ? '16px 20px 20px' : 'max(22px, 2.3vw) max(28px, 3vw) max(28px, 3vw)',
          minHeight: 'calc(100vh - 96px)',
          boxShadow: `
            0 1px 0 rgba(0,0,0,0.55),
            0 2px 0 rgba(0,0,0,0.5),
            0 3px 0 rgba(0,0,0,0.45),
            0 4px 0 rgba(0,0,0,0.4),
            0 5px 0 rgba(0,0,0,0.35),
            0 6px 0 rgba(0,0,0,0.3),
            0 10px 22px rgba(0,0,0,0.35),
            0 22px 48px rgba(0,0,0,0.28)
          `,
        }}
      >
        {/* Folder tab — outer dark shape. Width = 42vw ≈ 45% of dark folder body
            (matching the closed 3D folder's 40% ratio). Aspect 3.33:1 and polygon
            (80%, 45%) match the closed tab silhouette. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: isMobile ? '-22px' : 'calc(-7.56vw + 12px)',
            left: 0,
            width: isMobile ? '170px' : '42vw',
            height: isMobile ? '50px' : '12.6vw',
            background: 'var(--bg)',
            clipPath: 'polygon(0 100%, 0 0, 80% 0, 100% 45%, 100% 100%)',
            borderRadius: '8px 0 0 0',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Paper tab background — off-white shape that holds the buttons. Carries the
            stacked drop-shadow filter so the tab reads with depth WITHOUT applying the
            shadow to the buttons themselves (which would shadow the text). */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: isMobile ? '-4px' : 'calc(-7.56vw + 3vw + 24px)',
            left: isMobile ? '12px' : '3vw',
            width: isMobile ? '146px' : 'calc(42vw - 6vw)',
            height: isMobile ? '38px' : 'calc(12.6vw - 3vw)',
            background: 'var(--tab-inactive-bg)',
            /* Paper polygon coords adjusted so its angle is parallel to the black
               tab's ~34° angle (matching closed 3D folder) and inset 3vw perpendicular */
            clipPath: 'polygon(0 100%, 0 0, 82% 0, 100% 45%, 100% 100%)',
            pointerEvents: 'none',
            zIndex: 1,
            filter: `
              drop-shadow(0 1px 0 rgba(0,0,0,0.35))
              drop-shadow(0 2px 0 rgba(0,0,0,0.3))
              drop-shadow(0 3px 0 rgba(0,0,0,0.25))
              drop-shadow(0 4px 0 rgba(0,0,0,0.2))
              drop-shadow(0 6px 10px rgba(0,0,0,0.25))
            `,
          }}
        />

        {/* Tab buttons — each sized to its own word + equal padding, centered text.
            The buttons sit on top of the paper-tab background. */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-stretch"
          style={{
            position: 'absolute',
            top: isMobile ? '-4px' : 'calc(-7.56vw + 3vw + 24px)',
            left: isMobile ? '12px' : '3vw',
            width: isMobile ? '146px' : 'calc(42vw - 6vw)',
            height: isMobile ? '38px' : 'calc(12.6vw - 3vw)',
            zIndex: 2,
            clipPath: 'polygon(0 100%, 0 0, 82% 0, 100% 45%, 100% 100%)',
            /* Reserve the angled-corner area on the right so buttons don't extend
               into it (CONNECT would otherwise get clipped by the polygon angle). */
            paddingRight: isMobile ? '26px' : '18%',
          }}
        >
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab.id
            const isFirst = i === 0
            const isLast = i === TABS.length - 1
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                style={{
                  /* First 4 buttons grow to fill extra space; CONNECT stays content-sized
                     so it sits flush at the right edge while the others get bigger. */
                  flex: isLast ? '0 0 auto' : '1 1 auto',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none',
                  /* Vertical divider between adjacent tabs */
                  borderRight: !isLast ? '1px solid rgba(0,0,0,0.15)' : 'none',
                  /* Buttons are simple rectangles. The parent container handles the
                     paper-tab polygon silhouette via its own clip-path. */
                  borderRadius: 0,
                  /* Pure vw scaling with min floor — no upper cap, so the buttons grow
                     linearly with screen size in lockstep with the tab dimensions. */
                  fontSize: 'max(9px, 1vw)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--text-strong)' : 'var(--text-soft)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  /* Each tab's width = word width + equal horizontal padding. Small
                     extra paddingTop nudges centered text to the polygon's centroid
                     (which sits ~2% below box center because the top-right is clipped). */
                  paddingLeft: isMobile ? '4px' : 'max(4px, 0.7vw)',
                  paddingRight: isMobile ? '4px' : 'max(4px, 0.7vw)',
                  paddingTop: 0,
                  paddingBottom: isMobile ? '16px' : 'max(18px, 2.1vw)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-soft)'
                  }
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Shadow wrapper — no overflow hidden so shadows peek out */}
        <div className="paper-shadow" style={{ position: 'relative', zIndex: 5 }}>
          <div className="shadow-bottom-left" />
          <div className="shadow-bottom-right" />
          <div className="shadow-top-left" />
          <div className="shadow-top-right" />
          <div className="shadow-left-top" />
          <div className="shadow-left-bottom" />
          <div className="shadow-right-top" />
          <div className="shadow-right-bottom" />

        {/* Premium thick paper — warm parchment with fiber grain and stitched inseam */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative paper-light"
          style={{
            borderRadius: 0,
            minHeight: '200vh',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Close X — top right corner */}
          <button
            onClick={onClose}
            className="absolute top-5 right-6 z-20 cursor-pointer transition-all duration-300"
            style={{
              color: 'rgba(0,0,0,0.3)',
              background: 'none',
              border: 'none',
              padding: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.3)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            {renderTabContent()}
          </AnimatePresence>
        </div>
        </div>{/* close paper-shadow wrapper */}

      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddProjectModal
            onClose={() => setShowAddModal(false)}
            defaultCategory={addCategory}
            onAdd={(project) => {
              addProject({ ...project, category: addCategory })
              setShowAddModal(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <AdminLoginModal onClose={closeLogin} onLogin={tryLogin} />
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {openProject && (
          <ProjectDetail project={openProject} onClose={() => setOpenProject(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
