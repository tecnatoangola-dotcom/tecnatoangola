import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSession } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Credenciais inválidas.')
      setSession(body.admin)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center rounded-2xl bg-white px-5 py-4">
          <img src="/logo.png" alt="TECNATO" className="h-16 w-auto" />
        </div>

        <p className="mt-6 text-center font-display text-sm font-semibold tracking-[0.2em] text-brand uppercase">
          Painel Admin
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-white">Entrar no CRM</h1>

        {error && (
          <div className="mt-5 rounded-xl border border-red-400/50 bg-red-500/15 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-white/70">
              Email de administrador
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
              placeholder="admin@tenato.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-white/70">
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-brand-deep disabled:opacity-50"
          >
            {busy ? 'A entrar…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Acesso restrito à equipa directiva do TECNATO.
        </p>
      </div>
    </div>
  )
}
