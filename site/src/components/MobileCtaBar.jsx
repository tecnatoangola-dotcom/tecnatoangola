import { Link } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants.js'

export default function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md sm:hidden">
      <div className="flex items-center gap-2">
        <Link
          to="/candidatura"
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          Apresentar projecto
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar por WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white text-lg"
        >
          ✆
        </a>
      </div>
    </div>
  )
}
