import { motion } from 'framer-motion'
import Parallax from './Parallax'

const outcomes = [
  ['Método na ponta', 'Sua equipe deixa de “inventar o jeito” e passa a usar IA com padrão, segurança e qualidade.'],
  ['Aplicação no processo real', 'Você não leva slide genérico: leva IA encaixada nas tarefas e nos setores que realmente importam.'],
  ['Resultado que se sustenta', 'Capacitação, diagnóstico ou sistema — o objetivo é o ganho continuar depois do primeiro impulso.'],
]

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
    </svg>
  )
}

export default function About() {
  return (
    <section id="resultados" className="relative z-10 bg-void py-28 px-6 overflow-hidden">
      <Parallax speed={-0.2} className="absolute -right-40 top-0">
        <div className="w-[500px] h-[500px] bg-neon/5 rounded-full blur-[130px]" />
      </Parallax>
      <div className="max-w-[1400px] mx-auto md:px-6 grid lg:grid-cols-2 gap-14 items-center relative">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="hud !text-neon mb-4">[ 04 ] — O que muda para você</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Você não compra hype. <span className="boxed boxed-neon text-neon">Leva aplicação.</span>
          </h2>
          <div className="mt-6 space-y-5 text-mist text-lg leading-relaxed">
            <p>
              O foco é o seu resultado: equipe mais rápida, processos mais leves e IA no
              lugar certo da operação — sem promessa vazia e sem teoria que não cola na
              rotina.
            </p>
            <p>
              Quem te acompanha já formou{' '}
              <span className="text-ice font-medium">+2.000 profissionais em IA</span> e
              atua dentro de empresas, setor por setor. Na prática, isso vira tradução
              clara: do que a ferramenta faz para o que a sua área precisa entregar.
            </p>
          </div>
          <div className="mt-10 space-y-6">
            {outcomes.map(([title, desc], i) => (
              <div key={title} className="flex gap-5 items-start">
                <span className="hud !text-neon mt-1.5">/0{i + 1}</span>
                <div>
                  <p className="font-display font-medium text-xl">{title}</p>
                  <p className="text-mist mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/5551991882447"
            target="_blank"
            rel="noopener noreferrer"
            className="hud inline-block mt-10 border border-neon/60 !text-neon px-6 py-3 hover:bg-neon hover:!text-void transition-colors"
          >
            Quero esse resultado na minha empresa ↗
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto w-full"
        >
          <div className="relative border border-line bg-panel p-3">
            <div className="hud flex items-center justify-between px-1 pb-3">
              <span>QUEM TE AJUDA NA PRÁTICA</span>
              <span className="!text-neon">● DISPONÍVEL</span>
            </div>
            <img
              src="/lucas.webp"
              alt="Lucas Charão — ajuda empresas a aplicar IA com método na operação"
              width="480"
              height="600"
              className="w-full h-auto object-cover aspect-[4/5] grayscale-[25%] contrast-105"
              loading="lazy"
            />
            <div className="flex items-center justify-between pt-4 px-1 pb-1">
              <div>
                <p className="font-display font-semibold text-xl">Lucas Charão</p>
                <p className="hud mt-1">Prática · Método · Resultado</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/olucascharao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Lucas Charão"
                  className="w-10 h-10 border border-line flex items-center justify-center text-mist hover:text-neon hover:border-neon transition-colors"
                >
                  <InstagramIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/lucas-char%C3%A3o-b2b3a1163/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Lucas Charão"
                  className="w-10 h-10 border border-line flex items-center justify-center text-mist hover:text-neon hover:border-neon transition-colors"
                >
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon" />
        </motion.div>
      </div>
    </section>
  )
}
