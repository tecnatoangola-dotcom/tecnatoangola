// Mostra as políticas (tabelas + storage) do ANTIGO e as funções que elas usam.
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

const tabelas = (await velho.query(`
  SELECT tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies WHERE schemaname='public'
`)).rows
console.log('=== POLÍTICAS DE TABELAS (ANTIGO) ===')
for (const p of tabelas) {
  console.log(`[public.${p.tablename}] ${p.policyname} (${p.cmd}) TO ${p.roles}`)
  console.log(`   USING: ${p.qual}`)
  console.log(`   CHECK: ${p.with_check}`)
}

const storage = (await velho.query(`
  SELECT policyname, cmd, roles, qual, with_check
    FROM pg_policies WHERE schemaname='storage' AND tablename='objects'
`)).rows
console.log('\n=== POLÍTICAS DE STORAGE (ANTIGO) ===')
for (const p of storage) {
  console.log(`[storage.objects] ${p.policyname} (${p.cmd}) TO ${p.roles}`)
  console.log(`   USING: ${p.qual}`)
  console.log(`   CHECK: ${p.with_check}`)
}

await velho.end()
