# Publicar no Netlify — procedimento definitivo (TECNATO)

> **Última atualização: 2026-11-07.** Este é o procedimento que **funciona** (validado em produção).
> Documentos antigos com "Caminhos 1/2/3" foram removidos — causavam confusão.

## A única forma de publicar (arrastar)

**Site principal (tecnatoangola.com) — arrastar SÓ esta pasta:**

```
publicar/SITE-NETLIFY-ARRASTAR/
├── index.html, assets/, images/, logo/ ...  ← site compilado NA RAIZ (sem pasta dist)
├── sw.js, manifest.webmanifest, registerSW.js
├── netlify/functions/conteudo.mjs            ← API /api/conteudo (contém o CRM)
├── netlify/functions/ai-chat.mjs             ← API /api/ai-chat (Tecnocrata)
└── netlify.toml                              ← publish = ".", SEM comando de build
```

⚠️ **Não arrastes** `site/` (código-fonte), `publicar/site/` (tem `npm run build` + `publish = dist` → dá o erro `Deploy directory 'dist' does not exist`), `publicar/site-drop/` (legado, sem functions) nem `deploy-site/`.

**Passos:**
1. Abre https://app.netlify.com/drop e arrasta a pasta `publicar/SITE-NETLIFY-ARRASTAR` **inteira, de uma vez** (não abras, não copies ficheiro a ficheiro).
2. Espera "Published".
3. Cola as variáveis (ver `publicar/ENV-NETLIFY-CHECKLIST.md`) em **Site settings → Environment variables**.
4. **Arrasta a pasta outra vez** — no Drop é o arrastar que aplica as variáveis novas (não há "Trigger deploy" no Drop).

**Admin (CRM) — arrastar SÓ esta pasta:**

```
publicar/ADMIN-NETLIFY-ARRASTAR/
├── index.html, assets/ ...  ← interface compilada NA RAIZ
├── netlify/functions/api.mjs  ← API completa (Express) em 1 ficheiro único
├── netlify.toml               ← publish = ".", redirect /api/* → function
└── (domínio: https://tecnatoangolaadmin005.netlify.app/)
```

Mesmos passos: arrastar inteira → colar variáveis do admin → arrastar de novo.
Sem isto, o login dá **404 em `/api/login`** ("Credenciais inválidas") porque a
função não foi publicada — as credenciais estão certas, falta a API.
Se der **502**, a função está a crashar: ou era o `import.meta.url` no bundle
(já corrigido no `server/index.js` com fallback para `process.cwd()`), ou faltam
variáveis de segurança no Netlify (`ADMIN_SECRET`, `ADMIN_USERS`,
`ADMIN_ORIGIN`, `SUPABASE_*`) — o servidor recusa arrancar em produção sem elas.

> Nota: a `api.mjs` desta pasta é o bundle esbuild de
> `admin/netlify/functions/api.mjs` + `admin/server/index.js` (Express, Supabase,
> ExcelJS dentro de 1 ficheiro) — não editar à mão. Refazer com:
> `npx esbuild admin/netlify/functions/api.mjs --bundle --platform=node --format=esm --outfile=publicar/ADMIN-NETLIFY-ARRASTAR/netlify/functions/api.mjs`

## Variáveis para colar (resumo)

**Site:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NVIDIA_API_KEY`, `NVIDIA_MODEL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_BUCKET=candidaturas`, `VITE_MAX_VIDEO_MB=30`, `NODE_ENV=production`

**Admin:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `SUPABASE_BUCKET_PERFIS`, `ADMIN_SECRET`, `ADMIN_USERS` (JSON completo), `ADMIN_ORIGIN=https://tecnatoangolaadmin005.netlify.app`, `ADMIN_AI_API_KEY`, `ADMIN_AI_MODEL`, `NODE_ENV=production`

Lista completa com testes: `publicar/ENV-NETLIFY-CHECKLIST.md`.

## Erros que NÃO devemos repetir

| Sintoma | Causa | Fix |
|---|---|---|
| `Deploy directory 'dist' does not exist` | `netlify.toml` com `publish = dist` + `npm run build` ao arrastar | Usar pasta com site **na raiz** e `publish = "."`, sem build |
| `npm run build` corrói em "echo build-ok" e depois falha no publish | Pasta `publicar/site` arrastada — tem `package.json` de build | Não usar `publicar/site` para arrastar |
| Imagens partidas no site publicado | SW (PWA) cacheava imagens Cloudinary com respostas em erro (`CacheFirst` + status 0) | Removido caching de terceiros no SW; `main.jsx` em PROD apaga caches legadas |
| Site branco ao atualizar | SW "fantasma" servia `index.html`/assets antigos | `main.jsx`: SW só em PROD; em dev apaga SWs e caches |
| Bundle de dev em produção (site lento/grande) | `NODE_ENV=development` no shell → `npm run build` gerava `jsxDEV`, `PROD=false` | `vite.config.js` força `NODE_ENV=production` no build (site e admin) |
| Chat Tecnocrata: `currentInput is not defined` | `AISupport.jsx` usava `currentInput` em vez de `texto` | Corrigido para `message: texto` |
| `/api/conteudo` 404 | Deploy desatualizado (function não incluída) | Arrastar pasta com `netlify/functions/conteudo.mjs` |

## Atualizar depois

- **Textos, fotos, vídeo**: nada de deploy — edita na aba **Site** do CRM (`/api/conteudo`).
- **Código**: `npm run build` em `site/` e `admin/` (com `NODE_ENV=production`), copia o `dist` para `publicar/SITE-NETLIFY-ARRASTAR/` (substituir tudo), arrasta de novo para https://app.netlify.com/drop.
