import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
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
  { id: 'story', label: 'The Story' },
  { id: 'ventures', label: 'Our Work' },
  { id: 'consulting', label: 'Consulting' },
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
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
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
        filter: 'none',
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

      {/* Main tab body */}
      <button
        onClick={onClick}
        className="relative cursor-pointer transition-colors duration-300"
        style={{
          height: TAB_HEIGHT + 6,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: isFirst
            ? (isMobile ? '14px' : 'clamp(18px, 2vw, 30px)')
            : (isMobile ? '8px' : 'clamp(12px, 1.5vw, 22px)'),
          paddingRight: isLast
            ? (isMobile ? '14px' : 'clamp(18px, 2vw, 30px)')
            : (isMobile ? '8px' : 'clamp(12px, 1.5vw, 22px)'),
          margin: `0 ${EAR}px`,
          marginLeft: isFirst ? 0 : `${EAR}px`,
          marginRight: isLast ? 0 : `${EAR}px`,
          fontSize: isMobile ? '7px' : 'clamp(7.5px, 0.75vw, 9.5px)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: isActive ? 400 : 300,
          color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
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
          if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
        }}
      >
        {tab.label}
      </button>

      {/* Depth gradient — darker toward bottom-left, more intense for tabs further back */}
      {!isActive && (
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: EAR, right: EAR,
            height: '100%',
            borderRadius: '6px 6px 0 0',
            clipPath: tabClipPath || undefined,
            background: `linear-gradient(to top right,
              rgba(0,0,0,${0.15 + index * 0.1}) 0%,
              rgba(0,0,0,${0.06 + index * 0.04}) 50%,
              rgba(255,255,255,${0.02 + index * 0.01}) 100%)`,
          }}
        />
      )}
    </div>
  )
}

