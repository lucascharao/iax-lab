import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/scroll'

type Props = {
  children: ReactNode
  /** velocidade relativa: negativo sobe mais devagar (fundo), positivo desce (frente) */
  speed?: number
  className?: string
}

/** Wrapper de parallax por scroll  -  move o conteúdo em Y proporcional ao scroll (scrub). */
export default function Parallax({ children, speed = -0.15, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.to(el, {
      y: () => speed * window.innerHeight, ease: 'none', scrollTrigger: {
        trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, }, })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export { ScrollTrigger }
