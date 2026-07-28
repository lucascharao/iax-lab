import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/scroll'

const HEADLINE =
  'Sua equipe já usa IA. O risco é usar sem método, sem segurança e sem padrão.'

/**
 * Seção problema — headline gigante com palavras que "acendem" no scroll
 * (scrub + stagger), seguida da dor do empresário e CTA.
 */
export default function Statement() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll('.word')
      if (!words?.length) return
      gsap.fromTo(
        words,
        { opacity: 0.14, color: '#8f9694' },
        {
          opacity: 1,
          color: '#eceeed',
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.4,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative z-10 bg-void py-32 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="hud !text-neon mb-8">[ 02 ] — O que está em jogo</p>
        <h2 className="font-display text-3xl md:text-5xl font-medium leading-[1.25] tracking-tight">
          {HEADLINE.split(' ').map((w, i) => (
            <span key={i} className="word inline-block mr-[0.28em]">
              {w}
            </span>
          ))}
        </h2>
        <div className="mt-10 max-w-3xl space-y-5 text-mist text-lg leading-relaxed">
          <p>
            Quando cada pessoa inventa o próprio jeito de usar ChatGPT e outras
            ferramentas, você paga o preço: tempo perdido, qualidade irregular e risco
            de expor informação sensível — sem perceber o tamanho do buraco.
          </p>
          <p>
            Com o uso estruturado, sua operação ganha velocidade e reduz custo. Sem
            estrutura, você compete com quem entrega em horas o que ainda leva dias.
          </p>
        </div>
        <a
          href="https://wa.me/5551991882447"
          target="_blank"
          rel="noopener noreferrer"
          className="hud inline-block mt-10 border border-neon/60 !text-neon px-6 py-3 hover:bg-neon hover:!text-void transition-colors"
        >
          Quero organizar o uso de IA na minha empresa ↗
        </a>
      </div>
    </section>
  )
}
