// Garante os buckets (com a mesma configuração do antigo) no projecto novo, via SQL.
import 'dotenv/config'
import pg from 'pg'

const novo = new pg.Client({
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: Number(process.env.NOVO_DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER,
  password: process.env.NOVO_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await novo.connect()

const buckets = [
  { id: 'candidaturas', publico: false },
  { id: 'perfis', publico: false },
  { id: 'site', publico: true },
]
for (const b of buckets) {
  await novo.query(
    `INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
     VALUES ($1, $1, $2, false, NULL, NULL)
     ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public`,
    [b.id, b.publico],
  )
}
const atual = await novo.query(`SELECT id, public FROM storage.buckets ORDER BY id`)
console.log('NOVO buckets:', atual.rows.map((b) => `${b.id}${b.public ? '(publico)' : '(privado)'}`).join(', '))
await novo.end()
