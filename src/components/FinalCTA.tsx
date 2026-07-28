import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const WA = 'https://wa.me/5551991882447'

export default function FinalCTA() {
  return (
    <section id="contato" className="section">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="band-dark rounded-[1.75rem] px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-16 text-center shadow-[0_24px_60px_rgba(11,31,24,0.25)]"
        >
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-emerald-200/90 mb-4">
            Próximo passo
          </p>
          <h2 className="font-display text-[1.65rem] sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-white mb-4 sm:mb-5 max-w-3xl mx-auto">
            Consultoria de IA, curso, palestra ou desenvolvimento com IA —{' '}
            <span className="text-emerald-300">começa na próxima conversa.</span>
          </h2>
          <p className="text-emerald-50/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Em cerca de 30 minutos você sai com clareza do que priorizar em inteligência
            artificial e qual serviço faz sentido — sem compromisso.
          </p>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-on-dark text-base !px-7 sm:!px-8 !py-3.5 w-full sm:w-auto"
          >
            Falar no WhatsApp sobre IA
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-sm text-emerald-100/60">Resposta em até 24h</p>
        </motion.div>
      </div>
    </section>
  )
}
