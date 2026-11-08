// Consulta rápida das tabelas ai_* (teste de registo de conversas).
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
  const conv = await client.query('select id, sessao_id, visitante_id, pagina, estado, total_mensagens, classificacao, flag_seguranca, criado_em from ai_conversas order by criado_em desc limit 10')
  console.log('CONVERSAS:', conv.rowCount)
  for (const c of conv.rows) console.log(' ', JSON.stringify(c))
  const msgs = await client.query(`select m.papel, left(m.conteudo, 60) as conteudo, m.modelo, m.criado_em from ai_mensagens m order by m.criado_em desc limit 10`)
  console.log('MENSAGENS (últimas 10):', msgs.rowCount)
  for (const m of msgs.rows) console.log(' ', m.papel, '| modelo:', m.modelo || '(sem)', '|', m.conteudo)
} catch (e) {
  console.error('ERRO:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
