import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import vvLogo from '../assets/vv-logo.png'
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
        // Subtle pointer follow
        setRotation({ x: ny * -7, y: nx * 12 })
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

            {/* Tab */}
            <div className="folder-tab" />

            {/* Inner face */}
            <div className="folder-panel folder-inner" />

            {/* Front panel with logo */}
            <div className={`folder-panel folder-front ${isOpen ? 'open' : ''}`}>
              <img src={vvLogo} alt="" className="folder-logo" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
