// Fecha os timestamps NULL em auth.users do NOVO com os valores reais do ANTIGO.
import 'dotenv/config'
import pg from 'pg'

const velho = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await velho.connect()
const origem = (await velho.query(`
  SELECT id, created_at, updated_at, last_sign_in_at, confirmed_at IS NULL AS sem_confirm
    FROM auth.users ORDER BY created_at
`)).rows
await velho.end()

const c = new pg.Client({
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER,
  password: process.env.NOVO_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await c.connect()

for (const u of origem) {
  await c.query(
    `UPDATE auth.users
        SET created_at = COALESCE(created_at, $2),
            updated_at = COALESCE(updated_at, $3),
            last_sign_in_at = COALESCE(last_sign_in_at, $4)
      WHERE id = $1`,
    [u.id, u.created_at, u.updated_at, u.last_sign_in_at],
  )
}
const falta = (await c.query(`SELECT id, email, created_at, updated_at FROM auth.users WHERE created_at IS NULL OR updated_at IS NULL`)).rows
console.log('sem created_at/updated_at agora:', falta.length)
for (const f of falta) console.log(`  ${f.email}: created=${f.created_at} updated=${f.updated_at}`)
await c.end()

// admin list outra vez
const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const r = await fetch(`${limpar(process.env.NOVO_SUPABASE_URL)}/auth/v1/admin/users?per_page=10&page=1`, {
  headers: { apikey: limpar(process.env.NOVO_SUPABASE_SERVICE_KEY), Authorization: `Bearer ${limpar(process.env.NOVO_SUPABASE_SERVICE_KEY)}` },
})
const txt = await r.text()
console.log(`admin users NOVO: HTTP ${r.status} → ${txt.slice(0, 150).replace(/\s+/g, ' ')}`)
