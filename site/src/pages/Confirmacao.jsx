import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

const T = {
  pt: {
    seoTitulo: 'Email confirmado',
    inicio: '← Início',
    linkExpirado:
      'Este link já foi utilizado ou expirou. Cada link de confirmação só pode ser usado uma vez — se a tua conta já foi confirmada, podes entrar normalmente. Caso contrário, volta ao registo para receberes um novo email.',
    linkErroPrefixo: 'Não foi possível confirmar: ',
    confirmadoLabel: 'Email confirmado',
    confirmadoTitulo: 'Conta activa. Bem-vindo!',
    confirmadoTextoAntes: 'A tua conta TECNATO está confirmada',
    confirmadoTextoComo: ' como ',
    confirmadoTextoDepois:
      '. Agora podes apresentar o teu projecto e acompanhar tudo no teu perfil.',
    irPerfil: 'Ir para o meu perfil',
    apresentar: 'Apresentar candidatura',
    label: 'Confirmação',
    erroTitulo: 'Link já usado ou expirado.',
    entrarConta: 'Entrar na minha conta',
    novoEmail: 'Receber novo email de confirmação',
    aCarregarTitulo: 'A confirmar…',
    aCarregarTexto: 'Estamos a confirmar o teu email…',
    semSessaoTitulo: 'Quase lá!',
    semSessaoTexto:
      'Se abriste este link a partir de um email antigo, volta ao registo para receberes um novo email, ou entra com a tua palavra-passe.',
    suporte: 'Problemas para entrar? Escreve-nos para suporte@tecnatoangola.com',
  },
  en: {
    seoTitulo: 'Email confirmed',
    inicio: '← Home',
    linkExpirado:
      'This link has already been used or has expired. Each confirmation link can only be used once — if your account is already confirmed, you can sign in as usual. Otherwise, go back to sign up to receive a new email.',
    linkErroPrefixo: 'Could not confirm: ',
    confirmadoLabel: 'Email confirmed',
    confirmadoTitulo: 'Account active. Welcome!',
    confirmadoTextoAntes: 'Your TECNATO account is confirmed',
    confirmadoTextoComo: ' as ',
    confirmadoTextoDepois:
      '. You can now present your project and follow everything in your profile.',
    irPerfil: 'Go to my profile',
    apresentar: 'Submit application',
    label: 'Confirmation',
    erroTitulo: 'Link already used or expired.',
    entrarConta: 'Sign in to my account',
    novoEmail: 'Get a new confirmation email',
    aCarregarTitulo: 'Confirming…',
    aCarregarTexto: "We're confirming your email…",
    semSessaoTitulo: 'Almost there!',
    semSessaoTexto:
      'If you opened this link from an old email, go back to sign up to receive a new email, or sign in with your password.',
    suporte: 'Trouble signing in? Email us at suporte@tecnatoangola.com',
  },
}

// Lê o fragmento () do URL: um link de confirmação inválido/expirado chega aqui com #error=...
function lerErro(lang) {
  const c = T[lang]
  if (typeof window === 'undefined') return ''
  const frag = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  if (!frag) return ''
  const params = new URLSearchParams(frag.replaceAll('+', ' '))
  const codigo = params.get('error_code') || ''
  if (codigo === 'otp_expired') {
    return c.linkExpirado
  }
  const descricao = params.get('error_description') || params.get('error')
  return descricao ? `${c.linkErroPrefixo}${decodeURIComponent(descricao)}` : ''
}

export default function Confirmacao() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    caminho: '/confirmacao',
    noindex: true,
    tipoPagina: 'confirmacao',
    lang,
  })

  const { user, loading } = useAuth()
  const erro = useMemo(() => lerErro(lang), [lang])

  const estado = loading ? 'a-carregar' : user ? 'confirmado' : erro ? 'erro' : 'sem-sessao'

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        {c.inicio}
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      {estado === 'confirmado' && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.confirmadoLabel}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.confirmadoTitulo}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {c.confirmadoTextoAntes}{user?.email ? <>{c.confirmadoTextoComo}<strong>{user.email}</strong></> : null}{c.confirmadoTextoDepois}
          </p>
          <Link
            to="/perfil"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            {c.irPerfil}
          </Link>
          <Link
            to="/candidatura"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            {c.apresentar}
          </Link>
        </>
      )}

      {estado === 'erro' && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.erroTitulo}</h1>
          <div role="alert" className="mt-4 rounded-xl border border-line bg-white px-4 py-3.5 text-sm leading-relaxed text-ink/80">
            {erro}
          </div>
          <Link
            to="/entrar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            {c.entrarConta}
          </Link>
          <Link
            to="/registar"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            {c.novoEmail}
          </Link>
        </>
      )}

      {(estado === 'a-carregar' || estado === 'sem-sessao') && !erro && (
        <>
          <p className="section-label mt-8 text-brand-deep">{c.label}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            {estado === 'a-carregar' ? c.aCarregarTitulo : c.semSessaoTitulo}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {estado === 'a-carregar'
              ? c.aCarregarTexto
              : c.semSessaoTexto}
          </p>
          {estado === 'sem-sessao' && (
            <Link
              to="/entrar"
              className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
            >
              {c.entrarConta}
            </Link>
          )}
        </>
      )}

      <p className="mt-10 text-center text-xs text-ink/45">
        {c.suporte}
      </p>
    </section>
  )
}
