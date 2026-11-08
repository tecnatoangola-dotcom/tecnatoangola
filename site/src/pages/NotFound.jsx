import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.jsx'
import { whatsappUrl } from '../constants.js'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    seoTitulo: 'Página não encontrada',
    seoDescricao: 'A página que procuraste não existe. Volta ao início do TECNATO.',
    etiqueta: 'erro 404',
    titulo: 'Página não encontrada.',
    texto: 'O endereço que procuraste não existe ou foi movido. Volta ao início ou explora o TECNATO.',
    voltar: 'Voltar ao início',
    candidatar: 'Candidatar-me',
    whatsapp: 'Falar connosco',
  },
  en: {
    seoTitulo: 'Page not found',
    seoDescricao: 'The page you were looking for does not exist. Go back to the TECNATO home page.',
    etiqueta: 'error 404',
    titulo: 'Page not found.',
    texto: 'The address you requested does not exist or has been moved. Go back home or explore TECNATO.',
    voltar: 'Back to home',
    candidatar: 'Apply',
    whatsapp: 'Talk to us',
  },
}

// Página 404 — página inexistente, com caminho de volta para o site.
export default function NotFound() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    descricao: c.seoDescricao,
    caminho: '/404',
    noindex: true,
  })

  return (
    <div className="container py-24 text-center">
      <p className="admin-label text-brand">{c.etiqueta}</p>
      <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] lg:text-6xl">{c.titulo}</h1>
      <p className="mx-auto mt-4 max-w-xl text-ink/60">{c.texto}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center bg-ink px-6 font-mono text-[11px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft"
        >
          {c.voltar}
        </Link>
        <Link
          to="/candidatura"
          className="inline-flex min-h-11 items-center border border-ink px-6 font-mono text-[11px] tracking-[0.1em] uppercase hover:bg-ink hover:text-white"
        >
          {c.candidatar}
        </Link>
        <a
          href={whatsappUrl(lang)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center border border-line bg-white px-6 font-mono text-[11px] tracking-[0.1em] uppercase hover:border-ink"
        >
          {c.whatsapp}
        </a>
      </div>
    </div>
  )
}
