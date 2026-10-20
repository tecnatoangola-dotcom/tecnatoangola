// Prova ponto-a-ponto do signup + confirmação com link fresco (sem depender de email real):
// 1) signup de email teste  2) generate_link  3) "clique" simulado no link  4) estado final  5) limpeza.
import 'dotenv/config'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const n = {
  url: limpar(process.env.NOVO_SUPABASE_URL),
  anon: limpar(process.env.NOVO_SUPABASE_ANON_KEY),
  service: limpar(process.env.NOVO_SUPABASE_SERVICE_KEY),
}
const email = `teste-fluxo-${Date.now().toString(36)}@tecnato.com`
const senha = 'Fluxo-Teste-2026!'

// 1) signup com anon key — pedido de confirmação
const sg = await fetch(`${n.url}/auth/v1/signup`, {
  method: 'POST',
  headers: { apikey: n.anon, Authorization: `Bearer ${n.anon}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: senha }),
})
const sgJ = await sg.json()
console.log('1) signup:', sg.status, sgJ.user ? `user ${sgJ.user.id}` : JSON.stringify(sgJ).slice(0, 120))

// 2) admin: action_link de signup para o MESMO utilizador
const gl = await fetch(`${n.url}/auth/v1/admin/generate_link`, {
  method: 'POST',
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'signup', email }),
})
const glJ = await gl.json()
console.log('2) generate_link:', gl.status)
if (!glJ.action_link) {
  console.log('   detalhe:', JSON.stringify(glJ).slice(0, 200))
  process.exit(1)
}
// mostra o redirect_to (que revela a SITE URL configurada!)
const redirect = new URL(glJ.action_link).searchParams.get('redirect_to')
console.log('   redirect_to configurado:', redirect)
console.log('   (se for localhost → a config "Site URL" da autenticação aponta para dev)')

// 3) simula o clique (como o Gmail faria)
const click = await fetch(glJ.action_link, { redirect: 'manual' })
const location = click.headers.get('location') || ''
console.log('3) clique no link:', click.status, '→', location.slice(0, 160), '...')
const okConfirm = location.includes('#access_token=') || location.includes('?code=')
console.log('   RESULTADO da confirmação:', okConfirm ? '✓ TOKEN VÁLIDO → sessão devolvida ao site' : '✗ problema na cadeia')

// 4) estado final do utilizador
const admin = await fetch(`${n.url}/auth/v1/admin/users?per_page=50&page=1`, {
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
}).then((r) => r.json())
const alvo = (admin.users || []).find((u) => u.email === email)
console.log('4) user confirmado?', alvo ? (!!alvo.email_confirmed_at ? '✓ sim' : '✗ não') : '(não encontrado)')

// 5) limpeza (o teste não deve deixar user)
if (alvo?.id) {
  const del = await fetch(`${n.url}/auth/v1/admin/users/${alvo.id}`, {
    method: 'DELETE',
    headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
  })
  console.log('5) limpeza user teste:', del.status === 200 ? '✓ apagado' : del.status)
}

// 6) prova do segundo clique no MESMO link (reproduz o erro do utilizador)
const again = await fetch(glJ.action_link, { redirect: 'manual' })
const loc2 = again.headers.get('location') || ''
console.log('6) segundo clique no MESMO link:', again.status, '→', loc2.includes('otp_expired') ? 'otp_expired (EXACTAMENTE o erro que viste ✓ explicado)' : loc2.slice(0, 120))
