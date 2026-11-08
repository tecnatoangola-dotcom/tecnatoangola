import { Link } from 'react-router-dom'
import { whatsappUrl } from '../constants.js'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: { apresentar: 'Apresentar projecto', whatsapp: 'Falar por WhatsApp' },
  en: { apresentar: 'Present project', whatsapp: 'Chat on WhatsApp' },
}

export default function MobileCtaBar() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md sm:hidden">
      <div className="flex items-center gap-2">
        <Link
          to="/candidatura"
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          {c.apresentar}
        </Link>
        <a
          href={whatsappUrl(lang)}
          target="_blank"
          rel="noreferrer"
          aria-label={c.whatsapp}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white text-lg"
        >
          ✆
        </a>
      </div>
    </div>
  )
}
