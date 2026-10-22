// Regenera publicar/site-drop a partir de site/dist + _redirects + _headers (UTF-8 sem BOM)
import fs from 'node:fs'
import path from 'node:path'

const RAIZ = process.cwd()
const dist = path.join(RAIZ, 'site', 'dist')
const drop = path.join(RAIZ, 'publicar', 'site-drop')

// 1. recria a pasta vazia
fs.rmSync(drop, { recursive: true, force: true })
fs.mkdirSync(drop, { recursive: true })

// 2. copia o build inteiro
fs.cpSync(dist, drop, { recursive: true })

// 3. reescreve as regras de rede (sem BOM — bytes exactos)
const REDIRECTS = '/* /index.html 200'
const HEADERS = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; connect-src 'self' https://*.supabase.co https://*.supabase.in; img-src 'self' data: https:; media-src 'self' blob: https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; base-uri 'self'; frame-src https://www.youtube.com https://player.vimeo.com; frame-ancestors 'none'; form-action 'self'
`
fs.writeFileSync(path.join(drop, '_redirects'), Buffer.from(REDIRECTS, 'utf8'))
fs.writeFileSync(path.join(drop, '_headers'), Buffer.from(HEADERS, 'utf8'))

// 4. auto-verificação: sem BOM em fichas de texto críticos + presença de ícones no HTML/JS
let bom = false
for (const nome of ['_redirects', '_headers']) {
  const b = fs.readFileSync(path.join(drop, nome))
  if (b[0] === 0xef || b[0] === 0x22) bom = true
  console.log(`${nome}: ${b.length} bytes · BOM: ${b[0] === 0xef ? 'SIM (mal!)' : 'não (bem)'}`)
}
const assets = path.join(drop, 'assets')
const js = fs.readdirSync(assets).filter((f) => f.endsWith('.js'))
let temIcones = false
for (const f of js) {
  const t = fs.readFileSync(path.join(assets, f), 'utf8')
  if (t.includes('megafone') && t.includes('engrenagem')) { temIcones = true; break }
}
console.log(`assets: ${js.length} ficheiros JS · ícones no bundle: ${temIcones ? 'SIM' : 'NÃO (verificar!)'}`)
console.log(bom ? 'ATENÇÃO: BOM detectado' : 'OK: site-drop regenerado, pronto para arrastar')
