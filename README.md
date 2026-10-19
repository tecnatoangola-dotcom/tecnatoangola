# TECNATO — Monorepo

Plataforma de identificação, valorização e visibilidade de talentos, projectos e
iniciativas (Luanda, Angola). Este repositório contém os dois projectos:

| Pasta | Projecto | Stack | Portas (dev) |
| --- | --- | --- | --- |
| `site/` | Landing + candidaturas (PT-AO) | Vite + React + Tailwind v4 | `5174` |
| `admin/` | CRM / painel administrativo | Express + React + Recharts | UI `5175`, API `5200` |

## Desenvolvimento local

```powershell
# Raiz — lint de todo o monorepo (site + admin)
npm install
npm run lint

# Site
cd site; npm install; npm run dev -- --port 5174 --strictPort

# Admin (API + UI em paralelo)
cd admin; npm install; npm run dev
```

### Ficheiros `.env` (nunca commitados)

- `site/.env` — ver `site/.env.example`:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_BUCKET=candidaturas`, `VITE_MAX_VIDEO_MB=30`
- `admin/.env` — ver `admin/.env.example`:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `SUPABASE_BUCKET_PERFIS`
  - `ADMIN_SECRET`, `ADMIN_USERS` (JSON com hashes scrypt), `ADMIN_ORIGIN`

## Publicar no Netlify (2 sites, 1 repositório)

1. **Site TECNATO**
   - *Base directory:* `site`
   - Build: `npm run build` · Publish: `dist` (lidos do `site/netlify.toml`)
   - Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_BUCKET=candidaturas`, `VITE_MAX_VIDEO_MB=30`
2. **Admin CRM**
   - *Base directory:* `admin`
   - Build: `npm run build` · Publish: `dist` · Functions: `netlify/functions`
   - Env vars: `NODE_ENV=production`, `ADMIN_ORIGIN=https://<dominio-admin>`, `ADMIN_SECRET`, `ADMIN_USERS`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET=candidaturas`, `SUPABASE_BUCKET_PERFIS=perfis`
   - Depois de criar o site admin, copia o domínio gerado para `ADMIN_ORIGIN` e para o CORS do servidor.

## Segurança

- Sessão admin em cookie httpOnly (`SameSite=Strict`, `Secure` em produção).
- Senhas admin guardadas como hashes **scrypt** (plaintext rejeitado em produção).
- Rate limit no login, CORS restrito a `ADMIN_ORIGIN`, headers de segurança (CSP, nosniff, DENY).
- `.env` fora do git (`.gitignore` cobre `.env` e `.env.*` em todo o repositório).