function CloseTab({ onClick }) {
  const bg = 'var(--bg-elevated)'
  const EAR = 8

  return (
    <div
      className="relative"
      style={{
        zIndex: 1,
        transform: 'translateY(10px)',
      }}
    >
      {/* Left ear */}
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

      {/* Right ear */}
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

      <button
        onClick={onClick}
        className="relative cursor-pointer transition-colors duration-300"
        style={{
          height: TAB_HEIGHT + 6,
          padding: '0 18px',
          margin: `0 ${EAR}px`,
          fontSize: '9.5px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          background: bg,
          borderRadius: '6px 6px 0 0',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Depth gradient — same as inactive tabs */}
      <div
        className="absolute bottom-0 pointer-events-none"
        style={{
          left: EAR, right: EAR,
          height: '100%',
          borderRadius: '6px 6px 0 0',
          background: `linear-gradient(to top right,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.12) 50%,
            transparent 100%)`,
        }}
      />
    </div>
  )
}

/* ── Tab Content Components ─────────────────────────────── */

function StoryContent() {
  const sectionStyle = {
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
    lineHeight: 1.8,
    fontWeight: 300,
  }

  const headingStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  }

  return (
    <div className="relative">
      {/* VV monogram watermark — only on The Story */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src={vvLogoSrc}
          alt=""
          style={{
            width: 'clamp(250px, 35vw, 500px)',
            opacity: 0.03,
            filter: 'invert(1)',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-8 pt-12 pb-4">
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
            Venditio Ventures
          </h1>
          <div className="mt-4 mx-auto h-px w-12" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <p
            className="mt-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6,
              letterSpacing: '0.03em',
            }}
          >
            Consulting &middot; Ventures &middot; Products
          </p>
        </div>
      </div>

      {/* Story content */}
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-12">

        {/* The Name */}
        <section>
          <h2 style={headingStyle}>Venditio</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p style={sectionStyle}>
            From the Latin <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>venditio</em>, the act of selling, the art of the deal. Not the kind that pushes product. The kind that reads a room, understands what drives a person, and knows when to speak and when to listen. That instinct is behind everything built here.
          </p>
        </section>

        {/* The Mark */}
        <section>
          <h2 style={headingStyle}>The Mark</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-start gap-6">
            <img
              src={vvLogoSrc}
              alt="VV"
              style={{ width: '56px', opacity: 0.6, filter: 'invert(1)', flexShrink: 0, marginTop: '4px' }}
            />
            <div>
              <p style={sectionStyle}>
                Two V's. Venditio Ventures. The double V carries the initials, but it also reads as a W. That was never an accident. The W carries the intent. <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Win</em>. Every project ships with the same goal: <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>come out on top</em>. For the client, for the user, for the product. The mark is a reminder that the work isn't done until someone wins.
              </p>
            </div>
          </div>
        </section>

        {/* The Person */}
        <section>
          <h2 style={headingStyle}>Patrik Tj&auml;derqvist</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p style={sectionStyle}>
            Venditio is one person. Every venture, every client engagement, every product carries the same mind and the same standard. There is no team page because there is no distance between the brand and the person behind it.
          </p>
          <p className="mt-4" style={sectionStyle}>
            Several years in sales and account management at 3 Sverige. Customer service, B2B relationships, 120+ corporate accounts, and building a win-back department from scratch. First person from customer service nominated for <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Salesperson of the Year</em> in over five years. That world teaches you how to <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>listen</em> past what people say to what they actually need.
          </p>
        </section>

        {/* The Evolution */}
        <section>
          <h2 style={headingStyle}>The Evolution</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p style={sectionStyle}>
            The same drive that built a sales career now goes into building things. Python development with an AI specialization at Nackademin. Private investing across stocks, crypto, and NFTs. And Venditio Ventures AB, the vehicle where it all comes together. Idea, analysis, prototype, product.
          </p>
          <p className="mt-4" style={sectionStyle}>
            Driven by growth and by building systems that create <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>real value</em>. Analytical, research-driven, always looking for where technology meets business.
          </p>
        </section>

        {/* The Approach */}
        <section>
          <h2 style={headingStyle}>The Approach</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p style={sectionStyle}>
            Most problems hide in plain sight. A workflow everyone tolerates. A product that almost works. A process that exists because nobody questioned it. Venditio steps in where others see normal, finds what can be <em style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>better</em>, and builds the fix.
          </p>
          <p className="mt-4" style={sectionStyle}>
            Consulting and product development under one roof. Client work is informed by the discipline of building real products. Own ventures are shaped by the clarity that comes from solving other people's problems first. The two sharpen each other.
          </p>
        </section>

        {/* Open to connect */}
        <section>
          <h2 style={headingStyle}>Let's Build Something</h2>
          <div className="mt-1 mb-4 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p style={sectionStyle}>
            Open to connecting and collaborating around software development, trading, fintech, and projects where technology meets business. Explore the tabs above, or reach out directly.
          </p>
        </section>

      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-8">
        <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Connect section */}
      <div className="max-w-3xl mx-auto px-8 py-12">
        <p
          className="text-center text-xs tracking-[0.2em] uppercase mb-6"
          style={{ color: 'var(--text-secondary)', fontWeight: 300 }}
        >
          Connect
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
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
      </div>
    </div>
  )
}

const CATEGORY_INTROS = {
  ventures: {
    title: 'Our Ventures',
    description: 'Products built from the ground up. Each with its own brand, its own audience, all under the Venditio umbrella.',
  },
  consulting: {
    title: 'Consulting',
    description: 'Work done for clients who needed a sharper eye on their product, process, or strategy.',
  },
  academic: {
    title: 'Academic',
    description: 'The projects that built the foundation. Where theory met practice for the first time.',
  },
}

function ProjectsContent({ projects, category, isAdmin, onRemove, onAdd }) {
  const filtered = projects.filter((p) => p.category === category)

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-12" style={{ padding: 'clamp(24px, 3vw, 48px)' }}>

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
        <div className="mt-3 mx-auto h-px w-12" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <p
          className="mt-4 mx-auto"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.75rem, 1.1vw, 0.88rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '480px',
          }}
        >
          {CATEGORY_INTROS[category]?.description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
        {filtered.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isAdmin={isAdmin}
            onRemove={() => onRemove(project.id)}
          />
        ))}

        {isAdmin && (
          <motion.div
            onClick={onAdd}
            className="rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white/20"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '2px dashed rgba(255,255,255,0.1)',
              minHeight: '320px',
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Add Project
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {filtered.length === 0 && !isAdmin && (
        <p
          className="text-center py-20 text-sm tracking-wide"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Projects coming soon.
        </p>
      )}
    </div>
  )
}

