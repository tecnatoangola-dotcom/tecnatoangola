import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.jsx'
import { WHATSAPP_URL } from '../constants.js'

// Página 404 — página inexistente, com caminho de volta para o site.
export default function NotFound() {
  useSeo({
    titulo: 'Página não encontrada',
    descricao: 'A página que procuraste não existe. Volta ao início do TECNATO.',
    caminho: '/404',
    noindex: true,
  })

  return (
    <div className="container py-24 text-center">
      <p className="admin-label text-brand">erro 404</p>
      <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] lg:text-6xl">
        Página não encontrada.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-ink/60">
        O endereço que procuraste não existe ou foi movido. Volta ao início ou explora o TECNATO.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center bg-ink px-6 font-mono text-[11px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft"
        >
          Voltar ao início
        </Link>
        <Link
          to="/candidatura"
          className="inline-flex min-h-11 items-center border border-ink px-6 font-mono text-[11px] tracking-[0.1em] uppercase hover:bg-ink hover:text-white"
        >
          Candidatar-me
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center border border-line bg-white px-6 font-mono text-[11px] tracking-[0.1em] uppercase hover:border-ink"
        >
          Falar connosco
        </a>
      </div>
    </div>
  )
}
