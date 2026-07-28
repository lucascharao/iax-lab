import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * Réplica 3D do mascote IAX: corpo toy branco, cabeça com anel verde neon,
 * tela preta com olhos que piscam. Cabeça+olhos seguem o mouse; flutuação
 * idle; rotação de corpo controlada pelo scroll (via prop progressRef).
 * Geometrias: RoundedBoxGeometry oficial do three (robusta) — a RoundedBox
 * do drei (extrude) gerava NaN com radius próximo de depth/2 e derrubava a GPU.
 */

const NEON = '#22e58c'

type RobotProps = {
  /** 0..1 — progresso do scroll do hero (escrito pelo ScrollTrigger fora do canvas) */
  progressRef: { current: number }
}

function useAssets() {
  return useMemo(() => {
    const white = new THREE.MeshStandardMaterial({
      color: '#e9edeb',
      roughness: 0.35,
      metalness: 0.05,
    })
    const dark = new THREE.MeshStandardMaterial({ color: '#101314', roughness: 0.5, metalness: 0.3 })
    const screen = new THREE.MeshStandardMaterial({ color: '#070a0b', roughness: 0.15, metalness: 0.1 })
    const neonRing = new THREE.MeshStandardMaterial({
      color: NEON,
      emissive: NEON,
      emissiveIntensity: 1.6,
      toneMapped: false,
    })
    const eye = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#e8fff4',
      emissiveIntensity: 1.5,
      toneMapped: false,
    })

    const rb = (w: number, h: number, d: number, r: number) =>
      new RoundedBoxGeometry(w, h, d, 5, Math.min(r, w / 2, h / 2, d / 2))

    const geo = {
      body: rb(1.15, 1.1, 0.78, 0.28),
      head: rb(1.42, 1.08, 0.9, 0.3),
      ring: rb(1.16, 0.84, 0.34, 0.17),
      screen: rb(1.0, 0.68, 0.3, 0.14),
      armUpper: rb(0.2, 0.42, 0.2, 0.09),
      armLower: rb(0.18, 0.3, 0.18, 0.08),
      leg: rb(0.24, 0.34, 0.24, 0.1),
      foot: rb(0.3, 0.16, 0.4, 0.07),
    }
    return { m: { white, dark, screen, neonRing, eye }, geo }
  }, [])
}

function ChestLogo() {
  // PNG já cropado no arquivo (291×432, sem padding) — textura usada sem mutação
  const logo = useTexture('/logo-chest.png', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })
  const h = 0.46
  const w = h * (291 / 432)
  return (
    <mesh position={[0, 0.08, 0.4]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={logo} transparent toneMapped={false} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  )
}

