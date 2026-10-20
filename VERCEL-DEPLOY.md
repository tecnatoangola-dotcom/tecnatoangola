# Publicar na Vercel — passo a passo

> Monorepo: dois projectos Vercel a partir de UM repositório GitHub
> (`tecnatoangola-dotcom/tecnatoangola`).

## 1. Variáveis de ambiente

Vercel Dashboard → cada projecto → Settings → Environment Variables.
(`publicar/ENV-NETLIFY.txt` tem os valores prontos a copiar.)

**Ambos os projectos (site e admin):**

| Variável | Valor |
|---|---|
| SUPABASE_URL | https://pdjiiipdyhphjolkewrw.supabase.co |
| SUPABASE_SERVICE_KEY | (service key — só lê no servidor) |
| SUPABASE_BUCKET | candidaturas |
| SUPABASE_BUCKET_PERFIS | perfis |
| NODE_ENV | production |

**Só no projecto admin:**

| Variável | Valor |
|---|---|
| ADMIN_SECRET | (64 chars) |
| ADMIN_USERS | (JSON com hashes scrypt) |
| ADMIN_ORIGIN | https://tecnatoangola.vercel.app,https://admin.tecnatoangola.com |

A `VITE_*` da anon key: como o site é compilado na Vercel, adiciona também
`VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_BUCKET`.
Cada alteração de `VITE_*` exige um **redeploy**.

## 2. Importar os dois projectos

1. <https://vercel.com/new> → **Import** do repo `tecnatoangola`.
2. **Root Directory** = `site` → Deploy. (Framework Vite detectada;
   build `vite build` → `dist`; a function `/api/conteudo` vem de `site/api/`.)
3. Repete: **Add New → Project** → mesmo repo → **Root Directory** = `admin`
   → Deploy. (A API completa vem de `admin/api/[[...path]].mjs`.)
4. Domínios: Projecto site → `tecnatoangola.com` (Domain management);
   projecto admin → `admin.tecnatoangola.com`.

## 3. Verificar

- `https://<site>.vercel.app/api/conteudo` → JSON com `parceiros`/`candidatura`
- `https://<admin>.vercel.app/api/health` → `{"ok":true,...}`
- `https://<admin>.vercel.app/api/diagnostico` → origens e estado ✓

## Diferenças Vercel vs Netlify (já tratadas)

| Netlify | Vercel |
|---|---|
| `netlify.toml` (redirects) | `vercel.json` (rewrites SPA) |
| `netlify/functions/conteudo.mjs` | `site/api/conteudo.mjs` |
| função admin embutida `.mjs` esbuild | `admin/api/[[...path]].mjs` direto ao Express |
| variáveis no redesenho | `VITE_*` a cada build; resto noDeploy seguinte |
