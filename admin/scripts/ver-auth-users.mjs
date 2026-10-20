// Contagem real de auth.users/id refresh no NOVO vs ANTIGO.
import 'dotenv/config'
import pg from 'pg'

const faz = async (rotulo, cfg, port) => {
  const c = new pg.Client({ ...cfg, port, ssl: { rejectUnauthorized: false } })
  await c.connect()
  const u = (await c.query(`SELECT count(*)::int AS n FROM auth.users`)).rows[0].n
  const i = (await c.query(`SELECT count(*)::int AS n FROM auth.identities`)).rows[0].n
  const emails = (await c.query(`SELECT email, (raw_app_meta_data->>'provider') AS prov, created_at::date AS dia FROM auth.users ORDER BY created_at`)).rows
  console.log(`${rotulo}: users=${u} identities=${i}`)
  for (const e of emails) console.log(`   - ${e.email} (dia=${e.dia})`)
  await c.end()
}

await faz('NOVO', {
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER,
  password: process.env.NOVO_DB_PASSWORD,
}, 5432)
await faz('ANTIGO', {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}, Number(process.env.DB_PORT || 6543))
