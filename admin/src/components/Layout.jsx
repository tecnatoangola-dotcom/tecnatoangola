import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { api, clearSession, getAdmin } from '../api.js'

const LINKS = [
  { to: '/', label: 'Visão geral', icon: '01' },
  { to: '/candidaturas', label: 'Candidaturas', icon: '02' },
  { to: '/utilizadores', label: 'Utilizadores', icon: '03' },
  { to: '/relatorios', label: 'Relatórios', icon: '04' },
]

function NavLinks({ onNavigate, variant }) {
  return (
    <nav className={`flex ${variant === 'drawer' ? 'flex-col gap-1 px-4' : 'gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-0'}`}>
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex min-h-11 shrink-0 items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'border-brand bg-white/10 text-white' : 'border-transparent text-white/55 hover:border-white/40 hover:text-white'
            }`
          }
        >
          <span aria-hidden="true" className={`font-mono text-[10px] tracking-wider ${variant === 'drawer' ? '' : 'lg:text-white/40'}`}>
            {link.icon}
          </span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Brand({ small }) {
  return (
    <div className={`flex items-center gap-3 ${small ? 'px-5 py-4' : 'px-5 py-4 lg:px-6 lg:py-7'}`}>
      <img src="/logo.png" alt="TECNATO" className="h-9 w-auto" />
      <div>
        <p className="font-mono text-[11px] font-medium tracking-[0.18em]">ADMIN</p>
        <p className="mt-0.5 text-[11px] text-white/45">Centro de operações</p>
      </div>
    </div>
  )
}

export default function Layout() {
  const navigate = useNavigate()
  const admin = getAdmin()
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  async function logout() {
    await api('/logout', { method: 'POST', redirectOnUnauthorized: false }).catch(() => {})
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="hidden bg-ink text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-68 lg:shrink-0">
        <Brand />
        <p className="admin-label px-7 pb-3 text-white/35">Navegação</p>
        <NavLinks />
        <div className="absolute bottom-0 w-68 border-t border-white/10 px-6 py-5">
          <p className="truncate text-xs text-white/60">{admin?.name}</p>
          <p className="truncate text-[11px] text-white/40">{admin?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 min-h-9 font-mono text-[10px] font-medium tracking-[0.12em] text-brand uppercase hover:underline"
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      {drawer && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setDrawer(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-white transition-transform duration-200 lg:hidden ${
          drawer ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!drawer}
      >
        <div className="flex items-center justify-between pr-3">
          <Brand small />
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Fechar menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-lg"
          >
            ✕
          </button>
        </div>
        <div className="mt-2 flex-1 overflow-y-auto">
          <NavLinks variant="drawer" onNavigate={() => setDrawer(false)} />
        </div>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="truncate text-xs text-white/60">{admin?.name}</p>
          <p className="truncate text-[11px] text-white/40">{admin?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2 min-h-9 text-xs font-semibold text-brand hover:underline"
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur sm:px-6 lg:h-18 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg lg:hidden"
            >
              ☰
            </button>
            <div><p className="admin-label text-ink/45">TECNATO / Admin</p><p className="mt-0.5 truncate text-sm font-semibold">Painel de controlo</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-ink/55 sm:inline">{admin?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="min-h-9 rounded-full border border-ink/20 px-4 py-1.5 text-xs font-semibold hover:border-ink lg:hidden"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
