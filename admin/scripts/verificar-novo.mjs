// Verificação END-TO-END do projecto NOVO — mesma mecânica usada pelo site real.
// IMPORTANTE: odomes INSERT fazem return=minimal (como o supabase-js do site usa);
// um INSERT anon com RETURNING não passa porque anon não tem política SELECT por desenho.
import 'dotenv/config'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const n = {
  url: limpar(process.env.NOVO_SUPABASE_URL),
  anon: limpar(process.env.NOVO_SUPABASE_ANON_KEY),
  service: limpar(process.env.NOVO_SUPABASE_SERVICE_KEY),
}

const resultados = []
const registra = (nome, ok, detalhe = '') => {
  resultados.push({ nome, ok })
  console.log(`${ok ? '✓' : '✗'} ${nome} ${detalhe}`)
}

// 1) conteúdo no servidor (como site/api/conteudo.mjs)
const conteudo = await fetch(`${n.url}/rest/v1/site_conteudo?select=chave`, {
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
})
registra('site_conteudo (service)', conteudo.ok, `HTTP ${conteudo.status}`)

// 2) leitura de candidaturas (como a página Perfil usa, por user_id)
const lida = await fetch(`${n.url}/rest/v1/candidaturas?select=id&limit=1`, {
  headers: { apikey: n.anon, Authorization: `Bearer ${n.anon}` },
})
registra('candidaturas SELECT (anon)', lida.ok, `HTTP ${lida.status}`)

// 3) INSERT como o site faz (return=minimal — sem RETURNING)
const ref = 'VERIF-' + Date.now().toString(36).toUpperCase()
const corpo = {
  referencia: ref, equipa: 'x', projecto: 'x', municipio: 'Luanda', area: 'x',
  whatsapp: '935000000', email: 'teste@tecnato.com', descricao: 'linha de teste — apagada no fim',
  video_path: 'candidaturas/verif/video.mp4', foto_path: 'candidaturas/verif/foto.png', status: 'submetida',
}
const inserida = await fetch(`${n.url}/rest/v1/candidaturas`, {
  method: 'POST',
  headers: { apikey: n.anon, Authorization: `Bearer ${n.anon}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  body: JSON.stringify(corpo),
})
registra('candidaturas INSERT (anon, como o site)', inserida.status === 201, `HTTP ${inserida.status}`)

// 4) eventos (track.js)
const ev = await fetch(`${n.url}/rest/v1/eventos`, {
  method: 'POST',
  headers: { apikey: n.anon, Authorization: `Bearer ${n.anon}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  body: JSON.stringify({ visitor_id: 'verificar', tipo: 'page_view', detalhe: 'verificação' }),
})
registra('eventos INSERT (anon, como o site)', ev.status === 201, `HTTP ${ev.status}`)

// 5) storage: upload anon no bucket candidaturas (vídeo/foto das candidaturas)
const caminho = `verif/${Date.now().toString(36)}.txt`
const subiu = await fetch(`${n.url}/storage/v1/object/candidaturas/${caminho}`, {
  method: 'POST',
  headers: { apikey: n.anon, Authorization: `Bearer ${n.anon}`, 'Content-Type': 'text/plain' },
  body: 'verificacao',
})
registra('storage upload anon (bucket candidaturas)', subiu.status === 200, `HTTP ${subiu.status}`)

// 6) ficheiro migrado de perfis legível (service)
const avatar = await fetch(`${n.url}/storage/v1/object/perfis/95926563-fdd3-4946-be22-17734cccf67b/avatar.jpg`, {
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
})
registra('ficheiro migrado (perfis/avatar)', avatar.ok, `HTTP ${avatar.status}`)

// 7) auth: não repetimos signup (limites de email 429 por hora já alcançados nos testes)
//    identidades/utilizadores contam-se por SQL? usamos o endpoint admin (service)
const users = await fetch(`${n.url}/auth/v1/admin/users?page=1&per_page=10`, {
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
})
const usersJson = users.ok ? await users.json() : null
registra('auth users via admin (service)', users.ok && usersJson?.users?.length >= 1, `HTTP ${users.status} (${usersJson?.users?.length ?? '?'} users)`)

// limpeza
if (inserida.status === 201) {
  const sai = await fetch(`${n.url}/rest/v1/candidaturas?referencia=eq.${ref}`, {
    method: 'DELETE', headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
  })
  registra('limpeza candidatura', sai.ok, `HTTP ${sai.status}`)
}
if (ev.status === 201) {
  const saiEv = await fetch(`${n.url}/rest/v1/eventos?visitor_id=eq.verificar&tipo=eq.page_view`, {
    method: 'DELETE', headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
  })
  registra('limpeza evento', saiEv.ok, `HTTP ${saiEv.status}`)
}
if (subiu.status === 200) {
  const saiSt = await fetch(`${n.url}/storage/v1/object/candidaturas/${caminho}`, {
    method: 'DELETE', headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
  })
  registra('limpeza storage', saiSt.ok, `HTTP ${saiSt.status}`)
}

const falhas = resultados.filter((r) => !r.ok)
console.log(`\n=== ${resultados.length - falhas.length}/${resultados.length} verificações OK ===`)
if (falhas.length) process.exit(1)
