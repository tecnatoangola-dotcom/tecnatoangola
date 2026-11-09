# Publicar na Vercel — passo a passo

> Monorepo: dois projetos Vercel a partir de UM repositório GitHub
> (`tecnatoangola-dotcom/tecnatoangola`). Atualizado em 2026-11-09.

## 1. Variáveis de ambiente

Vercel Dashboard → cada projeto → **Settings → Environment Variables**.

Os valores estão prontos em `publicar/ENV-NETLIFY.txt` (copia linha a linha;
o nome do ficheiro é legado — os valores servem para a Vercel também).

**Projeto site (`tecnatoangola.com`):**
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NVIDIA_API_KEY`, `NVIDIA_MODEL`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_BUCKET`,
`VITE_MAX_VIDEO_MB`, `NODE_ENV=production`

**Projeto admin (`admin.tecnatoangola.com`):**
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `SUPABASE_BUCKET_PERFIS`,
`ADMIN_SECRET`, `ADMIN_USERS` (JSON), `ADMIN_ORIGIN` (domínio do admin na Vercel —
ex.: `https://tecnatoangolaadmin005.vercel.app` ou o custom domain),
`ADMIN_AI_API_KEY`, `ADMIN_AI_MODEL`, `NODE_ENV=production`

⚠️ `VITE_*` são **embutidas no build** — mudar uma `VITE_` exige novo deploy.
O resto só entra no deploy seguinte (fonctions leem no runtime).

## 2. Importar os dois projetos

1. https://vercel.com/new → **Import** do repo `tecnatoangola`.
2. **Root Directory** = `site` → Deploy. (Vite detectada; build `vite build` →
   `dist`; functions em `site/api/`.)
3. **Add New → Project** → mesmo repo → **Root Directory** = `admin` → Deploy.
   (API via `admin/api/[[...path]].mjs` → Express de `admin/server/index.js`.)
4. Domínios: site → `tecnatoangola.com`; admin → `admin.tecnatoangola.com`
   (Domain management; adicionar os registos DNS que a Vercel indicar).

## 3. Verificar

- `https://<site>.vercel.app/api/conteudo` → JSON (sem `apiKey` — sanitizado)
- `https://<site>.vercel.app/api/ai-chat` (GET) → 405 (só POST) = função viva
- `https://<admin>.vercel.app/api/health` → `{"ok":true,…}`
- `https://<admin>.vercel.app/api/diagnostico` → `supabase_ok: true`, `n_admins: 2`

## Paridade Netlify ↔ Vercel (já tratada)

| Netlify (pasta arrastada) | Vercel (repo) |
|---|---|
| `netlify.toml` redirects/headers | `vercel.json` rewrites + headers |
| `netlify/functions/conteudo.mjs` | `site/api/conteudo.mjs` (com sanitização) |
| `netlify/functions/ai-chat.mjs` (v2/SSE) | `site/api/ai-chat.mjs` (`req,res`, `maxDuration=60`) |
| `netlify/functions/api.mjs` (bundle esbuild) | `admin/api/[[...path]].mjs` direto ao Express (deps via `package.json`) |
| variáveis + arrastar de novo | variáveis no dashboard + redeploy |
| scan de segredos (`SECRETS_SCAN_OMIT_KEYS`) | não existe na Vercel |

**O bundle esbuild (`ADMIN-NETLIFY-ARRASTAR/netlify/functions/api.mjs`) só é
necessário no Netlify.** Na Vercel, o Node instala `express`, `@supabase/supabase-js`,
`exceljs`, `serverless-http`… a partir de `admin/package.json` e o Express é
exportado diretamente como função.
