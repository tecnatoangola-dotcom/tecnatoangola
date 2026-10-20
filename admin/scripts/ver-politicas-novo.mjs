// Mostra as políticas + grants de candidaturas no NOVO.
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

const t = (await novo.query(`SELECT tablename, policyname, cmd, roles, qual, with_check FROM pg_policies WHERE schemaname='public' ORDER BY tablename, policyname`)).rows
console.log('=== POLÍTICAS DE TABELAS (NOVO) ===')
for (const p of t) {
  console.log(`[${p.tablename}] ${p.policyname} (${p.cmd}) TO ${p.roles}`)
  console.log(`   USING: ${p.qual}`)
  console.log(`   CHECK: ${p.with_check}`)
}

const g = (await novo.query(`SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name='candidaturas' ORDER BY grantee, privilege_type`)).rows
console.log('\ngrants candidaturas (NOVO):', g.map((x) => `${x.grantee}:${x.privilege_type}`).join(' | '))

// como fica um INSERT anonymo avaliado: roda a verificação real de política
const teste = (await novo.query(`select ((select with_check from pg_policies where schemaname='public' and tablename='candidaturas' and policyname='candidaturas_insert_publico') is not null) as politica_existe`)).rows
console.log('política candidaturas_insert_publico presente:', teste[0].politica_existe)

await novo.end()
