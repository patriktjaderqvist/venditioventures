import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import Folder3D from './Folder3D'

export default function Scene({ onOpen, closing = false }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Transparent background so HTML BackgroundText shows through */}

        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 2, 6]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-3, 1, 5]} intensity={0.6} color="#e0e0e0" />
        <pointLight position={[3, 1, 5]} intensity={0.4} color="#ffffff" />

        <Folder3D onOpen={onOpen} closing={closing} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI * 0.05}
          maxPolarAngle={Math.PI * 0.85}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          rotateSpeed={0.4}
        />

        <ContactShadows
          position={[0, -1.8, -4]}
          opacity={0.9}
          scale={16}
          blur={2}
          far={8}
          color="#000000"
        />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
