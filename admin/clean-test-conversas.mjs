import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync('E:/Tecnato/repo/admin/.env', 'utf8')
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1].trim().replace(/^['"]|['"]$/g, '')
const url = get('SUPABASE_URL')
const key = get('SUPABASE_SERVICE_KEY')
const sb = createClient(url, key)

async function main() {
  // IDs das conversas de teste
  const ids = [
    '984da3fe-53b7-47da-97f1-5a357392ac5c',
    '98e4f5b9-9a49-4588-b95c-4115978d7f09',
    'f196d252-4584-42ca-b8ef-4cf02cd76e38',
  ]

  // 1) Apagar mensagens
  const { error: errMsgs } = await sb.from('ai_mensagens').delete().in('conversa_id', ids)
  if (errMsgs) throw errMsgs
  console.log('Mensagens de teste apagadas.')

  // 2) Apagar conversas
  const { error: errConvs } = await sb.from('ai_conversas').delete().in('id', ids)
  if (errConvs) throw errConvs
  console.log('Conversas de teste apagadas.')

  // 3) Verificar
  const { data: convs } = await sb.from('ai_conversas').select('id, sessao_id, total_mensagens').order('criado_em', { ascending: false })
  console.log('Conversas restantes:', convs?.length || 0)
  for (const c of convs || []) console.log(' -', c.id, c.sessao_id, 'msgs=' + c.total_mensagens)
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1) })