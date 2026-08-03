import { motion } from 'framer-motion'
import { WA } from '../lib/whatsapp'

const outcomes = [
  {
    title: 'Método na ponta', text: 'Sua equipe deixa de improvisar com ChatGPT e passa a usar IA com padrão, segurança e qualidade.', }, {
    title: 'Aplicação no processo real', text: 'Consultoria, treinamento e curso de IA encaixados nas tarefas e nos setores que realmente importam. Sem slide genérico.', }, {
    title: 'Resultado que se sustenta', text: 'Consultoria de IA, mentoria, palestra, curso ou desenvolvimento com IA: o ganho continua depois do primeiro impulso.', },
]

export default function Proof() {
  return (
    <section id="resultados" className="section">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center lg:text-left"
          >
            <p className="eyebrow lg:justify-start justify-center">O que muda para você</p>
            <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-5xl mb-4">
              Você não compra moda de IA.
              <br />
              <span className="accent-text">Leva aplicação.</span>
            </h2>
            <p className="lead mb-8 mx-auto lg:mx-0">
              O foco é ensinar e estruturar inteligência artificial: equipe mais rápida, processos mais leves e clareza do que priorizar, com quem já formou
              +2.000 profissionais em IA.
            </p>

            <div className="space-y-5 text-left max-w-lg mx-auto lg:mx-0">
              {outcomes.map((o, i) => (
                <div key={o.title} className="flex gap-3 sm:gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-neon-soft flex items-center justify-center shrink-0">
                    <span className="text-neon text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-semibold">{o.title}</h3>
                    <p className="text-mist text-[0.95rem] mt-1 leading-relaxed">{o.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex justify-center lg:justify-start">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full sm:w-auto"
              >
                Quero esse resultado com IA
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.08 }}
            className="surface p-6 sm:p-8 md:p-10"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-neon mb-3">
              Para quem é
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Empresários e líderes que querem IA com resultado, não moda.
            </h3>
            <ul className="space-y-3 text-mist text-[0.98rem]">
              <li className="flex gap-2">
                <span className="text-neon font-bold">→</span>
                Donos de empresa que veem o time usando IA sem padrão
              </li>
              <li className="flex gap-2">
                <span className="text-neon font-bold">→</span>
                Gestores que precisam de treinamento de IA com método e segurança
              </li>
              <li className="flex gap-2">
                <span className="text-neon font-bold">→</span>
                Quem quer desenvolvimento com IA sem complicar a operação
              </li>
              <li className="flex gap-2">
                <span className="text-neon font-bold">→</span>
                Eventos e lideranças que precisam de palestra de IA para alinhar a empresa
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
