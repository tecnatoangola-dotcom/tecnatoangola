import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL, NAV_LINKS, WHATSAPP_NUMBER, WHATSAPP_URL } from '../constants.js'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareData = {
      title: 'TECNATO — A luz para os génios da banda',
      text: 'Conhece o TECNATO: a plataforma que dá visibilidade aos talentos e projectos de Angola.',
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* utilizador cancelou a partilha */
    }
  }

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/logo/TECNATO.png"
              alt="TECNATO"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              O talento merece ser visto. As ideias merecem ser ouvidas. O potencial merece uma
              oportunidade.
            </p>
            <button
              type="button"
              onClick={handleShare}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              Partilhar o TECNATO
              <span aria-hidden="true">↗</span>
            </button>
            {copied && (
              <p className="mt-2 text-xs text-brand">Link copiado — ajuda-nos a encontrar os génios.</p>
            )}
          </div>

          <nav className="lg:col-span-3">
            <p className="section-label text-white/40">Navegação</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-brand"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="section-label text-white/40">Contactos oficiais</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-brand">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-brand"
                >
                  WhatsApp: +{WHATSAPP_NUMBER}
                </a>
              </li>
              <li>Local de arranque: Luanda, Angola</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} TECNATO — A luz para os génios da banda.</p>
          <p className="tracking-[0.18em] uppercase">Dos bairros às universidades · De Luanda para Angola</p>
        </div>
      </div>
    </footer>
  )
}
