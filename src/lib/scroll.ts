import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Inicializa Lenis (smooth scrolling) sincronizado com o GSAP ScrollTrigger. */
export function initSmoothScroll() {
  // evita restauração de scroll do navegador brigando com o pin do hero
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // âncoras (#servicos, #sobre, #contato) passam pelo Lenis
  const onClick = (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
    if (!anchor) return
    const id = anchor.getAttribute('href')
    if (!id || id === '#') return
    const el = document.querySelector(id)
    if (el) {
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -72 })
    }
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    gsap.ticker.remove((time) => lenis.raf(time * 1000))
    lenis.destroy()
  }
}

export { gsap, ScrollTrigger }
