import { withDb } from './db.mjs'

const r = await withDb(async (db) => {
  const tables = await db.query(
    `select table_name from information_schema.tables
     where table_schema='public' and table_type='BASE TABLE'
     order by table_name`
  )
  const buckets = await db.query(`select id, public, name from storage.buckets order by id`)
  let cols = { candidaturas: [], perfis: [], eventos: [] }
  for (const t of Object.keys(cols)) {
    try {
      const q = await db.query(
        `select column_name, data_type from information_schema.columns
         where table_schema='public' and table_name=$1 order by ordinal_position`,
        [t]
      )
      cols[t] = q.rows.map((c) => `${c.column_name} (${c.data_type})`)
    } catch {}
  }
  let pol = []
  try {
    const q = await db.query(
      `select tablename, policyname from pg_policies where schemaname='public' order by tablename`
    )
    pol = q.rows
  } catch {}
  return { tables: tables.rows.map((t) => t.table_name), buckets: buckets.rows, cols, pol }
})

console.log('TABLES:', r.tables.join(', ') || '(none)')
console.log('BUCKETS:', r.buckets.map((b) => `${b.id}${b.public ? ' (public)' : ''}`).join(', ') || '(none)')
for (const [t, c] of Object.entries(r.cols)) console.log(`COLS ${t}:`, c.length ? c.join(' | ') : '(não existe)')
console.log('POLICIES:', r.pol.length ? r.pol.map((p) => `${p.tablename}.${p.policyname}`).join(', ') : '(none)')
