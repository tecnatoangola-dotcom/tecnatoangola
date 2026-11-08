import { useIdioma } from '../i18n/idioma.jsx'

const PALAVRAS = {
  pt: [
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
  ],
  en: [
    'Management',
    'Administration',
    'Science',
    'Innovation',
    'Entrepreneurship',
    'Technology',
    'Social Impact',
    'Inventions',
    'Research',
    'Creativity',
  ],
}

export default function Marquee() {
  const { lang } = useIdioma()
  const palavras = PALAVRAS[lang]

  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4 text-white">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {palavras.map((word) => (
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
