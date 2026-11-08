import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync('E:/Tecnato/repo/admin/.env', 'utf8')
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1].trim().replace(/^['"]|['"]$/g, '')
const url = get('SUPABASE_URL')
const key = get('SUPABASE_SERVICE_KEY')
const sb = createClient(url, key)

async function main() {
  const { data: convs } = await sb.from('ai_conversas').select('id, sessao_id, total_mensagens, criado_em').order('criado_em', { ascending: false })
  console.log('Conversas:')
  for (const c of convs || []) console.log(' -', c.id, c.sessao_id, 'msgs=' + c.total_mensagens, c.criado_em)
  
  const { data: msgs } = await sb.from('ai_mensagens').select('id, conversa_id, papel, criado_em').order('criado_em', { ascending: false }).limit(20)
  console.log('Mensagens recentes:')
  for (const m of msgs || []) console.log(' -', m.id, m.conversa_id, m.papel, m.criado_em)
}

main()