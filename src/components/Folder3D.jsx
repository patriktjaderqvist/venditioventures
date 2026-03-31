import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vvLogoSrc from '../assets/vv-logo.png'

// Matte dark palette
const FOLDER_BODY = '#2a2a2f'
const FOLDER_FRONT = '#2e2e33'
const FOLDER_TAB = '#2c2c31'
const FOLDER_INNER = '#1a1a1e'


function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return shape
}

function createTabShape() {
  const h = 0.28
  const shape = new THREE.Shape()
  shape.moveTo(-0.5, 0)
  shape.lineTo(-0.5, h * 0.67)
  shape.quadraticCurveTo(-0.5, h, -0.36, h)
  shape.lineTo(0.2, h)
  shape.quadraticCurveTo(0.34, h, 0.44, h * 0.57)
  shape.lineTo(0.52, 0)
  shape.closePath()
  return shape
}


function FolderPanel({ shape, depth, color, ...props }) {
  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
    })
  }, [shape, depth])

  return (
    <mesh geometry={geometry} {...props}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        clearcoat={0.4}
        clearcoatRoughness={0.2}
        envMapIntensity={0.5}
        reflectivity={0.3}
      />
    </mesh>
  )
}

// VV logo loaded from image asset — inverted so dark pixels become subtle white on transparent
// Built synchronously from a pre-loaded image to avoid React state-update warnings in R3F
const _logoTexturePromise = new Promise((resolve) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, size, size)

    const scale = Math.min(size / img.width, size / img.height) * 0.85
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)

    const imageData = ctx.getImageData(0, 0, size, size)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
      const brightness = (r + g + b) / 3

      if (a < 10 || brightness > 230) {
        data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0
      } else {
        const opacity = ((255 - brightness) / 255) * (a / 255) * 0.35
        data[i] = 255; data[i + 1] = 255; data[i + 2] = 255
        data[i + 3] = Math.round(opacity * 255)
      }
    }

    ctx.putImageData(imageData, 0, 0)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    resolve(tex)
  }
  img.src = vvLogoSrc
})

function useVVLogoTexture() {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    _logoTexturePromise.then(setTexture)
  }, [])
  return texture
}

// Front panel with logo texture
function FolderFrontPanel({ shape, depth, color, logoTexture, ...props }) {
  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
    })
  }, [shape, depth])

  return (
    <group {...props}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          envMapIntensity={0.5}
          reflectivity={0.3}
        />
      </mesh>
      {logoTexture && (
        <mesh position={[0, 0, depth + 0.035]}>
          <planeGeometry args={[2.2, 1.6]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default function Folder3D({ onOpen, closing = false }) {
  const groupRef = useRef()
  const frontRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [opening, setOpening] = useState(false)
  const progressRef = useRef(0)
  const hasCalledOpen = useRef(false)
  const prevClosing = useRef(false)
  const logoTexture = useVVLogoTexture()
  // When closing prop flips to true, snap progress to 1 (fully open) so it can animate back
  if (closing && !prevClosing.current) {
    progressRef.current = 1
    prevClosing.current = true
  }
  // When closing finishes (prop goes false), reset state flags
  // Don't snap values — let the idle lerp handle smooth transition
  if (!closing && prevClosing.current) {
    prevClosing.current = false
    progressRef.current = 0
    setOpening(false)
    hasCalledOpen.current = false
  }

  const bodyShape = useMemo(() => createRoundedRectShape(2.8, 2.0, 0.18), [])
  const frontShape = useMemo(() => createRoundedRectShape(2.8, 2.0, 0.18), [])
  const tabShape = useMemo(() => createTabShape(), [])


  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (!opening && !closing) setOpening(true)
  }, [opening, closing])

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const isIdle = !opening && !closing

    // === IDLE STATE ===
    if (isIdle) {
      // Lerp scale toward hover target (smooth, no snap)
      const target = hovered ? 1.03 : 1
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.08)
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, target, 0.08)
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, target, 0.08)

      // Lerp position.y toward float target (smooth transition from animation)
      const t = performance.now() * 0.001
      const floatTarget = Math.sin(t * 0.6) * 0.015
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatTarget, 0.08)

      // Lerp front panel rotation back to 0
      if (frontRef.current) {
        frontRef.current.rotation.x = THREE.MathUtils.lerp(frontRef.current.rotation.x, 0, 0.1)
      }
    }

    // === OPENING animation ===
    if (opening && !closing) {
      progressRef.current = Math.min(progressRef.current + delta * 1.8, 1)
      const p = progressRef.current

      if (frontRef.current) {
        const eased = 1 - Math.pow(1 - Math.min(p / 0.5, 1), 3)
        frontRef.current.rotation.x = Math.PI * 0.5 * eased
      }

      if (p >= 0.7) {
        const fade = (p - 0.7) / 0.3
        const s = 1 - fade * 0.4
        groupRef.current.scale.set(s, s, s)
      }

      if (p >= 1 && !hasCalledOpen.current) {
        hasCalledOpen.current = true
        onOpen()
      }
    }

    // === CLOSING animation (reverse) ===
    if (closing) {
      progressRef.current = Math.max(progressRef.current - delta * 1.5, 0)
      const p = progressRef.current

      if (frontRef.current) {
        const eased = 1 - Math.pow(1 - Math.min(p / 0.5, 1), 3)
        frontRef.current.rotation.x = Math.PI * 0.5 * eased
      }

      // Lerp scale back toward 1 smoothly
      const targetScale = p >= 0.7 ? 1 - ((p - 0.7) / 0.3) * 0.4 : 1
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1)
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.1)
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Back panel */}
      <FolderPanel shape={bodyShape} depth={0.12} color={FOLDER_BODY} position={[0, 0, -0.14]} />

      {/* Tab */}
      <FolderPanel shape={tabShape} depth={0.12} color={FOLDER_TAB} position={[-0.45, 1.0, -0.14]} />

      {/* Inner face */}
      <FolderPanel shape={bodyShape} depth={0.02} color={FOLDER_INNER} position={[0, 0, -0.06]} />

      {/* Front panel with VV logo — tilts forward on open */}
      <group ref={frontRef} position={[0, -1.0, 0]}>
        <FolderFrontPanel
          shape={frontShape}
          depth={0.06}
          color={FOLDER_FRONT}
          logoTexture={logoTexture}
          position={[0, 1.0, 0]}
        />
      </group>
    </group>
  )
}
