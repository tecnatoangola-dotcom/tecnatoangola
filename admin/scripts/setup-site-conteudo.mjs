import { withDb } from './db.mjs'

const r = await withDb(async (db) => {
  await db.query(`
    create table if not exists public.site_conteudo (
      chave text primary key,
      valor jsonb not null default '{}'::jsonb,
      actualizado_em timestamptz not null default now(),
      actualizado_por text
    )
  `)
  await db.query(`alter table public.site_conteudo enable row level security`)
  await db.query(`
    do $$ begin
      create policy site_conteudo_leitura on public.site_conteudo for select using (true);
    exception when duplicate_object then null; end $$
  `)
  // Bucket público para ficheiros do site (imagens do CMS)
  await db.query(`
    insert into storage.buckets (id, name, public)
    values ('site', 'site', true)
    on conflict (id) do update set public = true
  `)
  const table = await db.query(`
    select relrowsecurity from pg_class where relname='site_conteudo' and relnamespace='public'::regnamespace
  `)
  const policies = await db.query(`
    select policyname from pg_policies where schemaname='public' and tablename='site_conteudo'
  `)
  const buckets = await db.query(`select id, public from storage.buckets where id='site'`)
  return { rls: table.rows, policies: policies.rows, buckets: buckets.rows }
})

console.log('RLS:', JSON.stringify(r.rls))
console.log('Policies:', JSON.stringify(r.policies))
console.log('Bucket site:', JSON.stringify(r.buckets))
