import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// Em desenvolvimento serve /api/conteudo com a mesma lógica da function
// Netlify: lê a tabela site_conteudo com a service key, para o site mostrar
// o conteúdo editado no CRM sem depender da anon key.
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
          const url = env.SUPABASE_URL
          const key = env.SUPABASE_SERVICE_KEY
          if (!url || !key) {
            responder(500, { error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY em falta no site/.env.' })
            return
          }
          const r = await fetch(`${url}/rest/v1/site_conteudo?select=chave,valor`, {
            headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
          })
          const rows = await r.json()
          const conteudo = {}
          if (Array.isArray(rows)) for (const row of rows) conteudo[row.chave] = row.valor
          responder(r.ok ? 200 : 500, { conteudo })
        } catch (error) {
          responder(500, { error: String(error?.message || error) })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), conteudoDev()],
})
