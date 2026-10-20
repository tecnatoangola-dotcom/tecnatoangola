// Aplica as GRANTs e privileges por omissão no projecto NOVO.
// (as tabelas migradas foram criadas por "postgres" — as default privileges
// do Supabase não se aplicaram — e sem GRANTs a API esconde as tabelas: 404)
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

const tabelas = (await novo.query(`
  SELECT tablename FROM pg_tables WHERE schemaname = 'public'
`)).rows.map((r) => r.tablename)
console.log('tabelas no NOVO:', tabelas.join(', '))

for (const tabela of tabelas) {
  await novo.query(`GRANT SELECT ON public."${tabela}" TO anon`)
  await novo.query(`GRANT INSERT, UPDATE, DELETE, SELECT ON public."${tabela}" TO authenticated`)
  await novo.query(`GRANT ALL ON public."${tabela}" TO service_role`)
}

// privileges por omissão para futuras tabelas criadas por postgres
await novo.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon`)
await novo.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE, SELECT ON TABLES TO authenticated`)
await novo.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role`)
await novo.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role`)

// recarrega a cache da API
await novo.query(`NOTIFY pgrst, 'reload schema'`)

// confirmação
const confere = (await novo.query(`
  SELECT grantee, count(*) AS tabelas
    FROM information_schema.role_table_grants
   WHERE table_schema = 'public'
   GROUP BY grantee ORDER BY grantee
`)).rows
console.log('grants finais:', confere.map((r) => `${r.grantee}: ${r.tabelas}`).join(' | '))
await novo.end()
