# Publicar na Vercel — passo a passo

> Monorepo: **dois** projetos Vercel a partir de UM repositório GitHub
> (`tecnatoangola-dotcom/tecnatoangola`). Atualizado em 2026-11-09.
>
> Estrutura já preparada para a Vercel:
> - `site/` → frontend Vite + funções em `site/api/`
> - `admin/` → frontend Vite + API Express em `admin/api/[[...path]].mjs`

---

## 0. Antes de começar

- Repositório já está no GitHub (`master`).
- Conta em <https://vercel.com> (Hobby serve para testes; para uso comercial
  a Vercel exige o plano **Pro**).
- Node.js local ≥ 22.12 (o `package.json` já fixa `"engines": { "node": "22.x" }`).
- Os valores das variáveis estão em `publicar/ENV-NETLIFY.txt`
  (o nome é legado — os valores servem para a Vercel).

> ⚠️ **Branch:** o trabalho é enviado para `master`, mas o branch por omissão
> do GitHub é `main` (já alinhado com `master` neste momento). Em cada projeto
> da Vercel, define **Settings → Git → Production Branch = `master`** para que
> os deploys automáticos sigam os teus pushes.


> ⚠️ **Nunca** escolhas a raiz do repositório como Root Directory. Cada projeto
> usa a sua pasta (`site` ou `admin`). Se a raiz for escolhida, o build falha
> porque o `package.json` da raiz só tem o `lint`.

---

## 1. Projeto do SITE

