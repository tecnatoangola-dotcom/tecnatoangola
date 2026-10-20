// Corrige aud/role nas auth.users do NOVO (necessário para o GoTrue aceitar logins).
import 'dotenv/config'
import pg from 'pg'

const novo = new pg.Client({
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER,
  password: process.env.NOVO_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await novo.connect()
const r = (await novo.query(`UPDATE auth.users SET aud='authenticated', role='authenticated' WHERE aud IS NULL OR aud<>'' RETURNING email`)).rows
console.log('actualizados:', r.map((x) => x.email).join(', '))
const conf = (await novo.query(`SELECT email, aud, role FROM auth.users ORDER BY email`)).rows
for (const u of conf) console.log(`  ${u.email}: aud=${u.aud} role=${u.role}`)
await novo.end()
