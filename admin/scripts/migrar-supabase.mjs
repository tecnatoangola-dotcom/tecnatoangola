// Migração completa OLD → NEW Supabase. Escreve APENAS no projecto NOVO.
//  - tabelas public.* (DDL gerado de information_schema + pg_catalog)
//  - dados (INSERT parametrizado, em ordem às FKs)
//  - políticas RLS, indexes únicos, FKs, sequências, grants
//  - buckets + políticas de storage via SQL
//  - utilizadores de auth (hashes preservados) + identities
import 'dotenv/config'
import pg from 'pg'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const NOVO = {
  host: process.env.NOVO_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: Number(process.env.NOVO_DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER || 'postgres.ohcagdukycwuetaqwynd',
  password: limpar(process.env.NOVO_DB_PASSWORD),
  ssl: { rejectUnauthorized: false },
}

const nomeNovo = process.env.NOVO_DB_USER?.split('.')[1]
if (!nomeNovo) { console.log('NOVO_DB_USER invalido'); process.exit(1) }

const antigo = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 6543),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})
await antigo.connect()
const novo = new pg.Client(NOVO)
await novo.connect()

// tipos enum usados nas tabelas public
const enums = await antigo.query(`
  select distinct t.typname, string_agg(e.enumlabel, '§' order by e.enumsortorder) as etiquetas
    from pg_type t
    join pg_enum e on e.enumtypid = t.oid
   where t.typname in (
     select distinct udt_name from information_schema.columns
     where table_schema='public' and data_type='USER-DEFINED'
   )
   group by typname
`)
for (const e of enums.rows) {
  const labels = e.etiquetas.split('§').map((l) => `'${l.replace(/'/g, "''")}'`).join(', ')
  await novo.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='${e.typname}' AND typnamespace = 'public'::regnamespace) THEN CREATE TYPE public."${e.typname}" AS ENUM (${labels}); END IF; END $$;`)
  console.log('enum criado:', e.typname)
}

// tabelas
const tabelas = (await antigo.query(`
  select c.relname as tabela from pg_class c
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' order by c.relname
`)).rows.map((r) => r.tabela)

for (const tabela of tabelas) {
  const cols = (await antigo.query(`
    select column_name, data_type, udt_name, character_maximum_length, numeric_precision,
           numeric_scale, is_nullable, column_default, is_generated, generation_expression
      from information_schema.columns
     where table_schema='public' and table_name=$1 order by ordinal_position
  `, [tabela])).rows

  const defs = cols.map((c) => {
    let tipo = c.data_type === 'USER-DEFINED' ? `public."${c.udt_name}"` : c.data_type
    if (['character varying', 'varchar', 'char', 'character'].includes(c.data_type) && c.character_maximum_length) tipo = `varchar(${c.character_maximum_length})`
    if (['numeric', 'decimal'].includes(c.data_type) && c.numeric_precision) tipo = `numeric(${c.numeric_precision},${c.numeric_scale ?? 0})`
    if (['timestamp with time zone', 'timestamp without time zone'].includes(c.data_type)) tipo = c.data_type
    if (c.data_type === 'ARRAY') { tipo = c.udt_name.replace(/^_/, '') + '[]' }
    if (c.is_generated === 'ALWAYS') return `"${c.column_name}" ${tipo} GENERATED ALWAYS AS (${c.generation_expression}) STORED`
    return `"${c.column_name}" ${tipo}${c.column_default ? ` DEFAULT ${c.column_default}` : ''}${c.is_nullable === 'NO' ? ' NOT NULL' : ''}`
  })

  // PK
  const pk = (await antigo.query(`
    select string_agg(a.attname, ',' order by x.ord) as colunas
      from (select conkey, generate_series(1, array_length(conkey,1)) as ord from pg_constraint
             where conrelid = $1::regclass and contype='p') x
      join pg_attribute a on a.attrelid = $1::regclass and a.attnum = any(x.conkey)
     group by x.conkey limit 1
  `, [`public.${tabela}`])).rows[0]

  let ddl = `CREATE TABLE IF NOT EXISTS public."${tabela}" (\n  ` + defs.join(',\n  ')
  if (pk?.colunas) ddl += `,\n  PRIMARY KEY (${pk.colunas.split(',').map((c) => `"${c}"`).join(',')})`
  ddl += `\n)`
  await novo.query(ddl)
  console.log('tabela criada no novo:', tabela)
}

// indexes únicos (não PK)
const idx2 = (await antigo.query(`
  select schemaname, tablename, indexname, indexdef from pg_indexes
  where schemaname='public' and indexname not like '%_pkey'