function Robot({ progressRef, coarse }: RobotProps & { coarse: boolean }) {
  const { m, geo } = useAssets()
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const eyeL = useRef<THREE.Mesh>(null)
  const eyeR = useRef<THREE.Mesh>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const blink = useRef({ next: 2.5, until: 0 })

  useFrame(({ pointer, clock }) => {
    const t = clock.elapsedTime
    const p = progressRef.current

    // touch (sem mouse): "ponteiro virtual" derivado do progresso do scroll —
    // cabeça e olhos varrem a cena conforme a página rola
    const px = coarse ? Math.sin(p * Math.PI * 2.5) * 0.7 : pointer.x
    const py = coarse ? -0.15 + Math.sin(p * Math.PI * 1.5) * 0.3 : pointer.y

    if (root.current) {
      root.current.position.y = Math.sin(t * 1.6) * 0.06 - 0.55
      root.current.rotation.y = p * Math.PI * 1.1 + Math.sin(t * 0.7) * 0.04 + px * 0.25
      root.current.rotation.x = Math.sin(t * 0.9) * 0.015
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, px * 0.55, 0.09)
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -py * 0.38, 0.09)
    }
    if (eyes.current) {
      eyes.current.position.x = THREE.MathUtils.lerp(eyes.current.position.x, px * 0.09, 0.12)
      eyes.current.position.y = THREE.MathUtils.lerp(eyes.current.position.y, 0.02 + py * 0.05, 0.12)
    }

    const b = blink.current
    if (t > b.next) {
      b.until = t + 0.12
      b.next = t + 2 + Math.random() * 3
    }
    const closing = t < b.until
    const sy = THREE.MathUtils.lerp(eyeL.current?.scale.y ?? 1, closing ? 0.08 : 1, 0.45)
    eyeL.current?.scale.setY(sy)
    eyeR.current?.scale.setY(sy)

    if (armL.current) armL.current.rotation.z = 0.12 + Math.sin(t * 1.6 + 1) * 0.07
    if (armR.current) armR.current.rotation.z = -0.12 - Math.sin(t * 1.6) * 0.07
  })

  return (
    <group ref={root}>
      {/* ===== corpo ===== */}
      <mesh geometry={geo.body} material={m.white} position={[0, 0.1, 0]} />
      {[-0.12, 0, 0.12].map((x) => (
        <mesh key={x} material={m.neonRing} position={[x, 0.42, 0.38]}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        <ChestLogo />
      </Suspense>

      {/* ===== braços ===== */}
      <group ref={armL} position={[-0.72, 0.28, 0]}>
        <mesh material={m.dark} position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh geometry={geo.armUpper} material={m.white} position={[-0.04, -0.3, 0]} />
        <mesh material={m.dark} position={[-0.06, -0.56, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh geometry={geo.armLower} material={m.white} position={[-0.08, -0.76, 0]} />
      </group>
      <group ref={armR} position={[0.72, 0.28, 0]}>
        <mesh material={m.dark} position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh geometry={geo.armUpper} material={m.white} position={[0.04, -0.3, 0]} />
        <mesh material={m.dark} position={[0.06, -0.56, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh geometry={geo.armLower} material={m.white} position={[0.08, -0.76, 0]} />
      </group>

      {/* ===== pernas ===== */}
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, -0.62, 0]}>
          <mesh material={m.dark} position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh geometry={geo.leg} material={m.white} position={[0, -0.18, 0]} />
          <mesh geometry={geo.foot} material={m.white} position={[0, -0.42, 0.05]} />
        </group>
      ))}

      {/* ===== cabeça ===== */}
      <group ref={head} position={[0, 1.18, 0]}>
        <mesh material={m.dark} position={[-0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
        </mesh>
        <mesh material={m.dark} position={[0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
        </mesh>
        <mesh geometry={geo.head} material={m.white} />
        {/* anel verde neon (moldura da face) */}
        <mesh geometry={geo.ring} material={m.neonRing} position={[0, 0, 0.32]} />
        {/* tela preta */}
        <mesh geometry={geo.screen} material={m.screen} position={[0, 0, 0.38]} />
        {/* olhos — esferas achatadas em Z; blink escala o Y */}
        <group ref={eyes} position={[0, 0.02, 0.56]}>
          <mesh ref={eyeL} material={m.eye} position={[-0.2, 0, 0]} scale={[1, 1, 0.3]}>
            <sphereGeometry args={[0.08, 20, 20]} />
          </mesh>
          <mesh ref={eyeR} material={m.eye} position={[0.2, 0, 0]} scale={[1, 1, 0.3]}>
            <sphereGeometry args={[0.08, 20, 20]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function RobotIAX({ progressRef, onContextLost }: RobotProps & { onContextLost?: () => void }) {
  // touch = sem mouse → robô menor e animado pelo scroll
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return (
    <Canvas
      camera={{ position: [0.4, 0.5, 4.6], fov: 38 }}
      dpr={[1, coarse ? 1.5 : 2]}
      // powerPreference 'default': iOS em Modo de Baixa Energia rejeita/perde
      // contextos 'high-performance' (default do R3F) — robô sumia no iPhone
      gl={{ antialias: !coarse, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => {
            e.preventDefault()
            onContextLost?.()
          },
          { once: true },
        )
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#f0f4f2" />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#cfe8dd" />
      <pointLight position={[-2.5, 0.5, 2.5]} intensity={4} color={NEON} distance={8} />
      <pointLight position={[0, -1, 3]} intensity={1.2} color={NEON} distance={6} />
      <group scale={coarse ? 0.72 : 1} position={coarse ? [0, 0.15, 0] : [0, 0, 0]}>
        <Robot progressRef={progressRef} coarse={coarse} />
      </group>
      <ContactShadows position={[0, coarse ? -1.4 : -1.75, 0]} opacity={0.55} scale={8} blur={2.4} far={3} color="#04120b" />
    </Canvas>
  )
}
