import { withDb } from './db.mjs'

const r = await withDb(async (db) => {
  const pub = await db.query(
    `select tablename, policyname, cmd, qual, with_check
     from pg_policies where schemaname='public' order by tablename, policyname`
  )
  const sto = await db.query(
    `select tablename, policyname, cmd, qual, with_check
     from pg_policies where schemaname='storage' and tablename='objects'
     order by policyname`
  )
  const rls = await db.query(
    `select n.nspname, c.relname, c.relrowsecurity
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where (n.nspname='public' and c.relname in ('candidaturas','eventos','perfis'))
        or (n.nspname='storage' and c.relname='objects')`
  )
  return { pub: pub.rows, sto: sto.rows, rls: rls.rows }
})

console.log('--- RLS ---')
r.rls.forEach((x) => console.log(`${x.nspname}.${x.relname}: ${x.relrowsecurity ? 'ON' : 'OFF'}`))
console.log('--- policies public ---')
r.pub.forEach((p) =>
  console.log(`${p.tablename} | ${p.policyname} | ${p.cmd}\n  qual: ${p.qual}\n  check: ${p.with_check}`)
)
console.log('--- policies storage.objects ---')
r.sto.forEach((p) =>
  console.log(`${p.policyname} | ${p.cmd}\n  qual: ${p.qual}\n  check: ${p.with_check}`)
)
