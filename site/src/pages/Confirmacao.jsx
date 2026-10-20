import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext.js'
import { useSeo } from '../lib/seo.jsx'

const LOGO = 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792513477/TECNATO.png'

// Lê o fragmento () do URL: um link de confirmação inválido/expirado chega aqui com #error=...
function lerErro() {
  if (typeof window === 'undefined') return ''
  const frag = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  if (!frag) return ''
  const params = new URLSearchParams(frag.replaceAll('+', ' '))
  const codigo = params.get('error_code') || ''
  if (codigo === 'otp_expired') {
    return 'Este link já foi utilizado ou expirou. Cada link de confirmação só pode ser usado uma vez — se a tua conta já foi confirmada, podes entrar normalmente. Caso contrário, volta ao registo para receberes um novo email.'
  }
  const descricao = params.get('error_description') || params.get('error')
  return descricao ? `Não foi possível confirmar: ${decodeURIComponent(descricao)}` : ''
}

export default function Confirmacao() {
  useSeo({
    titulo: 'Email confirmado',
    caminho: '/confirmacao',
    noindex: true,
  })

  const { user, loading } = useAuth()
  const [erro] = useState(lerErro)

  const estado = loading ? 'a-carregar' : user ? 'confirmado' : erro ? 'erro' : 'sem-sessao'

  return (
    <section className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <div className="mt-8 flex justify-center">
        <img src={LOGO} alt="TECNATO" className="h-14 w-auto" />
      </div>

      {estado === 'confirmado' && (
        <>
          <p className="section-label mt-8 text-brand-deep">Email confirmado</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Conta activa. Bem-vindo!</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            A tua conta TECNATO está confirmada{user?.email ? <> como <strong>{user.email}</strong></> : null}.
            Agora podes apresentar o teu projecto e acompanhar tudo no teu perfil.
          </p>
          <Link
            to="/perfil"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Ir para o meu perfil
          </Link>
          <Link
            to="/candidatura"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            Apresentar candidatura
          </Link>
        </>
      )}

      {estado === 'erro' && (
        <>
          <p className="section-label mt-8 text-brand-deep">Confirmação</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Link já usado ou expirado.</h1>
          <div role="alert" className="mt-4 rounded-xl border border-line bg-white px-4 py-3.5 text-sm leading-relaxed text-ink/80">
            {erro}
          </div>
          <Link
            to="/entrar"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Entrar na minha conta
          </Link>
          <Link
            to="/registar"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink"
          >
            Receber novo email de confirmação
          </Link>
        </>
      )}

      {(estado === 'a-carregar' || estado === 'sem-sessao') && !erro && (
        <>
          <p className="section-label mt-8 text-brand-deep">Confirmação</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            {estado === 'a-carregar' ? 'A confirmar…' : 'Quase lá!'}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {estado === 'a-carregar'
              ? 'Estamos a confirmar o teu email…'
              : 'Se abriste este link a partir de um email antigo, volta ao registo para receberes um novo email, ou entra com a tua palavra-passe.'}
          </p>
          {estado === 'sem-sessao' && (
            <Link
              to="/entrar"
              className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
            >
              Entrar na minha conta
            </Link>
          )}
        </>
      )}

      <p className="mt-10 text-center text-xs text-ink/45">
        Problemas para entrar? Escreve-nos para suporte@tecnatoangola.com
      </p>
    </section>
  )
}
