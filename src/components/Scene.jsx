import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const TILT = THREE.MathUtils.degToRad(-25)

function ShakerModel({ scrollProgress }) {
  const { scene } = useGLTF('/shaker.glb')
  const spinRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    if (!scene) return

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        Object.assign(node.material, {
          metalness: 0.05,
          roughness: 0.9,
        })
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Center model geometry at origin
    scene.position.set(-center.x, -center.y, -center.z)

    const isMobile = window.innerWidth < 1000
    const cameraDistance = isMobile ? 2 : 1.25
    camera.position.set(0, 0, Math.max(size.x, size.y, size.z) * cameraDistance)
    camera.lookAt(0, 0, 0)
  }, [scene, camera])

  useFrame(() => {
    if (!spinRef.current || scrollProgress.current < 0.05) return
    const t = (scrollProgress.current - 0.05) / 0.95
    spinRef.current.rotation.y = Math.PI * 12 * t
  })

  return (
    <group rotation={[0, 0, TILT]}>
      <group ref={spinRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

function PlaceholderModel({ scrollProgress }) {
  const spinRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 4)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    if (!spinRef.current || scrollProgress.current < 0.05) return
    const t = (scrollProgress.current - 0.05) / 0.95
    // Pure Y rotation only — nothing else changes
    spinRef.current.rotation.y = Math.PI * 12 * t
  })

  // All meshes centered at origin (visual center = 0)
  const cy = 0.175 // vertical center offset

  return (
    <group rotation={[0, 0, TILT]}>
      <group ref={spinRef}>
        <mesh position={[0, 0 - cy, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.6, 32]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.05} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95 - cy, 0]}>
          <cylinderGeometry args={[0.42, 0.45, 0.3, 32]} />
          <meshStandardMaterial color="#16213e" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.2 - cy, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.2, 32]} />
          <meshStandardMaterial color="#0f3460" metalness={0.15} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.85 - cy, 0]}>
          <cylinderGeometry args={[0.42, 0.38, 0.1, 32]} />
          <meshStandardMaterial color="#222244" metalness={0.1} roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

export default function Scene({ scrollProgress, useGlb = false }) {
  return (
    <>
      <ambientLight color={0xffffff} intensity={0.7} />
      <directionalLight
        position={[1, 2, 3]}
        intensity={1.0}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 0, -2]} intensity={0.5} />
      {useGlb ? (
        <ShakerModel scrollProgress={scrollProgress} />
      ) : (
        <PlaceholderModel scrollProgress={scrollProgress} />
      )}
    </>
  )
}
