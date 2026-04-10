import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BackgroundText from './components/BackgroundText'
import CSSFolder from './components/CSSFolder'
import ProjectGallery from './components/ProjectGallery'

// States: 'closed' | 'opening' | 'open' | 'closing'
export default function App() {
  const [state, setState] = useState('closed')

  const handleOpen = useCallback(() => setState('open'), [])

  const handleClose = useCallback(() => {
    setState('closing')
    // Give the folder close animation time to play, then go idle
    setTimeout(() => setState('closed'), 900)
  }, [])

  // Folder is ALWAYS rendered — it sits behind the gallery
  const isClosing = state === 'closing'
  const showGallery = state === 'open'

  return (
    <div className="w-screen relative overflow-hidden" style={{ background: 'var(--bg)', height: '100dvh' }}>
      <BackgroundText />

      {/* Folder scene — always mounted, always behind */}
      <div className="absolute inset-0 z-10">
        <CSSFolder onOpen={handleOpen} closing={isClosing} />

        {/* Hint — only when fully idle */}
        {state === 'closed' && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 300 }}
            >
              Click to open &middot; Drag to explore
            </motion.p>
          </div>
        )}
      </div>

      {/* Gallery overlays on top — fades in/out */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden"
          >
            <ProjectGallery onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
