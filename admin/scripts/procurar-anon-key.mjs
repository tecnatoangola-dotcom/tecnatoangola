import { withDb } from './db.mjs'

const r = await withDb(async (db) => {
  const jwt = await db.query(
    `select current_setting('app.settings.jwt_secret', true) as segredo`,
  )
  const vault = await db.query(`select name from vault.secrets order by name`)
  const priv = await db.query(
    `select has_table_privilege('anon','public.site_conteudo','select') as anon_select,
            has_table_privilege('anon','public.candidaturas','select') as cand_select,
            current_setting('app.settings.jwt_issuer', true) as issuer`,
  )
  return { jwt: jwt.rows, vault: vault.rows, priv: priv.rows }
})

const segredo = r.jwt[0]?.segredo || ''
console.log('JWT secret encontrado:', Boolean(segredo), '| tamanho:', String(segredo).length)
console.log('issuer:', r.priv[0]?.issuer)
console.log('privilegios anon:', JSON.stringify(r.priv[0]))
console.log('vault:', JSON.stringify(r.vault))
if (segredo) console.log('JWT_SECRET=' + segredo)
