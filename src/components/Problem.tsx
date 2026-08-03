import { motion } from 'framer-motion'
import { WA } from '../lib/whatsapp'

const pains = [
  {
    title: 'Cada um usa IA do seu jeito',
    text: 'Sem método e sem padrão, o time gasta tempo com ChatGPT e outras ferramentas, entrega qualidade irregular e o resultado não escala.',
  },
  {
    title: 'Risco sem perceber',
    text: 'IA usada sem orientação expõe informação sensível e gera decisão frágil. Você só descobre quando o problema já existe.',
  },
  {
    title: 'Quem estrutura a IA sai na frente',
    text: 'Empresas com consultoria, treinamento de IA e processo claro entregam em horas o que ainda leva dias na operação solta.',
  },
]

export default function Problem() {
  return (
    <section className="section band-soft">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="section-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <p className="eyebrow">O que está em jogo com a IA</p>
          <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-4xl mb-4">
            Sua equipe já usa inteligência artificial.
            <span className="text-mist font-medium"> O risco é usar sem método.</span>
          </h2>
          <p className="lead">
            Quando o uso de IA é improvisado, você paga em retrabalho, inconsistência,
            risco de dados e oportunidade perdida. Quem tem método acelera.
          </p>
        </motion.div>

        <div className="cards-center">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="surface p-6 sm:p-7 text-center"
            >
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-neon-soft text-neon text-sm font-bold">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg sm:text-xl font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-mist text-[0.95rem] leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full sm:w-auto"
          >
            Quero organizar o uso de IA
          </a>
        </div>
      </div>
    </section>
  )
}
