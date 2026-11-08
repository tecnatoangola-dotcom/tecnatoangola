// Verifica colunas de ai_mensagens e desbloqueia conversas 'pendente' após falha de parse.
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

try {
  await client.connect()
  const cols = await client.query("select column_name from information_schema.columns where table_name='ai_mensagens' order by ordinal_position")
  console.log('COLUNAS ai_mensagens:', cols.rows.map((r) => r.column_name).join(', '))
  const r = await client.query("update ai_conversas set analisado_em=null where classificacao='pendente' and analisado_em is not null returning sessao_id")
  console.log('DESBLOQUEADAS:', r.rowCount, r.rows.map((x) => x.sessao_id).join(','))
} catch (e) {
  console.error('ERRO:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
