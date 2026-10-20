// Diagnóstico do fluxo de confirmação de email:
// 1) settings da auth  2) estado dos users  3) gerar ACTION LINK de signup e simular o clique.
import 'dotenv/config'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const n = {
  url: limpar(process.env.NOVO_SUPABASE_URL),
  anon: limpar(process.env.NOVO_SUPABASE_ANON_KEY),
  service: limpar(process.env.NOVO_SUPABASE_SERVICE_KEY),
}

// 1) settings públicas da auth
const set = await fetch(`${n.url}/auth/v1/settings`, { headers: { apikey: n.anon } })
console.log('auth settings:', JSON.stringify(await set.json(), null, 0).slice(0, 400))

// 2) estado dos utilizadores (confirmado? token pendente?)
const users = await fetch(`${n.url}/auth/v1/admin/users?per_page=50&page=1`, {
  headers: { apikey: n.service, Authorization: `Bearer ${n.service}` },
}).then((r) => r.json())
for (const u of users.users || []) {
  console.log(`\nuser: ${u.email}`)
  console.log(`  confirmado: ${!!u.email_confirmed_at}  criado: ${u.created_at}  último send: ${(u.confirmation_sent_at || '(n/a)').substring(0, 25)}`)
}

// 3) gera action_link fresco para o email ainda não confirmado
const emailAlvo = (users.users || []).find((u) => !u.email_confirmed_at)?.email
console.log(`\nalvo do teste: ${emailAlvo || '(ninguém não confirmado — usar novo signup)'}`)
if (emailAlvo) {
  const gl = await fetch(`${n.url}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: { apikey: n.service, Authorization: `Bearer ${n.service}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'signup', email: emailAlvo }),
  })
  const bj = await gl.json()
  console.log('generate_link HTTP', gl.status)
  if (bj.action_link) {
    console.log('action_link (primeiros 120):', bj.action_link.slice(0, 120))
    // simula o "clique" no link de confirmação
    const click = await fetch(bj.action_link, { redirect: 'manual' })
    const local = click.headers.get('location') || '(sem location)'
    console.log('clique HTTP', click.status, '→ redirect:', local.slice(0, 140))
    console.log('   * começa com token OK aqui significa que a cadeia de confirmação FUNCIONA')
  } else {
    console.log('sem action_link:', JSON.stringify(bj).slice(0, 200))
  }
}
