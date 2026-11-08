import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv } from 'vite'

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
