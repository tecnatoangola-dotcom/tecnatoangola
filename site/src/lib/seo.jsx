import { useEffect } from 'react'

const SITE_URL = 'https://tecnatoangola.com'
const IMAGEM_PADRAO = `${SITE_URL}/og-tecnato.png`

// Keywords base por página (PT + EN)
const KEYWORDS_BASE = {
  home: {
    pt: 'TECNATO, tecnato angola, tecnatoangola, talento angola, inovação angola, empreendedorismo angola, projectos angola, startup angola, juventude angola, oportunidades angola, visibilidade talento, plataforma talento angola',
    en: 'TECNATO, tecnato angola, talent angola, innovation angola, entrepreneurship angola, projects angola, startup angola, youth angola, opportunities angola, talent visibility angola, talent platform angola'
  },
  candidatura: {
    pt: 'candidatura TECNATO, apresentar projeto angola, enviar vídeo projeto angola, candidatura empreendedorismo angola, financiar projeto angola, oportunidade jovem angola',
    en: 'TECNATO application, submit project angola, send video project angola, entrepreneurship application angola, fund project angola, youth opportunity angola'
  },
  areas: {
    pt: 'áreas TECNATO, gestão administração angola, ciência investigação angola, tecnologia inovação angola, empreendedorismo negócios angola, impacto social angola, invenções angola',
    en: 'TECNATO fields, management administration angola, science research angola, technology innovation angola, entrepreneurship business angola, social impact angola, inventions angola'
  },
  'como-funciona': {
    pt: 'como funciona TECNATO, processo candidatura TECNATO, etapas TECNATO, verificação projeto angola, aprovação candidatura angola',
    en: 'how TECNATO works, TECNATO application process, TECNATO stages, project verification angola, application approval angola'
  },
  participar: {
    pt: 'participar TECNATO, como participar TECNATO, juntar TECNATO, oportunidades participar angola, voluntariado TECNATO',
    en: 'participate TECNATO, how to join TECNATO, TECNATO opportunities, volunteering TECNATO'
  },
  faq: {
    pt: 'perguntas frequentes TECNATO, FAQ TECNATO, dúvidas TECNATO, como candidatar TECNATO, regras TECNATO',
    en: 'TECNATO FAQ, frequent questions TECNATO, TECNATO doubts, how to apply TECNATO, TECNATO rules'
  },
  'quem-somos': {
    pt: 'quem somos TECNATO, fundadores TECNATO, equipa TECNATO, Garcia Manuel, Elias Sebastião, história TECNATO',
    en: 'about TECNATO, TECNATO founders, TECNATO team, Garcia Manuel, Elias Sebastião, TECNATO history'
  },
  'politica-de-privacidade': {
    pt: 'política privacidade TECNATO, protecção dados TECNATO, LGPD angola, termos uso TECNATO',
    en: 'TECNATO privacy policy, data protection TECNATO, Angola data protection, TECNATO terms of use'
  },
  projecto: {
    pt: 'projecto TECNATO, showcase project angola, projeto destaque angola, visibilidade projecto angola',
    en: 'TECNATO project, showcase project angola, featured project angola, project visibility angola'
  },
  perfil: {
    pt: 'perfil TECNATO, minha candidatura TECNATO, acompanhar candidatura angola, dashboard candidato angola',
    en: 'TECNATO profile, my application TECNATO, track application angola, candidate dashboard angola'
  },
  entrar: {
    pt: 'entrar TECNATO, login TECNATO, conta TECNATO, autenticação candidato angola',
    en: 'sign in TECNATO, TECNATO login, TECNATO account, candidate authentication angola'
  },
  registar: {
    pt: 'registar TECNATO, criar conta TECNATO, registo candidato angola, nova conta TECNATO',
    en: 'register TECNATO, create account TECNATO, candidate registration angola, new account TECNATO'
  },
  recuperar: {
    pt: 'recuperar senha TECNATO, esqueci senha TECNATO, reset password TECNATO',
    en: 'recover password TECNATO, forgot password TECNATO, reset password TECNATO'
  },
  redefinir: {
    pt: 'redefinir senha TECNATO, nova senha TECNATO, alterar senha TECNATO',
    en: 'reset password TECNATO, new password TECNATO, change password TECNATO'
  },
  confirmacao: {
    pt: 'confirmação email TECNATO, verificar email TECNATO, activar conta TECNATO',
    en: 'email confirmation TECNATO, verify email TECNATO, activate account TECNATO'
  }
}