`)).rows
for (const i of idx2) {
  const temUnico = /CREATE UNIQUE/.test(i.indexdef)
  if (!temUnico) continue
  const ddlIndex = i.indexdef.replace('CREATE UNIQUE INDEX', 'CREATE UNIQUE INDEX IF NOT EXISTS')
  await novo.query(ddlIndex)
  console.log('index único criado:', i.indexname)
}

// FKs (recriadas a partir das definições reais)
const fks = (await antigo.query(`
  select conname::text, conrelid::regclass::text as tabela, pg_get_constraintdef(oid) as def
    from pg_constraint
   where connamespace='public'::regnamespace and contype='f'
`)).rows
for (const f of fks) {
  try {
    await novo.query(`ALTER TABLE ${f.tabela} ADD CONSTRAINT "${f.conname}" ${f.def.replace(/^FOREIGN KEY /, 'FOREIGN KEY ')}`)
    console.log('FK criada:', f.tabela, '→', f.def.slice(0, 60))
  } catch (e) {
    console.log(`FK ${f.conname}: ${e.message.slice(0, 90)}`)
  }
}

// auth users (senhas preservadas) + identities — colunas dinâmicas nas duas versões
const colsNovo = (await novo.query(`
  select column_name from information_schema.columns
  where table_schema='auth' and table_name='users'
`)).rows.map((r) => r.column_name)
const colsVelho = (await antigo.query(`
  select column_name, data_type from information_schema.columns
  where table_schema='auth' and table_name='users'
`)).rows
const geradasNovo = (await novo.query(`
  select column_name from information_schema.columns
  where table_schema='auth' and table_name='users' and is_generated='ALWAYS'
`)).rows.map((r) => r.column_name)
// só apagar as GERADAS (created_at/updated_at/aud/role são copiados — sem default no esquema novo)
const IGNORAR = new Set([...geradasNovo])
const comuns = colsVelho.filter(
  (c) => c.column_name === 'id' || (colsNovo.includes(c.column_name) && !IGNORAR.has(c.column_name))
)
const listaColunas = comuns.flatMap((c) => (colsNovo.includes(c.column_name) ? [c] : []))
const nomesAuth = listaColunas.map((c) => `"${c.column_name}"`).join(', ')
const placeholdersAuth = listaColunas.map((_, i) => `$${i + 1}`).join(',')
const users = (await antigo.query(
  `select ${nomesAuth} from auth.users order by created_at`
)).rows
for (const u of users) {
  const valores = listaColunas.map((c) => {
    let v = u[c.column_name]
    if (v instanceof Date || v === null || v === undefined) return v ?? null
    if (['timestamp with time zone', 'timestamp without time zone'].includes(c.data_type)) return new Date(v)
    if (c.data_type === 'jsonb' || c.data_type === 'json') return JSON.stringify(v ?? {})
    return v
  })
  await novo.query(
    `INSERT INTO auth.users (${nomesAuth}) VALUES (${placeholdersAuth})
     ON CONFLICT (id) DO NOTHING`,
    valores,
  )
}
console.log('auth.users copiados:', users.length)
const ids = (await antigo.query(`
  select provider, provider_id, user_id, identity_data from auth.identities
`)).rows
const colsIds = (await novo.query(`
  select column_name, is_generated from information_schema.columns
  where table_schema='auth' and table_name='identities'
`)).rows
const permitidas = colsIds
  .filter((c) => c.is_generated !== 'ALWAYS' && c.column_name !== 'id')
  .map((c) => c.column_name)
const nomesIds = permitidas.map((c) => `"${c}"`).join(', ')
const placeholdersIds = permitidas.map((_, x) => `$${x + 1}`).join(',')
for (const i of ids) {
  const valores = permitidas.map((campo) => {
    if (['last_sign_in_at', 'created_at', 'updated_at'].includes(campo)) return new Date()
    if (campo === 'identity_data') return JSON.stringify(i.identity_data || {})
    if (campo === 'email') return i.identity_data?.email ?? null
    if (campo === 'provider') return i.provider ?? 'email'
    return i[campo] ?? null
  })
  await novo.query(
    `INSERT INTO auth.identities (${nomesIds}) VALUES (${placeholdersIds})
     ON CONFLICT DO NOTHING`,
    valores,
  )
}
console.log('auth.identities copiadas:', ids.length)

// dados (tabela limpa no destino antes — a migração é determinística e idempotente)
for (const tabela of tabelas) {
  await novo.query(`DELETE FROM public."${tabela}"`)
  const cols = (await antigo.query(`
    select column_name, data_type from information_schema.columns
    where table_schema='public' and table_name=$1 order by ordinal_position
  `, [tabela])).rows
  const nomes = cols.map((c) => `"${c.column_name}"`).join(', ')
  const { rows } = await antigo.query(`select ${nomes} from public."${tabela}"`)
  if (!rows.length) { console.log('sem dados a copiar:', tabela); continue }
  let juntos = 0
  for (const linha of rows) {
    const valores = cols.map((c, i) => {
      const v = linha[c.column_name]
      if (v === null) return null
      if (['DATE','TIMESTAMP','TIMESTAMPTZ','TIMESTAMP WITH TIME ZONE','timestamp with time zone'].includes(c.data_type.toUpperCase())) return new Date(v)
      return v
    })
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(',')
    await novo.query(`INSERT INTO public."${tabela}" (${nomes}) VALUES (${placeholders})`, valores)
    juntos++
  }
  console.log(`dados copiados → ${tabela}: ${juntos} linhas`)
}


// sequências (max id)
const seqs = (await antigo.query(`
  select sequencename from pg_sequences where schemaname='public'
