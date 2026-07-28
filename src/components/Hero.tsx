import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const WA = 'https://wa.me/5551991882447'

const OFFERINGS = [
  'Consultoria de IA',
  'Mentoria em IA',
  'Treinamento e Curso de IA',
  'Palestra de IA',
  'Desenvolvimento com IA',
]

const PROOFS = [
  'IA com método na operação',
  '+2.000 profissionais formados em IA',
  'Presencial e remoto no Brasil',
]

/**
 * Hero light + confiante — focado em empresário (clareza, prova, CTA).
 * H1 e lead otimizados para SEO/AEO: consultoria, treinamento, palestra e desenvolvimento com IA.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
      <div className="glow-orb w-[420px] h-[420px] -top-24 right-[-10%] opacity-80" />
      <div className="glow-orb w-[300px] h-[300px] bottom-0 left-[-8%] opacity-50" />

      <div className="container-page relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center lg:items-start gap-3 mb-1"
            >
              <img
                src="/logo-iax.png"
                alt="IAX LAB — consultoria e treinamento de inteligência artificial"
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shadow-md ring-1 ring-black/10 lg:hidden"
                width="96"
                height="96"
              />
              <p className="eyebrow lg:justify-start justify-center !mb-0">
                Inteligência artificial para donos e líderes de empresa
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="heading-xl text-[2.1rem] sm:text-5xl md:text-[3.2rem] mb-4 sm:mb-5"
            >
              Consultoria, treinamento e palestra de IA.
              <br />
              <span className="accent-text">Método real na operação.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lead mb-6 mx-auto lg:mx-0 text-[1.05rem]"
            >
              Ensinamos e estruturamos o time para usar inteligência artificial com
              padrão e segurança — e fazemos desenvolvimento com IA quando a operação
              precisa de sistema, automação ou ferramenta sob medida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mb-7"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-mute mb-2.5">
                Serviços de IA
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {OFFERINGS.map((name) => (
                  <a key={name} href="#servicos" className="chip hover:border-neon/40 transition-colors">
                    {name}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full sm:w-auto"
              >
                Quero IA com método na minha empresa
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#servicos" className="btn btn-secondary w-full sm:w-auto">
                Ver serviços de IA
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26 }}
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-x-5 sm:gap-y-2 justify-center lg:justify-start text-sm text-mist"
            >
              {PROOFS.map((p) => (
                <li key={p} className="inline-flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                  {p}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="relative max-w-md mx-auto w-full"
          >
            <div className="surface overflow-hidden p-2 sm:p-2.5">
              <img
                src="/lucas-hero.jpg"
                alt="Lucas Charão — consultoria de IA, treinamento de IA e palestras de inteligência artificial para empresas"
                width="480"
                height="720"
                className="w-full aspect-[4/5] object-cover object-top rounded-[1.1rem]"
                fetchPriority="high"
              />
              <div className="px-3 sm:px-4 py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-lg text-ice">Lucas Charão</p>
                  <p className="text-sm text-mist mt-0.5">
                    Consultor de IA · Mentor · Palestrante
                  </p>
                </div>
                <span className="chip-accent text-xs whitespace-nowrap">Disponível</span>
              </div>
            </div>

            {/* floating trust card */}
            <div className="hidden sm:block absolute -left-4 bottom-24 surface !rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(15,24,20,0.12)]">
              <p className="font-display text-2xl font-semibold text-neon">+2.000</p>
              <p className="text-xs text-mist font-medium">profissionais formados em IA</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
