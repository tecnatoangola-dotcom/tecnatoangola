import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL, NAV_LINKS, SITE_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from '../constants.js'

const REDES_SOCIAIS = [
  {
    nome: 'TikTok',
    href: 'https://www.tiktok.com/@tecnatoangola',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    nome: 'Instagram',
    href: 'https://www.instagram.com/tecnatoangola/',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2m0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    ),
  },
  {
    nome: 'Facebook',
    href: 'https://www.facebook.com/tecnatoangola',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
      </svg>
    ),
  },
]

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

            <div className="mt-6 flex items-center gap-3">
              <p className="section-label text-white/40">Redes</p>
              <div className="flex gap-2.5">
                {REDES_SOCIAIS.map((rede) => (
                  <a
                    key={rede.nome}
                    href={rede.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`TECNATO no ${rede.nome}`}
                    title={`TECNATO no ${rede.nome}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-brand hover:text-brand"
                  >
                    {rede.icone}
                  </a>
                ))}
              </div>
            </div>
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
              <li>
                <a href={SITE_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-brand">
                  tecnatoangola.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} TECNATO — A luz para os génios da banda.{' '}
            <Link to="/politica-de-privacidade" className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand">
              Política de privacidade
            </Link>
          </p>
          <p className="tracking-[0.18em] uppercase">Dos bairros às universidades · De Luanda para Angola</p>
        </div>
      </div>
    </footer>
  )
}
