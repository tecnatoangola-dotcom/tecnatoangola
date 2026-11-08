import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

const T = {
  pt: {
    seoTitulo: 'Recuperar palavra-passe',
    inicio: '← Início',
    entrar: '← Entrar',
    enviadoLabel: 'Recuperação enviada',
    enviadoTitulo: 'Olha o teu email!',
    enviadoTexto1: 'Enviámos para',
    enviadoTexto2:
      'um link para definires uma nova palavra-passe. O link vale por um tempo curto — usa-o logo.',
    enviadoAjuda:
      'Não recebeste nada? Confere a caixa de spam — ou volta atrás e tenta de novo.',
    voltarEntrar: 'Voltar a entrar',
    label: 'Password',
    titulo: 'Esqueceste a palavra-passe?',
    intro:
      'Sem drama. Escreve o email da tua conta e enviamos um link para definires uma nova palavra-passe.',
    emailLabel: 'Email da conta',
    enviar: 'Enviar link de recuperação',
    aEnviar: 'A enviar…',
    semConta: 'Ainda não tens conta?',
    registar: 'Regista-te',
    erroRateLimit: 'Muitas tentativas — espera alguns minutos antes de pedir de novo.',
    erroEmailInvalido: 'Email inválido. Confere e tenta de novo.',
    erroGenerico: 'Não conseguimos enviar agora. Tenta de novo dentro de momentos.',
  },
  en: {
    seoTitulo: 'Forgot password',
    inicio: '← Home',
    entrar: '← Sign in',
    enviadoLabel: 'Recovery link sent',
    enviadoTitulo: 'Check your email!',
    enviadoTexto1: 'We sent a link to',
    enviadoTexto2:
      'to set a new password. The link is valid for a short time — use it right away.',
    enviadoAjuda: "Didn't get anything? Check your spam folder — or go back and try again.",
    voltarEntrar: 'Back to sign in',
    label: 'Password',
    titulo: 'Forgot your password?',
    intro:
      "No worries. Enter your account email and we'll send you a link to set a new password.",
    emailLabel: 'Account email',
    enviar: 'Send recovery link',
    aEnviar: 'Sending…',
    semConta: "Don't have an account yet?",
    registar: 'Sign up',
    erroRateLimit: 'Too many attempts — wait a few minutes before trying again.',
    erroEmailInvalido: 'Invalid email. Check it and try again.',
    erroGenerico: "We couldn't send it right now. Try again in a moment.",
  },
}

export default function Recuperar() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    caminho: '/recuperar',
    noindex: true,
  })

  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setBusy(true)
    try {
      await resetPassword({ email })
      setEnviado(true)
    } catch (err) {
      if (/rate_limit|too many/i.test(err.message)) {
        setErro(c.erroRateLimit)
      } else if (/invalid email/i.test(err.message)) {
        setErro(c.erroEmailInvalido)
      } else {
        setErro(c.erroGenerico)
      }
    } finally {
      setBusy(false)
    }
  }

  if (enviado) {
    return (
      <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
        <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
          {c.inicio}
        </Link>
        <div className="mt-8 flex justify-center">
          <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
        </div>
        <p className="section-label mt-8 text-brand-deep">{c.enviadoLabel}</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.enviadoTitulo}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          {c.enviadoTexto1} <strong>{email}</strong> {c.enviadoTexto2}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          {c.enviadoAjuda}
        </p>
        <button
          type="button"
          onClick={() => navigate('/entrar')}
          className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
        >
          {c.voltarEntrar}
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/entrar" className="text-sm font-semibold text-ink/60 hover:text-ink">
        {c.entrar}
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      <p className="section-label mt-8 text-brand-deep">{c.label}</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.titulo}</h1>
      <p className="mt-4 text-base leading-relaxed text-ink/70">
        {c.intro}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="recuperar-email" className="text-sm font-semibold">
            {c.emailLabel}
          </label>
          <input
            id="recuperar-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="equipa@email.com"
            className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>

        {erro && (
          <div role="alert" className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink/80">
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? c.aEnviar : c.enviar}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/45">
        {c.semConta}{' '}
        <Link to="/registar" className="font-semibold text-ink hover:underline">
          {c.registar}
        </Link>
      </p>
    </section>
  )
}