function ConnectContent() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 'clamp(0.75rem, 1.1vw, 0.875rem)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="max-w-3xl mx-auto px-8 py-16"
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
        <div className="mt-3 mx-auto h-px w-12" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <p
          className="mt-4 mx-auto"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.75rem, 1.1vw, 0.88rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '480px',
          }}
        >
          Interested in working together, have a question, or just want to say hello? Reach out.
        </p>
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
      <div className="mx-auto h-px w-full mb-12" style={{ background: 'rgba(255,255,255,0.05)' }} />

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
              We'll get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <textarea
                placeholder="Your message..."
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div className="text-center pt-2">
              <button
                type="submit"
                className="cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
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
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.06)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pb-12">
        <div className="mx-auto h-px w-full mb-10" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <img
          src={vvLogoSrc}
          alt="VV"
          className="mx-auto mb-5"
          style={{ width: '32px', opacity: 0.25, filter: 'invert(1)' }}
        />
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 300 }}>
          Venditio Ventures AB
        </p>
        <p className="mt-2" style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.6rem', letterSpacing: '0.08em', fontWeight: 300 }}>
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
          border: '1px solid rgba(255,255,255,0.08)',
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
              background: 'rgba(255,255,255,0.04)',
              border: error ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(255,255,255,0.08)',
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
              background: 'rgba(255,255,255,0.85)',
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
  const BORDER = isMobile ? BORDER_MOBILE : BORDER_DESKTOP

  const handleTabChange = (tabId) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab)
    const nextIndex = TABS.findIndex((t) => t.id === tabId)
    setDirection(nextIndex > currentIndex ? 1 : -1)
    setActiveTab(tabId)
  }

  const pageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '60%' : '-60%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-40%' : '40%',
      opacity: 0,
    }),
  }

  const pageTransition = {
    type: 'tween',
    duration: 0.4,
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
      style={{ background: 'var(--bg)' }}
    >
      {/* Entire white area closes the folder */}
      <div
        onClick={onClose}
        className="cursor-pointer"
        style={{ padding: isMobile ? `${BORDER}px` : `${BORDER} ${BORDER} ${BORDER}`, paddingTop: isMobile ? `${BORDER + 12}px` : `calc(${BORDER} + 12px)`, paddingBottom: isMobile ? '60px' : 'clamp(60px, 8vw, 120px)', minHeight: '100vh' }}
      >

        {/* VV stamp on white area */}
        <div className="flex justify-center" style={{ marginBottom: '-20px', marginTop: '-40px', pointerEvents: 'none' }}>
          <img
            src={vvLogoSrc}
            alt=""
            style={{
              width: 'clamp(100px, 15vw, 180px)',
              opacity: 0.1,
              userSelect: 'none',
              filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.15)) drop-shadow(-1px -1px 0px rgba(255,255,255,0.7))',
            }}
          />
        </div>

        {/* Tabs row — inactive tabs peek from behind the paper */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-end justify-between"
          style={{
            marginBottom: '-1px',
            position: 'relative',
          }}
        >
          {/* Left: navigation tabs */}
          <div
            className="flex items-end"
            style={{
              paddingLeft: isMobile ? '4px' : '24px',
              overflowX: isMobile ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              width: '100%',
            }}
          >
            {TABS.map((tab, i) => (
              <FolderTab
                key={tab.id}
                tab={tab}
                index={i}
                total={TABS.length}
                isActive={activeTab === tab.id}
                onClick={() => handleTabChange(tab.id)}
                isMobile={isMobile}
              />
            ))}
          </div>

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

        {/* Dark content box — "the paper" */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative"
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: '16px',
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
              color: 'rgba(255,255,255,0.3)',
              background: 'none',
              border: 'none',
              padding: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
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
    </motion.div>
  )
}
