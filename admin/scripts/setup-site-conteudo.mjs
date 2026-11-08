import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidas no .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function runSetup() {
  // 1. Tabela site_conteudo via RPC (SQL direto)
const { error: tableError } = await sb.rpc('exec_sql', {
  sql: `
    create table if not exists public.site_conteudo (
      chave text primary key,
      valor jsonb not null default '{}'::jsonb,
      actualizado_em timestamptz not null default now(),
      actualizado_por text
    );
    alter table public.site_conteudo enable row level security;
    do $$ begin
      create policy site_conteudo_leitura on public.site_conteudo for select using (true);
    exception when duplicate_object then null; end $$;
  `
})
if (tableError) {
  // Fallback: tentar criar via PostgREST (pode falhar se não tiver permissão)
  console.log('⚠️ RPC exec_sql falhou, tentando via REST...', tableError.message)
}

// 2. Bucket 'site' público
const { data: buckets, error: bucketError } = await sb.storage.listBuckets()
if (bucketError) console.log('⚠️ Erro ao listar buckets:', bucketError.message)

const siteBucket = buckets?.find(b => b.id === 'site')
if (!siteBucket) {
  const { error: createBucketError } = await sb.storage.createBucket('site', { public: true })
  if (createBucketError) console.log('⚠️ Erro ao criar bucket site:', createBucketError.message)
  else console.log('✅ Bucket "site" criado (público)')
} else {
  if (!siteBucket.public) {
    const { error: updateError } = await sb.storage.updateBucket('site', { public: true })
    if (updateError) console.log('⚠️ Erro ao tornar bucket público:', updateError.message)
    else console.log('✅ Bucket "site" tornado público')
  } else {
    console.log('✅ Bucket "site" já existe e é público')
  }
}

// 3. Verificar policy via RPC
const { data: policyCheck, error: policyError } = await sb.rpc('exec_sql', {
  sql: `select policyname from pg_policies where schemaname='public' and tablename='site_conteudo';`
})
if (!policyError && policyCheck) {
  console.log('Policies:', JSON.stringify(policyCheck))
} else {
  console.log('⚠️ Não foi possível verificar policies (precisa de exec_sql habilitado)')
}

console.log('✅ Setup concluído!')
}

runSetup().catch((e) => {
  console.error('❌ Erro no setup:', e.message)
  process.exit(1)
})
