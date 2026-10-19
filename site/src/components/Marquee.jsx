const WORDS = [
  'Gestão',
  'Administração',
  'Ciência',
  'Inovação',
  'Empreendedorismo',
  'Tecnologia',
  'Impacto Social',
  'Invenções',
  'Investigação',
  'Criatividade',
]

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4 text-white">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {WORDS.map((word) => (
              <span key={word} className="flex items-center gap-8">
                <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase sm:text-base">
                  {word}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-brand" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
