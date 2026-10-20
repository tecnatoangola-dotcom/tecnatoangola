// Diagnóstico e preparação da migração do Supabase para o NOVO projecto.
//   OLD = projecto actual (E:\Tecnato\repo\admin\.env, padrão DB_* + SUPABASE_*)
//   NEW = projecto criado pela Vercel (variáveis NOVO_* neste .env)
//
// Nenhuma alteração de dados acontece em OLD. A migração só escreve em NEW.
import 'dotenv/config'
import pg from 'pg'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')

const ALVO = {
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: Number(process.env.NOVO_DB_PORT || 6543),
  database: process.env.NOVO_DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER || 'postgres.ohcagdukycwuetaqwynd',
  password: limpar(process.env.NOVO_DB_PASSWORD),
  ssl: { rejectUnauthorized: false },
}

if (!ALVO.password) {
  console.log('NOVO_DB_PASSWORD em falta no .env — nada a fazer.')
  process.exit(1)
}

const antigo = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await antigo.connect()

console.log('=== PROJECTO ANTIGO (origem da migração) ===')
const tabelas = await antigo.query(`
  select c.relname as tabela from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname='public' and c.relkind='r' order by c.relname
`)
for (const t of tabelas.rows) {
  const { rows } = await antigo.query(`select count(*)::int as n from public."${t.tabela}"`)
  console.log(`  tabela ${t.tabela}: ${rows[0].n} linhas`)
}
const buckets = await antigo.query(`select id, public from storage.buckets order by id`)
console.log('  buckets:', buckets.rows.map((b) => `${b.id}${b.public ? '(publico)' : ''}`).join(', ') || '(nenhum)')
const auths = await antigo.query(`select count(*)::int as n from auth.users`)
console.log('  utilizadores auth.users:', auths.rows[0].n)
const politicas = await antigo.query(`
  select tablename, policyname, cmd from pg_policies
  where schemaname='public' order by tablename, policyname
`)
console.log('  políticas RLS:', politicas.rows.length)
await antigo.end()

console.log('\n=== PROJECTO NOVO (destino) — teste de ligação ===')
const novo = new pg.Client(ALVO)
try {
  await novo.connect()
  const q = await novo.query(`select current_database(), current_user, version()`)
  console.log(`  ligado ✓  base: ${q.rows[0].current_database}  user: ${q.rows[0].current_user}`)
  const ext = await novo.query(`select extname from pg_extension order by extname`)
  console.log('  extensões existentes:', ext.rows.map((e) => e.extname).join(', '))
  const tabs = await novo.query(`
    select count(*)::int as n from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname='public' and c.relkind='r'
  `)
  console.log('  tabelas public no destino:', tabs.rows[0].n)
  await novo.end()
} catch (e) {
  console.log('  ERRO:', e.message)
  try { await novo.end() } catch { /* sem ligação */ }
  process.exit(1)
}
