import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Mic2,
  Code2,
} from 'lucide-react'

const WA = 'https://wa.me/5551991882447'

const services = [
  {
    icon: BriefcaseBusiness,
    name: 'Consultoria de IA',
    description:
      'Diagnóstico e caminho claro: onde a inteligência artificial gera ganho real, o que priorizar e como estruturar o uso de IA no dia a dia com padrão e segurança.',
    cta: 'Quero consultoria de IA',
  },
  {
    icon: Compass,
    name: 'Mentoria em IA',
    description:
      'Acompanhamento próximo de líderes e times para aplicar IA com método na rotina real. Menos teoria, mais decisão e execução com inteligência artificial.',
    cta: 'Quero mentoria em IA',
  },
  {
    icon: GraduationCap,
    name: 'Treinamento e Curso de IA',
    description:
      'Capacitação prática e curso de IA para a equipe aprender nas tarefas que já executa — com padrão, qualidade e segurança no uso de ferramentas de inteligência artificial.',
    cta: 'Treinar minha equipe em IA',
  },
  {
    icon: Mic2,
    name: 'Palestra de IA',
    description:
      'Palestra com IA sob medida para convenções, eventos e imersões de liderança. Alinha a empresa e mostra o que o time pode fazer diferente com inteligência artificial.',
    cta: 'Levar palestra de IA ao meu evento',
  },
  {
    icon: Code2,
    name: 'Desenvolvimento com IA',
    description:
      'Sistemas, painéis, aplicações web e automações com IA sob medida. Menos trabalho manual, mais visibilidade e inteligência artificial encaixada no processo.',
    cta: 'Solicitar desenvolvimento com IA',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="section band-white border-y border-line-soft">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="section-center max-w-2xl mx-auto mb-8 md:mb-12"
        >
          <p className="eyebrow">Serviços de inteligência artificial</p>
          <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-5xl mb-4">
            Consultoria, curso, palestra e desenvolvimento com IA —{' '}
            <span className="accent-text">claro e direto.</span>
          </h2>
          <p className="lead">
            Cinco formatos para a sua empresa usar IA de verdade: ensinar o time,
            estruturar a operação e desenvolver com IA quando a rotina precisa de
            ferramenta sob medida.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10">
          {services.map((s) => (
            <span key={s.name} className="chip-accent">
              {s.name}
            </span>
          ))}
        </div>

        {/* Grid centralizado: 3 em cima + 2 embaixo no desktop */}
        <div className="cards-center">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.a
                key={s.name}
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05 }}
                className="card group p-6 sm:p-7 flex flex-col text-center items-center min-h-[280px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-soft border border-neon/15 flex items-center justify-center text-neon">
                  <Icon className="w-5 h-5" strokeWidth={1.85} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight group-hover:text-neon transition-colors">
                  {s.name}
                </h3>
                <p className="mt-3 text-mist text-[0.95rem] leading-relaxed flex-1">
                  {s.description}
                </p>
                <span className="mt-5 text-sm font-bold text-neon inline-flex items-center gap-1">
                  {s.cta}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
