import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

export default function Recuperar() {
  useSeo({
    titulo: 'Recuperar palavra-passe',
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
        setErro('Muitas tentativas — espera alguns minutos antes de pedir de novo.')
      } else if (/invalid email/i.test(err.message)) {
        setErro('Email inválido. Confere e tenta de novo.')
      } else {
        setErro('Não conseguimos enviar agora. Tenta de novo dentro de momentos.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (enviado) {
    return (
      <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
        <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Início
        </Link>
        <div className="mt-8 flex justify-center">
          <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
        </div>
        <p className="section-label mt-8 text-brand-deep">Recuperação enviada</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Olha o teu email!</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Enviámos para <strong>{email}</strong> um link para definires uma nova
          palavra-passe. O link vale por um tempo curto — usa-o logo.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Não recebeste nada? Confere a caixa de spam — ou volta atrás e tenta de novo.
        </p>
        <button
          type="button"
          onClick={() => navigate('/entrar')}
          className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
        >
          Voltar a entrar
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/entrar" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Entrar
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      <p className="section-label mt-8 text-brand-deep">Password</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Esqueceste a palavra-passe?</h1>
      <p className="mt-4 text-base leading-relaxed text-ink/70">
        Sem drama. Escreve o email da tua conta e enviamos um link para definires
        uma nova palavra-passe.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="recuperar-email" className="text-sm font-semibold">
            Email da conta
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
          {busy ? 'A enviar…' : 'Enviar link de recuperação'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/45">
        Ainda não tens conta?{' '}
        <Link to="/registar" className="font-semibold text-ink hover:underline">
          Regista-te
        </Link>
      </p>
    </section>
  )
}
