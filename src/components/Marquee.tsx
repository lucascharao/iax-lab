const items = [
  'Equipe mais rápida nas tarefas do dia a dia',
  'Menos erro e menos retrabalho com IA',
  'Processos mais leves, setor por setor',
  'IA com método, segurança e padrão',
  'Visibilidade e automação no que importa',
]

/** Barra de autoridade — faixa infinita logo abaixo do hero. */
export default function Marquee() {
  const row = [...items, ...items, ...items]
  return (
    <div className="relative z-10 border-y border-line bg-panel overflow-hidden py-5">
      <div className="flex w-max animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-display text-lg md:text-2xl font-medium text-ice px-8">{item}</span>
            <span className="text-neon text-xl">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </div>
  )
}
