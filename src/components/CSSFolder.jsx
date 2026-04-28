import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import './CSSFolder.css'

export default function CSSFolder({ onOpen, closing = false }) {
  const [opening, setOpening] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const dragRot = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const hasCalledOpen = useRef(false)
  const prevClosing = useRef(false)

  // Reset after closing finishes
  if (closing && !prevClosing.current) {
    prevClosing.current = true
  }
  if (!closing && prevClosing.current) {
    prevClosing.current = false
    setOpening(false)
    hasCalledOpen.current = false
  }

  // Pointer tracking for rotation
  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1

      const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
      if (isDragging.current) {
        const dx = nx - lastPointer.current.x
        const dy = ny - lastPointer.current.y
        dragRot.current.x = clamp(dragRot.current.x + dy * 40, -45, 45)
        dragRot.current.y = clamp(dragRot.current.y + dx * 40, -55, 55)
        setRotation({ x: dragRot.current.x, y: dragRot.current.y })
      } else {
        // Subtle pointer follow — classy tilt, not gimmicky
        setRotation({ x: ny * -5, y: nx * 7 })
      }

      lastPointer.current = { x: nx, y: ny }
    }

    const onDown = () => {
      isDragging.current = true
      dragRot.current = { ...rotation }
    }
    const onUp = () => { isDragging.current = false }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [rotation])

  const handleClick = useCallback(() => {
    if (opening || closing) return
    setOpening(true)
    hasCalledOpen.current = false
    // Fire onOpen after the animation completes
    setTimeout(() => {
      if (!hasCalledOpen.current) {
        hasCalledOpen.current = true
        onOpen()
      }
    }, 700)
  }, [opening, closing, onOpen])

  const isOpen = opening && !closing
  const isShrunk = isOpen || closing

  return (
    <div className="folder-perspective">
      <div
        className="folder-scene"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="folder-float">
          <motion.div
            className="folder-body"
            onClick={handleClick}
            whileHover={{ scale: 1.03 }}
            animate={{ scale: isShrunk ? 0.6 : 1 }}
            transition={{
              scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: isOpen ? 0.35 : 0 },
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Curved shadows */}
            <div className="folder-shadow-bl" />
            <div className="folder-shadow-br" />
            <div className="folder-shadow-ll" />
            <div className="folder-shadow-lb" />
            <div className="folder-shadow-rt" />
            <div className="folder-shadow-rb" />

            {/* Back panel */}
            <div className="folder-panel folder-back" />

            {/* Tab — anchored to the back panel only */}
            <div className="folder-tab" />

            {/* Inner face — clean, no paper grain */}
            <div className="folder-panel folder-inner" />

            {/* Stacked papers inside the folder — visible once the front swings open */}
            <div className="folder-paper folder-paper-back" />
            <div className="folder-paper folder-paper-mid" />
            <div className="folder-paper folder-paper-front" />

            {/* Leather strap — retracts upward (dragged to the back) before the front opens */}
            <div className={`folder-strap-front ${isOpen ? 'open' : ''}`} />

            {/* Front panel — flips open */}
            <div className={`folder-panel folder-front ${isOpen ? 'open' : ''}`} />

            {/* Silver buckle — sibling of strap (so it stays z-above), but rotates in
                lockstep with the front panel via matching transform-origin/timing */}
            <SilverBuckle isOpen={isOpen} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ── Silver A-buckle ── */
/* The literal letter "A" in silver, rotated 180° so it reads upside-down.
   Solid serif letterform with metallic gradient. */
function SilverBuckle({ isOpen = false }) {
  return (
    <svg
      className={`folder-buckle ${isOpen ? 'open' : ''}`}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="buckleMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f9" />
          <stop offset="0.25" stopColor="#c8cdd3" />
          <stop offset="0.5" stopColor="#7e838b" />
          <stop offset="0.75" stopColor="#acb1b9" />
          <stop offset="1" stopColor="#3d4046" />
        </linearGradient>
      </defs>

      {/* Letter "A" rotated 180° so it sits upside-down */}
      <text
        x="19"
        y="30"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="36"
        fill="url(#buckleMetal)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.4"
        transform="rotate(180 19 19)"
      >
        A
      </text>
    </svg>
  )
}
