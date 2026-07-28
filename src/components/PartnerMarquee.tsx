const partners = [
  {
    name: 'Academia Lendária',
    src: '/partners/academia-lendaria.png',
    // recortada + leve boost para igualar peso visual da Mutumilk
    scale: 'scale-[1.12]',
  },
  {
    name: 'Foco no Comercial',
    src: '/partners/foco-no-comercial.png',
    scale: '',
  },
  {
    name: 'Instituto Max Tovar',
    src: '/partners/instituto-max-tovar.png',
    scale: '',
  },
  {
    name: 'Laticínios Mutumilk',
    src: '/partners/mutumilk.png',
    scale: '',
  },
]

/** Letreiro infinito — todas as logos no mesmo tamanho visual (padrão Mutumilk). */
export default function PartnerMarquee() {
  const row = [...partners, ...partners, ...partners]

  return (
    <section
      className="relative z-10 border-y border-[#163028] bg-[#0b1f18]"
      aria-label="Empresas que já confiaram"
    >
      <div className="container-page pt-6 sm:pt-8 pb-3 text-center">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-emerald-200/70">
          Empresas e marcas com as quais já atuei
        </p>
      </div>

      <div className="relative overflow-hidden pb-7 sm:pb-9">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#0b1f18] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#0b1f18] to-transparent"
          aria-hidden
        />

        <div className="partner-marquee-track flex w-max items-center hover:[animation-play-state:paused]">
          {row.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex items-center justify-center shrink-0 px-6 sm:px-10 md:px-12"
            >
              {/* Slot fixo = mesmo tamanho da Mutumilk para todas */}
              <div className="h-12 sm:h-14 w-[180px] sm:w-[220px] flex items-center justify-center">
                <img
                  src={p.src}
                  alt={p.name}
                  className={`max-h-full max-w-full w-auto h-auto object-contain opacity-95 hover:opacity-100 transition-opacity select-none ${p.scale}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .partner-marquee-track {
          animation: partner-marquee 28s linear infinite;
        }
        @keyframes partner-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
