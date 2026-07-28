const items = [
  { value: '5', label: 'serviços de IA para a operação' },
  { value: '+2.000', label: 'profissionais formados em IA' },
  { value: '+2 anos', label: 'em empresas e em sala' },
  { value: 'BR', label: 'presencial e remoto' },
]

export default function TrustBar() {
  return (
    <section className="relative z-10 border-y border-line-soft bg-white">
      <div className="container-page py-7 sm:py-9">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ice">
                {item.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-mist leading-snug max-w-[12rem] mx-auto">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
