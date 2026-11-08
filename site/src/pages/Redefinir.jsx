import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

const T = {
  pt: {
    seoTitulo: 'Redefinir palavra-passe',
    inicio: '← Início',
    linkExpirado:
      'Este link já foi utilizado ou expirou. Podes pedir um novo — só leva segundos.',
    linkErroPrefixo: 'Não foi possível redefinir: ',
    label: 'Redefinição',
    labelConcluida: 'Redefinição concluída',
    aCarregarTitulo: 'A preparar…',
    aCarregarTexto: 'Estamos a validar o teu link de recuperação…',
    linkInvalidoTitulo: 'Link já usado ou expirado.',
    pedirNovo: 'Pedir novo link',
    entrarConta: 'Entrar na minha conta',
    semSessaoTitulo: 'Quase lá!',
    semSessaoTexto:
      'Este link tem de ser aberto no mesmo browser. Se abriste por outro caminho, pede um novo link de recuperação — é rápido.',
    formTitulo: 'Define a nova palavra-passe.',
    formTextoAntes: 'Escolhe uma palavra-passe nova',
    formTextoPara: ' para ',
    formTextoDepois: '. Depois podes entrar normalmente com ela.',
    novaPassword: 'Nova palavra-passe',
    confirmarPassword: 'Confirmar palavra-passe',
    guardar: 'Guardar palavra-passe',
    aGuardar: 'A guardar…',
    feitoTitulo: 'Tudo pronto! ✓',
    feitoTexto: 'A tua palavra-passe foi actualizada. Da próxima vez entra com a nova.',
    irPerfil: 'Ir para o meu perfil',
    erroPasswordCurta: 'A palavra-passe deve ter pelo menos 6 caracteres.',
    erroNaoIguais: 'As duas palavras-passe não são iguais.',
    erroFraca:
      'Palavra-passe fraca — usa no mínimo 6 caracteres com letras e números.',
    erroGenerico: 'Não conseguimos actualizar agora. Tenta de novo.',
  },
  en: {
    seoTitulo: 'Reset password',
    inicio: '← Home',
    linkExpirado:
      'This link has already been used or has expired. You can request a new one — it only takes seconds.',
    linkErroPrefixo: 'Could not reset: ',
    label: 'Password reset',
    labelConcluida: 'Reset complete',
    aCarregarTitulo: 'Getting things ready…',
    aCarregarTexto: "We're validating your recovery link…",
    linkInvalidoTitulo: 'Link already used or expired.',
    pedirNovo: 'Request a new link',
    entrarConta: 'Sign in to my account',
    semSessaoTitulo: 'Almost there!',
    semSessaoTexto:
      "This link must be opened in the same browser. If you opened it another way, request a new recovery link — it's quick.",
    formTitulo: 'Set your new password.',
    formTextoAntes: 'Choose a new password',
    formTextoPara: ' for ',
    formTextoDepois: '. Then you can sign in with it as usual.',
    novaPassword: 'New password',
    confirmarPassword: 'Confirm password',
    guardar: 'Save password',
    aGuardar: 'Saving…',
    feitoTitulo: 'All done! ✓',
    feitoTexto: 'Your password has been updated. Next time, sign in with the new one.',
    irPerfil: 'Go to my profile',
    erroPasswordCurta: 'Password must be at least 6 characters.',
    erroNaoIguais: "The two passwords don't match.",
    erroFraca: 'Weak password — use at least 6 characters with letters and numbers.',
    erroGenerico: "We couldn't update it right now. Try again.",
  },
}

// Lê o fragmento () do URL: um link de recuperação inválido/expirado chega com #error=...
function lerErro(lang) {
  const c = T[lang]
  if (typeof window === 'undefined') return ''
  const frag = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  if (!frag) return ''
  const params = new URLSearchParams(frag.replaceAll('+', ' '))
  if ((params.get('error_code') || '') === 'otp_expired') {
    return c.linkExpirado
  }
  const descricao = params.get('error_description') || params.get('error')
  return descricao ? `${c.linkErroPrefixo}${decodeURIComponent(descricao)}` : ''
}

export default function Redefinir() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    caminho: '/redefinir',
    noindex: true,
  })

  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const erroLink = useMemo(() => lerErro(lang), [lang])
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
      setErro(c.erroPasswordCurta)
      return
    }
    if (password !== confirmar) {
      setErro(c.erroNaoIguais)
      return
    }
    setBusy(true)
    try {
      await updatePassword({ password })
      setFeito(true)
    } catch (err) {
      setErro(/weak/i.test(err.message) ? c.erroFraca : c.erroGenerico)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        {c.inicio}
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      {estado === 'a-carregar' && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.aCarregarTitulo}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {c.aCarregarTexto}
          </p>
        </>
      )}

      {estado === 'link-invalido' && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.linkInvalidoTitulo}</h1>
          <div role="alert" className="mt-4 rounded-xl border border-line bg-white px-4 py-3.5 text-sm leading-relaxed text-ink/80">
            {erroLink}
          </div>
          <Link
            to="/recuperar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            {c.pedirNovo}
          </Link>
          <Link
            to="/entrar"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            {c.entrarConta}
          </Link>
        </>
      )}

      {estado === 'sem-sessao' && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.semSessaoTitulo}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {c.semSessaoTexto}
          </p>
          <Link
            to="/recuperar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            {c.pedirNovo}
          </Link>
        </>
      )}

      {estado === 'form' && !feito && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.formTitulo}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {c.formTextoAntes}{user?.email ? <>{c.formTextoPara}<strong>{user.email}</strong></> : null}{c.formTextoDepois}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="pass1" className="text-sm font-semibold">
                {c.novaPassword}
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
                {c.confirmarPassword}
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
              {busy ? c.aGuardar : c.guardar}
            </button>
          </form>
        </>
      )}

      {estado === 'form' && feito && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.labelConcluida}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.feitoTitulo}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {c.feitoTexto}
          </p>
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            {c.irPerfil}
          </button>
        </>
      )}
    </section>
  )
}
