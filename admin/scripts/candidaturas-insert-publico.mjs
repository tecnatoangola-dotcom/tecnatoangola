// Garante que qualquer pessoa (anon) pode SUBMETER candidaturas pela página pública.
// Só cria a política INSERT (leitura/alteração continuam protegidas por RLS).
import 'dotenv/config'
import { withDb } from './db.mjs'

await withDb(async (client) => {
  // alterações de schema via ligação directa precisam de avisar o PostgREST
  await client.query(`NOTIFY pgrst, 'reload schema'`)
  console.log('schema cache do PostgREST recarregado')
  const { rows: info } = await client.query(
    `select c.relrowsecurity as rls
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
      where c.relname = 'candidaturas' and c.relkind = 'r'`,
  )
  console.log('RLS activa:', info[0]?.rls)

  const { rows: politicas } = await client.query(
    `select polname, polcmd from pg_policy where polrelid = 'public.candidaturas'::regclass`,
  )
  console.log('políticas existentes:', politicas.map((p) => `${p.polname}(${p.polcmd})`).join(', ') || '(nenhuma)')

  const jaExiste = politicas.some((p) => p.polname === 'candidaturas_insert_publico')
  if (jaExiste) {
    console.log('política já existe — nada a fazer ✓')
    return
  }

  await client.query(
    `create policy "candidaturas_insert_publico"
       on public.candidaturas for insert
       to anon
       with check (true)`,
  )
  console.log('política "candidaturas_insert_publico" criada ✓')
})
