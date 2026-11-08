import { useIdioma } from '../i18n/idioma.jsx'

// Alternador PT | EN. `tom` controla as cores para cabeçalho claro ou menu escuro.
export default function SeletorIdioma({ tom = 'claro', className = '' }) {
  const { lang, setLang } = useIdioma()
  const escuro = tom === 'escuro'

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={`inline-flex items-center border ${escuro ? 'border-white/25' : 'border-line'} ${className}`}
    >
      {[
        ['pt', 'PT', 'Português'],
        ['en', 'EN', 'English'],
      ].map(([codigo, curto, nome], indice) => {
        const ativo = lang === codigo
        return (
          <button
            key={codigo}
            type="button"
            onClick={() => setLang(codigo)}
            aria-pressed={ativo}
            aria-label={nome}
            title={nome}
            className={[
              'flex h-8 min-w-9 items-center justify-center px-2 font-mono text-[10px] font-medium tracking-[0.12em] uppercase transition-colors',
              indice > 0 ? (escuro ? 'border-l border-white/25' : 'border-l border-line') : '',
              ativo
                ? escuro
                  ? 'bg-brand text-ink'
                  : 'bg-ink text-white'
                : escuro
                  ? 'text-white/70 hover:text-white'
                  : 'text-ink/60 hover:text-ink',
            ].join(' ')}
          >
            {curto}
          </button>
        )
      })}
    </div>
  )
}
