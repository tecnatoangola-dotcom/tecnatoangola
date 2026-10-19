// Recarrega a cache de schema do PostgREST do Supabase.
// O NOTIFY tem de partir de uma ligação com sessão (session pooler :5432 ou
// ligação directa) — na porta 6543 (transaction pooler) é descartado.
import 'dotenv/config'
import pg from 'pg'

const base = {
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
}

const tentativas = [
  { ...base, host: process.env.DB_HOST, port: 5432 }, // session pooler
  { ...base, host: process.env.DB_HOST.replace(/pooler\./, ''), port: 5432 },
  { ...base, host: `db.${process.env.DB_USER.split('.')[1]}.supabase.co`, port: 5432 }, // ligação directa
]

for (const cfg of tentativas) {
  const c = new pg.Client(cfg)
  try {
    await c.connect()
    await c.query(`NOTIFY pgrst, 'reload schema'`)
    console.log(
      `NOTIFY pgrst enviado via ${cfg.host}:${cfg.port} ✓`,
    )
    await c.end()
    process.exit(0)
  } catch (e) {
    console.log(`falhou ${cfg.host}:${cfg.port} → ${e.message.split('\n')[0]}`)
    try { await c.end() } catch { /* sem ligação */ }
  }
}
process.exitCode = 1
console.log('nenhuma ligação com sessão disponível')