1. <https://vercel.com/new> → **Import Git Repository** → `tecnatoangola`.
2. Configuração:
   - **Project Name:** `tecnatoangola` (ou outro)
   - **Root Directory:** `site`
   - **Framework Preset:** `Vite` (já forçado pelo `site/vercel.json`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. **Environment Variables** (Production + Preview + Development):

   | Variável | Obrigatória | Notas |
   |---|---|---|
   | `SUPABASE_URL` | sim | lida pela função `/api/conteudo` e `/api/ai-chat` |
   | `SUPABASE_SERVICE_KEY` | sim | só no servidor (nunca vai para o browser) |
   | `NVIDIA_API_KEY` | sim | chat Tecnocrata |
   | `NVIDIA_MODEL` | não | por omissão `nvidia/nemotron-3-ultra-550b-a55b` |
   | `VITE_SUPABASE_URL` | sim | **entra no build** (redeploy ao mudar) |
   | `VITE_SUPABASE_ANON_KEY` | sim | **entra no build** |
   | `VITE_SUPABASE_BUCKET` | sim | normalmente `candidaturas` |
   | `VITE_MAX_VIDEO_MB` | não | por omissão 30 |
   | `NODE_ENV` | sim | `production` |

4. **Deploy**.

### Funções do site (já existem no repo)

| Rota | Ficheiro | Runtime |
|---|---|---|
| `/api/conteudo` | `site/api/conteudo.mjs` | Node 22 |
| `/api/ai-chat` | `site/api/ai-chat.mjs` | Node 22, streaming SSE, `maxDuration=60` |

A função `/api/conteudo` remove campos que pareçam segredos (`apiKey`,
`secret`, `password`, `token`) antes de responder.

---

## 2. Projeto do ADMIN

1. <https://vercel.com/new> → mesmo repositório → **Add New → Project**.
2. Configuração:
   - **Root Directory:** `admin`
   - **Framework Preset:** `Vite` (já forçado pelo `admin/vercel.json`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables**:

   | Variável | Obrigatória | Notas |
   |---|---|---|
   | `SUPABASE_URL` | sim | |
   | `SUPABASE_SERVICE_KEY` | sim | |
   | `SUPABASE_BUCKET` | sim | `candidaturas` |
   | `SUPABASE_BUCKET_PERFIS` | sim | `perfis` |
   | `ADMIN_SECRET` | sim | ≥ 32 caracteres |
   | `ADMIN_USERS` | sim | JSON com os hashes scrypt (copiar exatamente) |
   | `ADMIN_ORIGIN` | sim | domínio(s) do admin, separados por vírgula — ex.: `https://tecnatoangolaadmin.vercel.app,https://admin.tecnatoangola.com` |
   | `ADMIN_AI_API_KEY` | não | se usares o teste de IA no CRM |
   | `ADMIN_AI_MODEL` | não | |
   | `NODE_ENV` | sim | `production` |

   > O código já aceita automaticamente o domínio `*.vercel.app` do projeto e
   > os URLs de preview (`VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL`).
   > `ADMIN_ORIGIN` continua obrigatório e deve incluir o domínio final.
   >
   > **Porquê:** mesmo em same-origin, o browser envia o header `Origin` nos
   > POST. Se o domínio não estiver na lista, o login falha com erro de CORS.

4. **Deploy**.

### API do admin

- `admin/api/[[...path]].mjs` exporta diretamente o Express de
  `admin/server/index.js` (todas as rotas `/api/*`).
- `maxDuration = 60` (exportação Excel e streaming da IA).
- `admin/server/index.js` **não** faz `listen` quando `process.env.VERCEL` existe.
- Dependências (`express`, `exceljs`, `@supabase/supabase-js`, …) vêm do
  `admin/package.json`; a Vercel instala-as sozinha.

---

## 3. Domínios

> **Situação atual:** o site foi apagado da Netlify e o domínio
> `tecnatoangola.com` continua com os nameservers da Netlify
> (`dns*.p08.nsone.net`), que já não respondem → o domínio está offline.
> É obrigatório alterar isto no **Hostinger** (ver abaixo).

1. Projeto do site → **Settings → Domains** → `tecnatoangola.com`
   (e `www.tecnatoangola.com` se quiseres).
2. Projeto do admin → **Settings → Domains** → `admin.tecnatoangola.com`.
3. A Vercel mostra os registos DNS necessários. Aplica-os no Hostinger.

### Hostinger — duas formas

**Opção A — usar os nameservers da Vercel (mais simples)**

No Hostinger: **hPanel → Domínios → tecnatoangola.com → Nameservers →
Alterar nameservers** → escolher “Usar nameservers personalizados”:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Depois a Vercel trata de tudo (SSL incluído). Se tiveres email no domínio,
confirma que os registos MX são recriados na Vercel.

**Opção B — manter o DNS no Hostinger (recomendado se houver email)**

1. No Hostinger, volta a pôr os nameservers padrão
   (`ns1.dns-parking.com`, `ns2.dns-parking.com`).
2. Em **hPanel → Domínios → DNS / Zona DNS**, adiciona os registos que a
   Vercel indicar. Normalmente:

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |
   | CNAME | `admin` | `cname.vercel-dns.com` |
   | TXT | `_vercel` | (valor de verificação que a Vercel mostra) |

   > Usa sempre os valores exatos que aparecem no dashboard da Vercel.

3. Só depois de o DNS propagar é que o certificado HTTPS é emitido.

> **Rollback:** o site da Netlify foi apagado. Se for preciso voltar atrás,
> cria um novo site na Netlify e publica a pasta
> `publicar/SITE-NETLIFY-ARRASTAR` (já compilada).

---

## 4. Verificação pós-deploy

Substitui `<site>` e `<admin>` pelos URLs da Vercel:

- `https://<site>/` → site abre, imagens carregam (Cloudinary).
- `https://<site>/api/conteudo` → JSON `{ "conteudo": … }` **sem** `apiKey`.
- `https://<site>/api/ai-chat` (GET) → `405` = função viva.
- Chat Tecnocrata responde e faz streaming.
- Registo/login de utilizador no site.
- `https://<admin>/api/health` → `{"ok":true,...}`.
- `https://<admin>/api/diagnostico` → `supabase_ok: true`, `n_admins: 2`.
- Login no admin (`/login`) → entra no dashboard.
- Upload de imagem em **Site** no admin.
- Exportação Excel (Candidaturas → exportar).
- Navegar direto para `/perfil` e atualizar a página (rewrite SPA).

---

## 5. Diferenças Netlify ↔ Vercel (já tratadas no código)

| Netlify | Vercel |
|---|---|
| `netlify.toml` (redirects/headers) | `vercel.json` (`rewrites` + `headers`) |
| `netlify/functions/conteudo.mjs` | `site/api/conteudo.mjs` |
| `netlify/functions/ai-chat.mjs` (v2/SSE) | `site/api/ai-chat.mjs` (`req,res`, `maxDuration=60`) |
| `netlify/functions/api.mjs` (bundle esbuild) | `admin/api/[[...path]].mjs` (Express direto) |
| arrastar pasta compilada | build automático no Git push |
| `SECRETS_SCAN_OMIT_KEYS` | não existe (segredos ficam no dashboard) |
| `.env` incluído na função | variáveis do dashboard; `.env` no `.vercelignore` |

### Limites da Vercel que afetam o projeto

| Limite | Valor | Impacto tratado |
|---|---|---|
| Corpo do pedido | **4,5 MB** | upload do admin limitado a **3 MB** (base64 cresce ~33%) |
| Resposta da função | 4,5 MB | exportação Excel muito grande pode falhar (raro) |
| Duração da função | até 60 s (configurado) | chat/Excel |
| Sistema de ficheiros | só leitura (`/tmp`) | o projeto não escreve ficheiros no disco |
| Node | 22.x | fixado em `engines` nos dois `package.json` |

> As imagens da galeria/hero são servidas pelo **Cloudinary** com
> `w_…,q_auto,f_auto` — não passam pela Vercel e não gastam banda da função.

---

## 6. Problemas comuns

| Sintoma | Causa provável | Correção |
|---|---|---|
| Build falha: “No build script” | Root Directory = raiz do repo | mudar para `site` ou `admin` |
| `404` em `/api/...` | pasta `api/` não publicada | confirmar Root Directory e redeploy |
| `500` na função | variável em falta | ver **Functions → Logs** na Vercel |
| Login admin dá erro/CORS | `ADMIN_ORIGIN` sem o domínio atual | adicionar o domínio e redeploy |
| “Sessão expirada” logo após login | cookie `secure` sem HTTPS | usar o domínio HTTPS da Vercel |
| Upload “demasiado grande” | ficheiro > 3 MB | comprimir antes de enviar |
| Site branco após deploy | build antigo em cache | **Redeploy** e limpar cache do browser |
| Imagens não atualizam | cache do Cloudinary | muda o nome/versão do ficheiro no Cloudinary |

---

## 7. Rollback para Netlify

O deploy Netlify continua documentado em `PUBLICAR-NETLIFY.md` e as pastas
`publicar/SITE-NETLIFY-ARRASTAR` e `publicar/ADMIN-NETLIFY-ARRASTAR` não foram
alteradas. Para voltar atrás: aponta o DNS para a Netlify e reativa o site lá.
