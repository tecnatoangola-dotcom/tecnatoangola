// Diagnóstico: grants e RLS da tabela candidaturas visto pelos olhos do anon.
// Rollback no final — não altera nada na base de dados.
import 'dotenv/config'
import pg from 'pg'

const c = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await c.connect()

const grants = await c.query(
  `select grantee, privilege_type
     from information_schema.role_table_grants
    where table_schema='public' and table_name='candidaturas'
    order by grantee, privilege_type`,
)
console.log('grants na tabela candidaturas:')
for (const g of grants.rows) console.log(`  ${g.grantee}: ${g.privilege_type}`)

try {
  await c.query('BEGIN')
  await c.query('SET LOCAL ROLE anon')
  await c.query(
    `INSERT INTO public.candidaturas
       (referencia, equipa, projecto, municipio, area, whatsapp, email, descricao, video_path, foto_path, status)
     VALUES ('TESTE-ROLE','t','t','Luanda','t','935000000','t@t.com','teste','v','f','recebida')`,
  )
  console.log('INSERT como anon (na BD) -> OK ✓')
} catch (e) {
  console.log(`INSERT como anon (na BD) -> ERRO ${e.code}: ${e.message.split('\n')[0]}`.trim())
} finally {
  await c.query('ROLLBACK')
}

const authUsers = await c.query(`select usename from pg_catalog.pg_user where usename in ('anon','authenticated','postgres')`)
console.log('roles presentes:', authUsers.rows.map((r) => r.usename).join(', '))
await c.end()
