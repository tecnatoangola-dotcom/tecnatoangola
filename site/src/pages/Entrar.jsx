import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    seoTitulo: 'Entrar',
    inicio: '← Início',
    label: 'Entrar',
    titulo: 'Bem-vindo de volta.',
    intro: 'Entra para acompanhares o estado das tuas candidaturas ao TECNATO.',
    email: 'Email',
    password: 'Palavra-passe',
    entrar: 'Entrar',
    aEntrar: 'A entrar…',
    erroCredenciais: 'Email ou palavra-passe incorrectos.',
    esqueci: 'Esqueceste a palavra-passe?',
    recuperar: 'Recuperar aqui',
    semConta: 'Ainda não tens conta?',
    criar: 'Cria aqui',
  },
  en: {
    seoTitulo: 'Sign in',
    inicio: '← Home',
    label: 'Sign in',
    titulo: 'Welcome back.',
    intro: 'Sign in to follow the status of your TECNATO applications.',
    email: 'Email',
    password: 'Password',
    entrar: 'Sign in',
    aEntrar: 'Signing in…',
    erroCredenciais: 'Incorrect email or password.',
    esqueci: 'Forgot your password?',
    recuperar: 'Recover it here',
    semConta: "Don't have an account yet?",
    criar: 'Create one here',
  },
}

export default function Entrar() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    caminho: '/entrar',
    noindex: true,
  })

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
          ? c.erroCredenciais
          : err.message,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        {c.inicio}
      </Link>

      <p className="section-label mt-6 text-brand-deep">{c.label}</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.titulo}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        {c.intro}
      </p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <label className="mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="email">
          {c.email}
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
          {c.password}
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
          {busy ? c.aEntrar : c.entrar}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink/65">
        {c.esqueci}{' '}
        <Link to="/recuperar" className="font-semibold text-ink underline underline-offset-2">
          {c.recuperar}
        </Link>
      </p>

      <p className="mt-5 text-center text-sm text-ink/65">
        {c.semConta}{' '}
        <Link to="/registar" className="font-semibold text-ink underline underline-offset-2">
          {c.criar}
        </Link>
      </p>
    </section>
  )
}
