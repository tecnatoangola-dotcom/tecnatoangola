import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL, NAV_LINKS, NAV_TEXTOS, whatsappUrl } from '../constants.js'
import { useIdioma } from '../i18n/idioma.jsx'

const REDES_SOCIAIS = [
  {
    nome: 'TikTok',
    href: 'https://www.tiktok.com/@tecnatoangola',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    nome: 'Instagram',
    href: 'https://www.instagram.com/tecnatoangola/',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2m0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    ),
  },
  {
    nome: 'Facebook',
    href: 'https://www.facebook.com/tecnatoangola',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
      </svg>
    ),
  },
  {
    nome: 'WhatsApp',
    href: whatsappUrl('pt'),
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.37-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
      </svg>
    ),
  },
  {
    nome: 'YouTube',
    href: 'https://www.youtube.com/@tecnatoangola',
    icone: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

const YEAR = new Date().getFullYear()

const T = {
  pt: {
    partilhar: 'Partilhar o TECNATO',
    copiado: 'Link copiado — ajuda-nos a encontrar os génios.',
    navegacao: 'Navegação',
    contactos: 'Contactos oficiais',
    local: 'Local de arranque: Luanda, Angola',
    privacidade: 'Política de privacidade',
    assinatura: 'Dos bairros às universidades · De Luanda para Angola',
    partilhaTitulo: 'TECNATO — A luz para os génios da banda',
    partilhaTexto: 'Conhece o TECNATO: a plataforma que dá visibilidade aos talentos e projectos de Angola.',
    redes: 'TECNATO no',
    lema: 'O talento merece ser visto. As ideias merecem ser ouvidas. O potencial merece uma oportunidade.',
  },
  en: {
    partilhar: 'Share TECNATO',
    copiado: 'Link copied — help us find the geniuses.',
    navegacao: 'Navigation',
    contactos: 'Official contacts',
    local: 'Starting point: Luanda, Angola',
    privacidade: 'Privacy policy',
    assinatura: 'From neighbourhoods to universities · From Luanda to Angola',
    partilhaTitulo: 'TECNATO — The light for the neighbourhood geniuses',
    partilhaTexto: 'Meet TECNATO: the platform that gives visibility to Angola’s talents and projects.',
    redes: 'TECNATO on',
    lema: 'Talent deserves to be seen. Ideas deserve to be heard. Potential deserves an opportunity.',
  },
}

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const { lang } = useIdioma()
  const c = T[lang]
  const nav = NAV_TEXTOS[lang]

  async function handleShare() {
    const shareData = {
      title: c.partilhaTitulo,
      text: c.partilhaTexto,
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
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{c.lema}</p>
            <button
              type="button"
              onClick={handleShare}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              {c.partilhar}
              <span aria-hidden="true">↗</span>
            </button>
            {copied && <p className="mt-2 text-xs text-brand">{c.copiado}</p>}

            <div className="mt-6 flex items-center gap-5">
              {REDES_SOCIAIS.map((rede) => (
                <a
                  key={rede.nome}
                  href={rede.nome === 'WhatsApp' ? whatsappUrl(lang) : rede.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${c.redes} ${rede.nome}`}
                  title={`${c.redes} ${rede.nome}`}
                  className="text-white/60 transition-colors hover:text-brand"
                >
                  {rede.icone}
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-3">
            <p className="section-label text-white/40">{c.navegacao}</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-brand"
                    >
                      {nav[link.chave]}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-brand"
                    >
                      {nav[link.chave]}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="section-label text-white/40">{c.contactos}</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-brand">
                  {EMAIL}
                </a>
              </li>
              <li>{c.local}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} TECNATO — {c.partilhaTitulo.split('— ')[1] || ''}{' '}
            <Link
              to="/politica-de-privacidade"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand"
            >
              {c.privacidade}
            </Link>
          </p>
          <p className="uppercase tracking-[0.18em]">{c.assinatura}</p>
        </div>
      </div>
    </footer>
  )
}
