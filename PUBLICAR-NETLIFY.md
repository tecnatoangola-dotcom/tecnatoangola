# Publicar no Netlify — passo a passo

> Os valores das variáveis de ambiente estão em `publicar/ENV-NETLIFY.txt` (ficheiro local, fora do git, porque tem segredos).

## Estrutura das pastas prontas a publicar

`publicar/` fica **fora do git** (tem segredos). Dentro há duas pastas, uma para cada site Netlify:

```
publicar/site/            → site principal (tecnatoangola.com)
├── dist/                 site já compilado (o que o Netlify publica)
├── netlify/functions/    function /api/conteudo (conteúdo do CRM)
├── netlify.toml          redirects + headers + CSP
├── package.json          build sem efeito ("echo build-ok")
└── .gitignore            garante que o dist é versionado

publicar/admin/           → CRM (admin.tecnatoangola.com)
├── dist/                 interface do CRM já compilada
├── netlify/functions/    api.mjs (API Express completa, já embutida)
├── netlify.toml
├── package.json
└── .gitignore
```

## Caminho 1 — GitHub (recomendado, actualizações automáticas)

1. Cria **dois repositórios** GitHub (um para o site, outro para o admin).
2. Copia **todo o conteúdo** de `publicar/site` para o repo do site (e de `publicar/admin` para o do admin).
   - ⚠️ O `dist/` **tem de ir** para o repo. Se o `.gitignore` da raiz o estiver a ignorar, força com:
     ```bash
     git add -A -f .
     git commit -m "dist compilado + package.json"
     git push
     ```
   - Confirma com `git ls-files dist` (tem de listar ficheiros).
3. No Netlify: **Add new site → Import an existing project** → escolhe o repo. Sem *Base directory*.
4. Adiciona as variáveis de ambiente (ver `publicar/ENV-NETLIFY.txt`):
   - Equipa → **Environment variables** (partilhadas): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `SUPABASE_BUCKET_PERFIS`, `NODE_ENV`, `VITE_*`.
   - Site do admin → **Site settings → Environment variables**: `ADMIN_SECRET`, `ADMIN_USERS`, `ADMIN_ORIGIN`.
5. Testa: `https://<dominio>/api/health` → `{"ok":true,"service":true,"admins":2}`.

### Erros já vistos (e a causa)

| Erro | Causa | Solução |
|---|---|---|
| `Could not read package.json` | repo sem `package.json` na raiz | já resolvido (o `package.json` veio com a pasta) |
| `Deploy directory 'dist' does not exist` | o `dist/` ficou de fora do repo (ignorado) | `git add -A -f .` para versionar o `dist` |
| `Build script returned non-zero exit code: 2` | script de build com caracteres especiais | o build é agora `echo build-ok` (ASCII puro) |

## Caminho 2 — Arrastar (sem build nenhum)

1. Apaga o sítio que falhou e arrasta `publicar/site/dist` em <https://app.netlify.com/drop>.
2. ⚠️ Arrastar só o `dist` **perde a function** `/api/conteudo` (o conteúdo do CRM deixa de aparecer).
   Arrasta a pasta `publicar/site` inteira — o Netlify publica o `dist` indicado no `netlify.toml`.
3. Repete para o admin com `publicar/admin`.

## Caminho 3 — Repositório completo (para mexer no código)

Liga o repositório completo (`E:\Tecnato\repo`) e define em cada sítio:
**Site settings → Build & deploy → Build → Base directory** = `site` (site principal) ou `admin` (CRM).
O Netlify lê o `netlify.toml` dessa pasta e compila tudo (com as `VITE_*` do ambiente).

## Actualizar depois

- **Textos, fotos, vídeo**: nada de deploy — edita na aba **Site** do CRM (o site lê em `/api/conteudo`).
- **Código**: `npm run build` em `site/` e `admin/`, copia de novo as `dist` para `publicar/*/dist` e faz push (o Netlify redesenha sozinho).
