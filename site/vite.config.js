import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv } from 'vite'
import fs from 'fs'
import path from 'path'

// Em desenvolvimento serve /api/conteudo usando a ANON key (nunca a service key).
// A service key só existe no servidor (Netlify Function). Em dev usamos a anon key
// com RLS políticas públicas na tabela site_conteudo (SELECT público).
function conteudoDev() {
  const env = loadEnv('development', process.cwd(), '')
  return {
    name: 'tec-conteudo-dev',
    configureServer(server) {
      server.middlewares.use('/api/conteudo', async (req, res) => {
        const responder = (status, corpo) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(corpo))
        }
        try {
          const url = env.VITE_SUPABASE_URL
          const key = env.VITE_SUPABASE_ANON_KEY
          if (!url || !key) {
            responder(500, { error: 'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY em falta no site/.env.' })
            return
          }
          const r = await fetch(`${url}/rest/v1/site_conteudo?select=chave,valor`, {
            headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
          })
          const rows = await r.json()
          const conteudo = {}
          if (Array.isArray(rows)) for (const row of rows) conteudo[row.chave] = row.valor
          // Nunca expor chaves de API ao browser (mesma regra da function)
          const sanitizar = (o) => {
            if (Array.isArray(o)) o.forEach(sanitizar)
            else if (o && typeof o === 'object') for (const k of Object.keys(o)) {
              if (/api[-_]?key|secret|password|token/i.test(k)) delete o[k]
              else sanitizar(o[k])
            }
          }
          sanitizar(conteudo)
          responder(r.ok ? 200 : 500, { conteudo })
        } catch (error) {
          responder(500, { error: String(error?.message || error) })
        }
      })
    },
  }
}