// Mapas de caminho para breadcrumbs
const BREADCRUMB_MAP = {
  '/': [{ name: 'Início', path: '/' }],
  '/candidatura': [{ name: 'Início', path: '/' }, { name: 'Candidatura', path: '/candidatura' }],
  '/areas': [{ name: 'Início', path: '/' }, { name: 'Áreas', path: '/areas' }],
  '/como-funciona': [{ name: 'Início', path: '/' }, { name: 'Como Funciona', path: '/como-funciona' }],
  '/participar': [{ name: 'Início', path: '/' }, { name: 'Participar', path: '/participar' }],
  '/faq': [{ name: 'Início', path: '/' }, { name: 'Perguntas Frequentes', path: '/faq' }],
  '/quem-somos': [{ name: 'Início', path: '/' }, { name: 'Quem Somos', path: '/quem-somos' }],
  '/politica-de-privacidade': [{ name: 'Início', path: '/' }, { name: 'Política de Privacidade', path: '/politica-de-privacidade' }],
  '/projecto': [{ name: 'Início', path: '/' }, { name: 'Projecto', path: '/projecto' }],
  '/perfil': [{ name: 'Início', path: '/' }, { name: 'Perfil', path: '/perfil' }],
  '/entrar': [{ name: 'Início', path: '/' }, { name: 'Entrar', path: '/entrar' }],
  '/registar': [{ name: 'Início', path: '/' }, { name: 'Registar', path: '/registar' }],
  '/recuperar': [{ name: 'Início', path: '/' }, { name: 'Recuperar', path: '/recuperar' }],
  '/redefinir': [{ name: 'Início', path: '/' }, { name: 'Redefinir', path: '/redefinir' }],
  '/confirmacao': [{ name: 'Início', path: '/' }, { name: 'Confirmação', path: '/confirmacao' }]
}

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

function definirLink(rel, href, hreflang) {
  let link = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    link.href = href
    document.head.appendChild(link)
  }
  if (hreflang) link.hreflang = hreflang
}

function removerMeta(atributo, chave) {
  const tag = document.head.querySelector(`meta[${atributo}="${chave}"]`)
  if (tag) tag.remove()
}

function removerLink(rel, href) {
  const link = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)
  if (link) link.remove()
}

