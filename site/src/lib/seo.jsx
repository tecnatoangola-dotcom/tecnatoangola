import { useEffect } from 'react'

const SITE_URL = 'https://tecnatoangola.com'
const IMAGEM_PADRAO = `${SITE_URL}/og-tecnato.png`

function definirMeta(atributo, chave, conteudo) {
  if (!conteudo) return
  let tag = document.head.querySelector(`meta[${atributo}="${chave}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(atributo, chave)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', conteudo)
}

/**
 * SEO por página (SPA). Exemplo:
 *   useSeo({ titulo: 'Candidatura', descricao: '...', caminho: '/candidatura' })
 */
export function useSeo({ titulo, descricao, caminho = '/', imagem, noindex = false }) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | TECNATO` : 'TECNATO — Talento, Oportunidade e Inovação em Angola'
    document.title = tituloCompleto

    definirMeta('name', 'description', descricao)
    definirMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    const url = `${SITE_URL}${caminho}`
    definirMeta('property', 'og:url', url)
    definirMeta('property', 'og:title', tituloCompleto)
    definirMeta('property', 'og:description', descricao)
    definirMeta('property', 'og:image', imagem || IMAGEM_PADRAO)
    definirMeta('name', 'twitter:title', tituloCompleto)
    definirMeta('name', 'twitter:description', descricao)
    definirMeta('name', 'twitter:image', imagem || IMAGEM_PADRAO)

    let canónica = document.head.querySelector('link[rel="canonical"]')
    if (!canónica) {
      canónica = document.createElement('link')
      canónica.rel = 'canonical'
      document.head.appendChild(canónica)
    }
    canónica.href = url
  }, [titulo, descricao, caminho, imagem, noindex])
}

export { SITE_URL }
