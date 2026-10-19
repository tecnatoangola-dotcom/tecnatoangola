import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { track } from '../lib/track.js'

export default function Registar() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }

    setBusy(true)
    try {
      const data = await signUp({ nome, email, password })
      if (data.user?.identities?.length === 0) {
        setError('Já existe uma conta com este email. Entra em vez disso.')
        return
      }
      track('registo')
      if (data.session) {
        navigate('/perfil')
      } else {
        setPendingEmail(email)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (pendingEmail) {
    return (
      <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
        <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Início
        </Link>
        <p className="section-label mt-6 text-brand-deep">Confirma o email</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Quase lá!</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Enviámos um link de confirmação para <strong>{pendingEmail}</strong>. Abre o email,
          confirma a conta e entra para enviares a tua candidatura.
        </p>
        <Link
          to="/entrar"
          className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
        >
          Já confirmo — ir para entrar
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <p className="section-label mt-6 text-brand-deep">Criar conta</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Junta-te ao TECNATO.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        Cria a tua conta para enviares o vídeo da candidatura e acompanhares o estado de verificação
        e aprovação.
      </p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <label className="mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="nome">
          Nome
        </label>
        <input
          id="nome"
          required
          autoComplete="name"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder="O teu nome"
        />

        <label className="mt-5 mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="email">
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder="Mínimo 6 caracteres"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'A criar conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/65">
        Já tens conta?{' '}
        <Link to="/entrar" className="font-semibold text-ink underline underline-offset-2">
          Entra aqui
        </Link>
      </p>
    </section>
  )
}
