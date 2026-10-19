import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'

export default function Entrar() {
  const { signIn } = useAuth()
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
      await signIn({ email, password })
      navigate('/perfil')
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email ou palavra-passe incorrectos.'
          : err.message,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <p className="section-label mt-6 text-brand-deep">Entrar</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Bem-vindo de volta.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        Entra para acompanhares o estado das tuas candidaturas ao TECNATO.
      </p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <label className="mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder="equipa@email.com"
        />

        <label className="mt-5 mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="password">
          Palavra-passe
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'A entrar…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/65">
        Ainda não tens conta?{' '}
        <Link to="/registar" className="font-semibold text-ink underline underline-offset-2">
          Cria aqui
        </Link>
      </p>
    </section>
  )
}
