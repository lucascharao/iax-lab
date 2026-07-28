import { motion } from 'framer-motion'

const WA = 'https://wa.me/5551991882447'

const steps = [
  {
    n: '1',
    title: 'Você mostra a operação',
    description:
      'Entendemos o negócio, os gargalos e onde consultoria de IA, treinamento ou desenvolvimento com IA geram ganho real.',
  },
  {
    n: '2',
    title: 'Você recebe o caminho certo',
    description:
      'Fica claro o formato: consultoria de IA, mentoria, curso, palestra de IA, desenvolvimento com IA — ou a combinação ideal.',
  },
  {
    n: '3',
    title: 'A IA entra na rotina',
    description:
      'O time aprende e aplica inteligência artificial no processo real. Quando precisa de ferramenta, o sistema com IA entra no fluxo do dia a dia.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section band-soft border-y border-line-soft">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="section-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <p className="eyebrow">Como funciona</p>
          <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-5xl">
            Da conversa à IA na rotina —{' '}
            <span className="accent-text">em 3 passos.</span>
          </h2>
        </motion.div>

        <div className="cards-center">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="surface p-7 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-neon text-white font-display text-lg font-semibold flex items-center justify-center mb-5 shadow-[0_8px_20px_rgba(12,122,82,0.3)]">
                {s.n}
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight mb-2">
                {s.title}
              </h3>
              <p className="text-mist leading-relaxed text-[0.95rem]">{s.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full sm:w-auto"
          >
            Começar pela conversa sobre IA
          </a>
          <p className="mt-3 text-sm text-mute">Sem compromisso · Resposta em até 24h</p>
        </div>
      </div>
    </section>
  )
}
