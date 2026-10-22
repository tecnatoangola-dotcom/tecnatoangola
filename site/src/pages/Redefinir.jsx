import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

// Lê o fragmento () do URL: um link de recuperação inválido/expirado chega com #error=...
function lerErro() {
  if (typeof window === 'undefined') return ''
  const frag = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  if (!frag) return ''
  const params = new URLSearchParams(frag.replaceAll('+', ' '))
  if ((params.get('error_code') || '') === 'otp_expired') {
    return 'Este link já foi utilizado ou expirou. Podes pedir um novo — só leva segundos.'
  }
  const descricao = params.get('error_description') || params.get('error')
  return descricao ? `Não foi possível redefinir: ${decodeURIComponent(descricao)}` : ''
}

export default function Redefinir() {
  useSeo({
    titulo: 'Redefinir palavra-passe',
    caminho: '/redefinir',
    noindex: true,
  })

  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [erroLink] = useState(lerErro)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [feito, setFeito] = useState(false)
  const [busy, setBusy] = useState(false)

  const estado = loading ? 'a-carregar' : erroLink ? 'link-invalido' : user ? 'form' : 'sem-sessao'

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    if (password.length < 6) {
      setErro('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setErro('As duas palavras-passe não são iguais.')
      return
    }
    setBusy(true)
    try {
      await updatePassword({ password })
      setFeito(true)
    } catch (err) {
      setErro(/weak/i.test(err.message) ? 'Palavra-passe fraca — usa no mínimo 6 caracteres com letras e números.' : 'Não conseguimos actualizar agora. Tenta de novo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      {estado === 'a-carregar' && (
        <>
          <p className="section-label mt-8 text-brand-deep">Redefinição</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">A preparar…</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Estamos a validar o teu link de recuperação…
          </p>
        </>
      )}

      {estado === 'link-invalido' && (
        <>
          <p className="section-label mt-8 text-brand-deep">Redefinição</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Link já usado ou expirado.</h1>
          <div role="alert" className="mt-4 rounded-xl border border-line bg-white px-4 py-3.5 text-sm leading-relaxed text-ink/80">
            {erroLink}
          </div>
          <Link
            to="/recuperar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Pedir novo link
          </Link>
          <Link
            to="/entrar"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            Entrar na minha conta
          </Link>
        </>
      )}

      {estado === 'sem-sessao' && (
        <>
          <p className="section-label mt-8 text-brand-deep">Redefinição</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Quase lá!</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Este link tem de ser aberto no mesmo browser. Se abriste por outro caminho,
            pede um novo link de recuperação — é rápido.
          </p>
          <Link
            to="/recuperar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Pedir novo link
          </Link>
        </>
      )}

      {estado === 'form' && !feito && (
        <>
          <p className="section-label mt-8 text-brand-deep">Redefinição</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Define a nova palavra-passe.</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Escolhe uma palavra-passe nova{user?.email ? <> para <strong>{user.email}</strong></> : null}.
            Depois podes entrar normalmente com ela.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="pass1" className="text-sm font-semibold">
                Nova palavra-passe
              </label>
              <input
                id="pass1"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="pass2" className="text-sm font-semibold">
                Confirmar palavra-passe
              </label>
              <input
                id="pass2"
                type="password"
                required
                value={confirmar}
                onChange={(event) => setConfirmar(event.target.value)}
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
              {busy ? 'A guardar…' : 'Guardar palavra-passe'}
            </button>
          </form>
        </>
      )}

      {estado === 'form' && feito && (
        <>
          <p className="section-label mt-8 text-brand-deep">Redefinição concluída</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Tudo pronto! ✓</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            A tua palavra-passe foi actualizada. Da próxima vez entra com a nova.
          </p>
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Ir para o meu perfil
          </button>
        </>
      )}
    </section>
  )
}