`)).rows
for (const s of seqs) {
  const tabelaAlvo = s.sequencename.replace(/_(id|seq)$/, '')
  const maximo = await antigo.query(`select coalesce(max(id), 0)::bigint as m from public."${s.sequencename.replace(/_(id|seq)$/, '')}"`).catch(() => null)
  if (maximo?.rows?.[0]) {
    await novo.query(`select setval('public.${s.sequencename}', ${maximo.rows[0].m})`)
    console.log(`sequência ${s.sequencename} apontada para ${maximo.rows[0].m}`)
  }
}

// RLS + politicas
const rls = (await antigo.query(`
  select c.relname as tabela, c.relrowsecurity as ativa
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
   where n.nspname='public' and c.relkind='r'
`)).rows
for (const r of rls) {
  if (r.ativa) await novo.query(`ALTER TABLE public."${r.tabela}" ENABLE ROW LEVEL SECURITY`)
}
const politicas = (await antigo.query(`
  select tablename, policyname, cmd, roles, qual, with_check
    from pg_policies where schemaname='public'
`)).rows
for (const p of politicas) {
  const lista = String(p.roles || '{anon}').replace(/^\{|\}$/g, '')
  const role = lista.split(',').filter(Boolean).map((x) => `"${x}"`).join(',') || 'PUBLIC'
  await novo.query(`DROP POLICY IF EXISTS "${p.policyname}" ON public."${p.tablename}"`)
  let sql = `CREATE POLICY "${p.policyname}" ON public."${p.tablename}" FOR ${p.cmd.toUpperCase()} TO ${role}`
  if (p.qual) sql += ` USING (${p.qual})`
  if (p.with_check) sql += ` WITH CHECK (${p.with_check})`
  await novo.query(sql)
  console.log('política criada:', p.tablename + '.' + p.policyname)
}

// grants
const grants = (await antigo.query(`
  select grantee, string_agg(DISTINCT privilege_type, ',') as tipos
    from information_schema.role_table_grants
   where table_schema='public' and grantee in ('anon','authenticated','service_role')
   group by grantee
`)).rows
for (const g of grants) {
  const todas = (await antigo.query(`
    select table_name, privilege_type from information_schema.role_table_grants
    where table_schema='public' and grantee=$1
  `, [g.grantee])).rows
  for (const element of todas) {
    await novo.query(`GRANT ${element.privilege_type} ON public."${element.table_name}" TO ${g.grantee}`)
  }
  console.log('grants aplicados para:', g.grantee)
}

// buckets + políticas de storage
const buckets = (await antigo.query(`select id, name, public, file_size_limit, allowed_mime_types from storage.buckets order by id`)).rows
for (const b of buckets) {
  await novo.query(
    `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
     VALUES ($1, $1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [b.id, b.public, b.file_size_limit, b.allowed_mime_types],
  )
  console.log('bucket criado/presente no novo:', b.id)
}
const politicasStorage = (await antigo.query(`
  select policyname, cmd, roles, qual, with_check
    from pg_policies
   where schemaname='storage' and tablename='objects'
   order by policyname
`)).rows
const existentesNoNovo = (await novo.query(`
  select policyname from pg_policies where schemaname='storage' and tablename='objects'
`)).rows.map((r) => r.policyname)
for (const p of politicasStorage) {
  if (existentesNoNovo.includes(p.policyname)) {
    console.log('política storage já existente:', p.policyname)
    continue
  }
  const lista = String(p.roles || '{anon}').replace(/^\{|\}$/g, '')
  const role = lista.split(',').filter(Boolean).map((x) => `"${x}"`).join(',')
  let sql = `CREATE POLICY "${p.policyname}" ON storage.objects FOR ${p.cmd.toUpperCase()} TO ${role}`
  if (p.qual) sql += ` USING (${p.qual})`
  if (p.with_check) sql += ` WITH CHECK (${p.with_check})`
  await novo.query(sql).then(() => console.log('política storage criada:', p.policyname))
    .catch((e) => console.log(`(política storage ${p.policyname}: ${e.message.slice(0, 70)})`))
}


// verificação
console.log('\n=== VERIFICAÇÃO NO DESTINO ===')
for (const tabela of tabelas) {
  const q = await novo.query(`select count(*)::int as n from public."${tabela}"`)
  console.log(`  ${tabela}: ${q.rows[0].n} linhas`)
}

await antigo.end()
await novo.end()
console.log('migração concluída ✓')
