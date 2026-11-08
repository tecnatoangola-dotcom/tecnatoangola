// Cria as tabelas do registo de conversas do Tecnocrata + relatórios.
// Uso: node scripts/setup-ai-relatorios.mjs
import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({
  host: process.env.NOVO_DB_HOST || process.env.DB_HOST,
  port: Number(process.env.NOVO_DB_PORT || process.env.DB_PORT || 6543),
  database: process.env.NOVO_DB_NAME || process.env.DB_NAME || 'postgres',
  user: process.env.NOVO_DB_USER || process.env.DB_USER,
  password: process.env.NOVO_DB_PASSWORD || process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
})

const SQL = `
-- Conversas do chat Tecnocrata (1 linha por sessão de chat)
create table if not exists ai_conversas (
  id uuid primary key default gen_random_uuid(),
  sessao_id text not null unique,
  visitante_id text,
  pagina text,
  user_agent text,
  estado text not null default 'ativa',           -- ativa | concluida | abandonada
  total_mensagens int not null default 0,
  classificacao text not null default 'pendente', -- pendente | sucesso | reclamacao | falha | pedido_nao_atendido
  flag_seguranca text not null default 'ok',      -- ok | suspeito | relevante
  temas text[] not null default '{}',
  resumo_ia text,
  analisado_em timestamptz,
  criado_em timestamptz not null default now(),
  actualizado_em timestamptz not null default now()
);

-- Mensagens dentro de cada conversa (histórico total)
create table if not exists ai_mensagens (
  id bigint generated always as identity primary key,
  conversa_id uuid not null references ai_conversas(id) on delete cascade,
  papel text not null,                            -- user | assistant | erro
  conteudo text not null,
  modelo text,                                    -- modelo AI usado (registo)
  criado_em timestamptz not null default now()
);

-- Relatórios gerados pela IA (guardados para consulta)
create table if not exists ai_relatorios (
  id bigint generated always as identity primary key,
  titulo text not null,
  conteudo text not null,
  metricas jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists idx_ai_mensagens_conversa on ai_mensagens(conversa_id);
create index if not exists idx_ai_mensagens_criado on ai_mensagens(criado_em);
create index if not exists idx_ai_conversas_criado on ai_conversas(criado_em);
create index if not exists idx_ai_conversas_classificacao on ai_conversas(classificacao);

-- Compatibilidade com tabelas criadas sem visitante_id
alter table ai_conversas add column if not exists visitante_id text;
-- Compatibilidade com tabelas criadas sem modelo (registo do modelo AI usado)
alter table ai_mensagens add column if not exists modelo text;

-- Leitura pública desligada: só o servidor admin (service key) acede.
alter table ai_conversas enable row level security;
alter table ai_mensagens enable row level security;
alter table ai_relatorios enable row level security;
`

try {
  await client.connect()
  await client.query(SQL)
  console.log('OK — tabelas ai_conversas / ai_mensagens / ai_relatorios criadas (ou já existiam).')
  const t = await client.query(`select table_name from information_schema.tables where table_schema='public' and table_name like 'ai_%' order by 1`)
  console.log('Tabelas ai_*:', t.rows.map((r) => r.table_name).join(', '))
} catch (e) {
  console.error('ERRO:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
