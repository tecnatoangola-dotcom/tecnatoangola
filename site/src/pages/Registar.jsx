import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { track } from '../lib/track.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    seoTitulo: 'Criar conta',
    seoDescricao:
      'Cria a tua conta TECNATO para acompanhar as tuas candidaturas e receber oportunidades.',
    inicio: '← Início',
    confirmarLabel: 'Confirma o email',
    confirmarTitulo: 'Quase lá!',
    confirmarTexto1: 'Enviámos um link de confirmação para',
    confirmarTexto2:
      '. Abre o email, confirma a conta e entra para enviares a tua candidatura.',
    confirmarBotao: 'Já confirmo — ir para entrar',
    label: 'Criar conta',
    titulo: 'Junta-te ao TECNATO.',
    intro:
      'Cria a tua conta para enviares o vídeo da candidatura e acompanhares o estado de verificação e aprovação.',
    nome: 'Nome',
    nomePlaceholder: 'O teu nome',
    email: 'Email',
    password: 'Palavra-passe',
    passwordPlaceholder: 'Mínimo 6 caracteres',
    criar: 'Criar conta',
    aCriar: 'A criar conta…',
    jaTens: 'Já tens conta?',
    entra: 'Entra aqui',
    erroPasswordCurta: 'A palavra-passe deve ter pelo menos 6 caracteres.',
    erroContaExiste: 'Já existe uma conta com este email. Entra em vez disso.',
  },
  en: {
    seoTitulo: 'Create account',
    seoDescricao:
      'Create your TECNATO account to track your applications and receive opportunities.',
    inicio: '← Home',
    confirmarLabel: 'Confirm your email',
    confirmarTitulo: 'Almost there!',
    confirmarTexto1: 'We sent a confirmation link to',
    confirmarTexto2:
      ". Open the email, confirm your account and sign in to submit your application.",
    confirmarBotao: 'All confirmed — go to sign in',
    label: 'Create account',
    titulo: 'Join TECNATO.',
    intro:
      'Create your account to submit your application video and follow the verification and approval status.',
    nome: 'Name',
    nomePlaceholder: 'Your name',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    criar: 'Create account',
    aCriar: 'Creating account…',
    jaTens: 'Already have an account?',
    entra: 'Sign in here',
    erroPasswordCurta: 'Password must be at least 6 characters.',
    erroContaExiste: 'An account already exists with this email. Sign in instead.',
  },
}

export default function Registar() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    descricao: c.seoDescricao,
    caminho: '/registar',
    noindex: true,
    tipoPagina: 'registar',
    lang,
  })

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
      setError(c.erroPasswordCurta)
      return
    }

    setBusy(true)
    try {
      const data = await signUp({ nome, email, password })
      if (data.user?.identities?.length === 0) {
        setError(c.erroContaExiste)
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
          {c.inicio}
        </Link>
        <p className="section-label mt-6 text-brand-deep">{c.confirmarLabel}</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.confirmarTitulo}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          {c.confirmarTexto1} <strong>{pendingEmail}</strong>{c.confirmarTexto2}
        </p>
        <Link
          to="/entrar"
          className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
        >
          {c.confirmarBotao}
        </Link>
      </section>
    )
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
        <label className="mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="nome">
          {c.nome}
        </label>
        <input
          id="nome"
          required
          autoComplete="name"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder={c.nomePlaceholder}
        />

        <label className="mt-5 mb-1.5 block text-sm font-semibold text-ink/80" htmlFor="email">
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base placeholder:text-ink/35 focus:border-ink focus:outline-none"
          placeholder={c.passwordPlaceholder}
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? c.aCriar : c.criar}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/65">
        {c.jaTens}{' '}
        <Link to="/entrar" className="font-semibold text-ink underline underline-offset-2">
          {c.entra}
        </Link>
      </p>
    </section>
  )
}
