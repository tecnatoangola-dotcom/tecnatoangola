import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS, WHATSAPP_URL } from '../constants.js'
import { useAuth } from '../lib/authContext.js'

const DESKTOP_LINKS = NAV_LINKS.filter((link) =>
  ['O projecto', 'Áreas', 'Como funciona', 'Quem somos'].includes(link.label),
)

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-[1440px] items-center justify-between gap-4 border-x border-line px-5 sm:h-18 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <Link to="/" aria-label="TECNATO — início" className="flex items-center lg:justify-self-start">
            <img
              src="/logo/TECNATO.png"
              alt="TECNATO"
              className="h-9 w-auto sm:h-10"
              width="1772"
              height="905"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {DESKTOP_LINKS.map((link) =>
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-3 py-2 font-mono text-[10px] tracking-[0.11em] uppercase text-ink/65 transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:text-ink hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 font-mono text-[10px] tracking-[0.11em] uppercase text-ink/65 transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:text-ink hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex h-full items-center gap-0 lg:justify-self-end">
            <Link
              to={user ? '/perfil' : '/entrar'}
              className="hidden h-full items-center px-4 font-mono text-[10px] tracking-[0.12em] uppercase text-ink/65 transition-colors hover:text-ink sm:flex"
            >
              {user ? 'Perfil' : 'Entrar'}
            </Link>
            <Link
              to="/candidatura"
              className="hidden h-10 items-center bg-ink px-5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-white transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-ink sm:inline-flex"
            >
              Apresentar projecto
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-ink" />
                <span className="absolute inset-x-0 top-1.5 h-0.5 bg-ink" />
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-60 flex flex-col bg-ink text-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <div className="rounded-lg bg-white px-3 py-2">
              <img src="/logo/TECNATO.png" alt="TECNATO" className="h-8 w-auto" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-xl"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-white/10 font-display text-xl font-semibold"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-white/10 font-display text-xl font-semibold"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <Link
                to="/candidatura"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-ink"
              >
                Apresentar o meu projecto
              </Link>
              <Link
                to={user ? '/perfil' : '/entrar'}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold"
              >
                {user ? 'O meu perfil' : 'Entrar / Criar conta'}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold"
              >
                Falar por WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
