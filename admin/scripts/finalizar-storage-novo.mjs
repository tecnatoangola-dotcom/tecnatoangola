// Recarrega a cache do PostgREST no projecto NOVO e garante as
// políticas de storage.objects copiadas do projecto antigo.
import 'dotenv/config'
import pg from 'pg'

const novo = new pg.Client({
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432, // session pooler — o NOTIFY só é entregue em linha com sessão
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER,
  password: process.env.NOVO_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
	await novo.connect()
await novo.query(`NOTIFY pgrst, 'reload schema'`)
console.log('NOTIFY pgrst enviado (session pooler 5432) OK')

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
  SELECT policyname AS name, cmd AS cmd, roles AS roles,
         qual AS qual, with_check AS withcheck
    FROM pg_policies
   WHERE schemaname = 'storage' AND tablename = 'objects'
   ORDER BY policyname
`)).rows
console.log(`politicas storage no ANTIGO: ${origem.length}`)

const destino = (await novo.query(`
  SELECT policyname AS name FROM pg_policies
   WHERE schemaname = 'storage' AND tablename = 'objects'
`)).rows.map((r) => r.name)
console.log('politicas storage no NOVO:', destino.join(', ') || '(nenhuma)')

const MAPA_CMD = { r: 'SELECT', w: 'INSERT', d: 'DELETE', a: 'ALL' }

for (const p of origem) {
  if (destino.includes(p.name)) {
    console.log(`  existente: ${p.name}`)
    continue
  }
  // pg_policies.roles vem em texto tipo {anon,authenticated}
  const listaRoles = String(p.roles || '{anon}')
    .replace(/^[{]|[_{}]$/g, '')
    .replace(/^\{|\}$/g, '')
  const comRoles = listaRoles.split(',').filter(Boolean).map((x) => `"${x}"`).join(',')
  const comando = p.cmd.toUpperCase()
  let sql = `CREATE POLICY "${p.name}" ON storage.objects FOR ${comando} TO ${comRoles}`
  if (p.qual) sql += ` USING (${p.qual})`
  if (p.withcheck) sql += ` WITH CHECK (${p.withcheck})`
  try {
    await novo.query(sql)
    console.log(`  criada: ${p.name} (${p.cmd})`)
  } catch (e) {
    console.log(`  falhou ${p.name}: ${e.message.slice(0, 90)}`)
  }
}

await velho.end()
await novo.end()