function injectJsonLd(id, data) {
  let script = document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-id', id)
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function removerJsonLd(id) {
  const script = document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`)
  if (script) script.remove()
}

/**
 * SEO por página (SPA) com keywords, OG image dinâmica, hreflang, breadcrumbs JSON-LD.
 * Exemplo:
 *   useSeo({
 *     titulo: 'Candidatura',
 *     descricao: '...',
 *     caminho: '/candidatura',
 *     imagem: '/og-candidatura.png',
 *     noindex: false,
 *     tipoPagina: 'candidatura' // chave do KEYWORDS_BASE
 *   })
 */
export function useSeo({
  titulo,
  descricao,
  caminho = '/',
  imagem,
  noindex = false,
  tipoPagina = 'home',
  lang = 'pt'
}) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | TECNATO` : 'TECNATO — Talento, Oportunidade e Inovação em Angola'
    document.title = tituloCompleto

    // Meta tags básicas
    definirMeta('name', 'description', descricao)
    definirMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

    // Keywords estratégicas
    const keywords = KEYWORDS_BASE[tipoPagina]?.[lang] || KEYWORDS_BASE.home[lang]
    definirMeta('name', 'keywords', keywords)

    // URL canónica
    const url = `${SITE_URL}${caminho}`
    let canonica = document.head.querySelector('link[rel="canonical"]')
    if (!canonica) {
      canonica = document.createElement('link')
      canonica.rel = 'canonical'
      document.head.appendChild(canonica)
    }
    canonica.href = url

    // Open Graph
    definirMeta('property', 'og:url', url)
    definirMeta('property', 'og:title', tituloCompleto)
    definirMeta('property', 'og:description', descricao)
    definirMeta('property', 'og:image', imagem || IMAGEM_PADRAO)
    definirMeta('property', 'og:image:width', '1200')
    definirMeta('property', 'og:image:height', '630')
    definirMeta('property', 'og:image:alt', `TECNATO — ${titulo || 'Talento, Oportunidade e Inovação em Angola'}`)
    definirMeta('property', 'og:type', caminho === '/' ? 'website' : 'article')
    definirMeta('property', 'og:site_name', 'TECNATO')
    definirMeta('property', 'og:locale', lang === 'pt' ? 'pt_AO' : 'en_US')

    // hreflang alternates
    definirLink('alternate', `${SITE_URL}${caminho}`, 'pt-AO')
    definirLink('alternate', `${SITE_URL}${caminho}`, 'en')
    definirLink('alternate', `${SITE_URL}${caminho}`, 'x-default')

    // Twitter
    definirMeta('name', 'twitter:card', 'summary_large_image')
    definirMeta('name', 'twitter:site', '@tecnatoangola')
    definirMeta('name', 'twitter:creator', '@tecnatoangola')
    definirMeta('name', 'twitter:title', tituloCompleto)
    definirMeta('name', 'twitter:description', descricao)
    definirMeta('name', 'twitter:image', imagem || IMAGEM_PADRAO)
    definirMeta('name', 'twitter:image:alt', `TECNATO — ${titulo || 'Talento, Oportunidade e Inovação em Angola'}`)

    // JSON-LD: BreadcrumbList
    const breadcrumbs = BREADCRUMB_MAP[caminho] || [{ name: 'Início', path: '/' }]
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`
      }))
    }
    injectJsonLd(`breadcrumb-${caminho.replace(/\//g, '-') || 'home'}`, breadcrumbJsonLd)

    // JSON-LD: WebPage / Article consoante a página
    const isHome = caminho === '/'
    const pageJsonLd = {
      '@context': 'https://schema.org',
      '@type': isHome ? 'WebSite' : 'WebPage',
      name: tituloCompleto,
      url: url,
      inLanguage: lang === 'pt' ? 'pt-AO' : 'en',
      description: descricao,
      image: imagem || IMAGEM_PADRAO,
      isPartOf: {
        '@type': 'WebSite',
        name: 'TECNATO',
        url: SITE_URL
      },
      publisher: {
        '@type': 'Organization',
        name: 'TECNATO',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo/simbolo.png`
        }
      }
    }
    if (!isHome) {
      pageJsonLd['@type'] = 'Article'
      pageJsonLd.headline = tituloCompleto
      pageJsonLd.articleSection = tipoPagina
    }
    injectJsonLd(`page-${caminho.replace(/\//g, '-') || 'home'}`, pageJsonLd)

    // Cleanup function
    return () => {
      // Não removemos meta tags globais (keywords, description, etc.) porque outras páginas podem precisar
      // Apenas removemos os JSON-LD específicos desta página
      removerJsonLd(`breadcrumb-${caminho.replace(/\//g, '-') || 'home'}`)
      removerJsonLd(`page-${caminho.replace(/\//g, '-') || 'home'}`)
    }
  }, [titulo, descricao, caminho, imagem, noindex, tipoPagina, lang])
}

export { SITE_URL, KEYWORDS_BASE, BREADCRUMB_MAP }