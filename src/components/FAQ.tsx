import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

/** FAQ para SEO e AEO: perguntas no formato das buscas reais. */
const faqs = [
  {
    q: 'O que é consultoria de IA e como vocês trabalham?', a: 'Consultoria de IA é o diagnóstico e o desenho do caminho para a sua empresa usar inteligência artificial com método: o que priorizar, como o time deve trabalhar com padrão e segurança, e onde a IA gera ganho real na operação. Olhamos o negócio setor por setor, sem pacote genérico.', }, {
    q: 'Vocês oferecem treinamento de IA e curso de IA para equipes?', a: 'Sim. Treinamento de IA e curso prático no contexto real da empresa. A equipe aprende nas tarefas que já executa, com padrão, qualidade e segurança. Não é curso teórico de ferramenta.', }, {
    q: 'Fazem palestra de IA ou palestra com IA para eventos?', a: 'Sim. Palestra de IA sob medida para convenções, eventos, imersões de liderança e encontros corporativos. O conteúdo alinha a empresa e mostra o que o time pode fazer diferente com inteligência artificial no trabalho.', }, {
    q: 'O que inclui desenvolvimento com IA?', a: 'Sistemas, painéis, aplicações web e automações sob medida que usam inteligência artificial no processo. Menos trabalho manual, mais visibilidade para a gestão e ferramentas encaixadas na rotina real. O ensino ao time fica na consultoria, mentoria e treinamento; o desenvolvimento entrega a ferramenta.', }, {
    q: 'Quais soluções a IAX LAB oferece?', a: 'Cinco formatos: consultoria, mentoria, treinamento e curso para equipe, palestra e desenvolvimento (sistemas, painéis e automações sob medida).', }, {
    q: 'Atendem empresas de qualquer lugar do Brasil?', a: 'Sim. Consultoria de IA, treinamento, palestra e projetos de desenvolvimento com IA no formato presencial ou remoto, conforme a necessidade da empresa.', }, {
    q: 'Como começar sem compromisso?', a: 'Chame no WhatsApp. Em cerca de 30 minutos alinhamos o que priorizar e qual serviço faz mais sentido: consultoria de IA, curso, palestra ou desenvolvimento com IA. Sem pressão e sem pacote genérico.', },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section band-white">
      <div className="container-page max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="section-center mb-8 md:mb-10"
        >
          <p className="eyebrow">Dúvidas sobre IA</p>
          <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-5xl">
            Consultoria, curso, palestra e desenvolvimento.{' '}
            <span className="accent-text">A gente explica.</span>
          </h2>
        </motion.div>

        <div className="surface divide-y divide-line-soft overflow-hidden !p-0">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="px-5 sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left min-h-[56px] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-display text-base sm:text-lg font-semibold pr-2">
                    {f.q}
                  </h3>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                      isOpen
                        ? 'bg-neon border-neon text-white rotate-45'
                        : 'border-line text-neon bg-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-mist leading-relaxed text-[0.95rem]">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