// Plugin para pré-renderizar meta tags críticas (SSG-lite)
// Gera ficheiros HTML estáticos com meta tags já injetadas para bots
function seoPrerender() {
  const SITE_URL = 'https://tecnatoangola.com'
  const routes = [
    { path: '/', titulo: 'Talento, Oportunidade e Inovação em Angola', descricao: 'TECNATO identifica, valoriza e dá visibilidade a talentos, projectos e iniciativas em Gestão, Administração, Ciência, Inovação, Empreendedorismo e Tecnologia. Candidata o teu projecto e representa o teu município. Luanda é o começo. Angola é o horizonte.', keywords: 'TECNATO, tecnato angola, tecnatoangola, talento angola, inovação angola, empreendedorismo angola, projectos angola, startup angola, juventude angola, oportunidades angola, visibilidade talento, plataforma talento angola', imagem: '/og-tecnato.png', ogType: 'website', ogDesc: 'Apresenta o teu projecto, sê visto e representa o teu município. A plataforma que dá palco ao talento, à criatividade e às oportunidades de Angola.' },
    { path: '/candidatura', titulo: 'Candidatura — apresente o teu projecto', descricao: 'Submete a tua candidatura em vídeo e fotografia ao TECNATO: gestão, administração, ciência, inovação, empreendedorismo e tecnologia. Sê visto e representa o teu município.', keywords: 'candidatura TECNATO, apresentar projeto angola, enviar vídeo projeto angola, candidatura empreendedorismo angola, financiar projeto angola, oportunidade jovem angola', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Submete a tua candidatura em vídeo e fotografia ao TECNATO e representa o teu município.' },
    { path: '/areas', titulo: 'Áreas de projecto', descricao: 'Gestão, Ciência, Tecnologia, Empreendedorismo, Impacto Social, Invenções. Descobre em que área se encaixa o teu projecto.', keywords: 'áreas TECNATO, gestão administração angola, ciência investigação angola, tecnologia inovação angola, empreendedorismo negócios angola, impacto social angola, invenções angola', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Descobre as áreas de projecto do TECNATO: Gestão, Ciência, Tecnologia, Empreendedorismo, Impacto Social, Invenções.' },
    { path: '/como-funciona', titulo: 'Como funciona', descricao: 'Cinco fases: apresentação, selecção, desenvolvimento, competição e reconhecimento. Entende o processo do TECNATO.', keywords: 'como funciona TECNATO, processo candidatura TECNATO, etapas TECNATO, verificação projeto angola, aprovação candidatura angola', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Entende o processo do TECNATO em 5 fases: apresentação, selecção, desenvolvimento, competição e reconhecimento.' },
    { path: '/participar', titulo: 'Quem pode participar', descricao: 'Equipas formais e informais, startups, projectos científicos, iniciativas sociais. Descobre se podes candidatar-te e o que ganhas.', keywords: 'participar TECNATO, como participar TECNATO, juntar TECNATO, oportunidades participar angola, voluntariado TECNATO', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Quem pode participar no TECNATO: equipas, startups, projectos científicos, iniciativas sociais.' },
    { path: '/faq', titulo: 'Perguntas frequentes', descricao: 'Respostas directas às dúvidas mais comuns sobre candidatura, elegibilidade, áreas, prémios e funcionamento da plataforma.', keywords: 'perguntas frequentes TECNATO, FAQ TECNATO, dúvidas TECNATO, como candidatar TECNATO, regras TECNATO', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Respostas às dúvidas mais comuns sobre o TECNATO: candidatura, elegibilidade, áreas, prémios.' },
    { path: '/quem-somos', titulo: 'Quem somos', descricao: 'Conhece a TECNATO: uma plataforma angolana criada para identificar, valorizar e visibilizar o talento nacional — do bairro para o mundo.', keywords: 'quem somos TECNATO, fundadores TECNATO, equipa TECNATO, Garcia Manuel, Elias Sebastião, história TECNATO', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Conhece a equipa e a história do TECNATO: a plataforma de talentos de Angola.' },
    { path: '/politica-de-privacidade', titulo: 'Política de Privacidade', descricao: 'Política de privacidade e protecção de dados do TECNATO. Como tratamos os teus dados e direitos.', keywords: 'política privacidade TECNATO, protecção dados TECNATO, LGPD angola, termos uso TECNATO', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Política de privacidade e protecção de dados do TECNATO.' },
    { path: '/projecto', titulo: 'O projecto TECNATO', descricao: 'Conhece a missão, o problema que resolvemos e os valores que guiam o TECNATO — a plataforma de talentos de Angola.', keywords: 'projecto TECNATO, showcase project angola, projeto destaque angola, visibilidade projecto angola', imagem: '/og-tecnato.png', ogType: 'article', ogDesc: 'Conhece a missão e os valores do TECNATO: a plataforma de talentos de Angola.' },
  ]

  // Função helper para substituir meta tags multiline
  function replaceMeta(html, name, newContent) {
    // Regex que captura meta tags com content multilinha
    const regex = new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*(")`, 'g')
    return html.replace(regex, `$1${newContent}$2`)
  }

  function replaceProperty(html, property, newContent) {
    const regex = new RegExp(`(<meta\\s+property="${property}"\\s+content=")[^"]*(")`, 'g')
    return html.replace(regex, `$1${newContent}$2`)
  }

  function replaceTwitter(html, name, newContent) {
    const regex = new RegExp(`(<meta\\s+name="twitter:${name}"\\s+content=")[^"]*(")`, 'g')
    return html.replace(regex, `$1${newContent}$2`)
  }

  return {
    name: 'tec-seo-prerender',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve('dist')
      const indexPath = path.join(distDir, 'index.html')
      let indexHtml = fs.readFileSync(indexPath, 'utf-8')

      // Para cada rota, cria um ficheiro HTML pré-renderizado numa pasta correspondente
      for (const route of routes) {
        const routeDir = route.path === '/' ? distDir : path.join(distDir, route.path.slice(1))
        const routeFile = path.join(routeDir, 'index.html')

        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true })
        }

        let html = indexHtml
          .replace(/<title>.*<\/title>/, `<title>${route.titulo} | TECNATO</title>`)
          .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${route.descricao}" />`)
          // Usa replaceMeta para tags multilinha
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${route.descricao}$2`)
          .replace(/(<meta\s+name="keywords"\s+content=")[^"]*(")/, `$1${route.keywords}$2`)
          .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${route.titulo} | TECNATO$2`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${route.ogDesc}$2`)
          .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${SITE_URL}${route.imagem}$2`)
          .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${SITE_URL}${route.path}$2`)
          .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${route.ogType}$2`)
          .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${route.titulo} | TECNATO$2`)
          .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${route.ogDesc}$2`)
          .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${SITE_URL}${route.imagem}$2`)
          .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${SITE_URL}${route.path}$2`)
          .replace(/(<link\s+rel="alternate"\s+hreflang="pt-AO"\s+href=")[^"]*(")/, `$1${SITE_URL}${route.path}$2`)
          .replace(/(<link\s+rel="alternate"\s+hreflang="en"\s+href=")[^"]*(")/, `$1${SITE_URL}${route.path}$2`)
          .replace(/(<link\s+rel="alternate"\s+hreflang="x-default"\s+href=")[^"]*(")/, `$1${SITE_URL}${route.path}$2`)

        fs.writeFileSync(routeFile, html)
      }

      console.log('[SEO Prerender] Meta tags pré-renderizadas para', routes.length, 'rotas')
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Garante que o build é SEMPRE de produção, mesmo que o shell tenha
  // NODE_ENV=development definido (isso gerava bundles de dev em produção:
  // React em runtime jsxDEV, import.meta.env.PROD=false e o código de
  // produção removido pelo tree-shaking).
  if (command === 'build') process.env.NODE_ENV = 'production'

  return {
  plugins: [
    react(),
    tailwindcss(),
    conteudoDev(),
    seoPrerender(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo/simbolo.png', 'og-tecnato.png'],
      manifest: {
        name: 'TECNATO — Talento, Oportunidade e Inovação em Angola',
        short_name: 'TECNATO',
        description: 'Plataforma angolana de identificação, valorização e visibilidade de talentos, projectos e iniciativas.',
        theme_color: '#121313',
        background_color: '#121313',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'pt-AO',
        icons: [
          { src: '/logo/simbolo.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo/simbolo.png', sizes: '512x512', type: 'image/png' },
          { src: '/logo/simbolo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // NÃO fazer cache de imagens externas (Cloudinary) no SW:
        // - a CDN do Cloudinary + headers do Netlify (immutable) já fazem o cache
        // - cache de respostas "opacas" no SW fez as imagens ficarem partidas
        //   após um deploy (o SW servia a resposta em cache para sempre)
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [],
      },
    }),
  ],
  server: {
    port: 5176,
    proxy: {
      // O chat AI fala com a API do admin (Express, porta 5200)
      '/api/ai-chat': 'http://localhost:5200',
      '/api/ai-test': 'http://localhost:5200',
    },
  },
  }
})