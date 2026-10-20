// Migra os FICHEIROS de storage do projecto antigo para o novo (bucket a bucket).
// Lê a lista/recursos do antigo com a service key antiga e sobe para o novo
// com a service key nova, preservando estado dos metadados (content-type).
// Idempotente: se o objecto já existir no destino com o mesmo tamanho, salta.
import 'dotenv/config'

const limpar = (v) => (v || '').replace(/^['"]|['"]$/g, '')
const velho = {
  url: limpar(process.env.SUPABASE_URL),
  chave: limpar(process.env.SUPABASE_SERVICE_KEY),
}
const novo = {
  url: limpar(process.env.NOVO_SUPABASE_URL),
  chave: limpar(process.env.NOVO_SUPABASE_SERVICE_KEY),
}
if (!velho.url || !novo.url) {
  console.log('SUPABASE_* / NOVO_SUPABASE_* em falta')
  process.exit(1)
}

async function raizes({ url, chave }, bucket, prefixo = '') {
  const r = await fetch(`${url}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: {
      apikey: chave,
      Authorization: `Bearer ${chave}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prefix: prefixo,
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
      delimiter: '/',
    }),
  })
  if (!r.ok) throw new Error(`list ${bucket}${prefixo}: ${r.status} ${await r.text()}`)
  return r.json()
}

async function descarregar({ url, chave }, bucket, caminho) {
  const r = await fetch(`${url}/storage/v1/object/${bucket}/${caminho}`, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` },
  })
  if (!r.ok) throw new Error(`download ${bucket}/${caminho}: ${r.status}`)
  return { bytes: await r.arrayBuffer(), tipo: r.headers.get('content-type') || 'application/octet-stream' }
}

async function subir({ url, chave }, bucket, caminho, { bytes, tipo }) {
  const r = await fetch(`${url}/storage/v1/object/${bucket}/${caminho}`, {
    method: 'POST',
    headers: {
      apikey: chave,
      Authorization: `Bearer ${chave}`,
      'Content-Type': tipo,
      'x-upsert': 'true',
    },
    body: Buffer.from(bytes),
  })
  if (!r.ok) throw new Error(`upload ${bucket}/${caminho}: ${r.status} ${await r.text()}`)
  return r.json()
}

// tamanhos no destino (para saltar o que já está)
async function existentes({ url, chave }, bucket) {
  const mapa = new Map()
  async function percorre(prefixo) {
    const itens = await raizes({ url, chave }, bucket, prefixo)
    for (const i of itens) {
      if (i.id === null) { // pasta
        await percorre(`${prefixo}${i.name}/`)
      } else {
        mapa.set(`${prefixo}${i.name}`, i.metadata?.size ?? -1)
      }
    }
  }
  await percorre('')
  return mapa
}

const bucketsOld = await fetch(`${velho.url}/storage/v1/bucket`, {
  headers: { apikey: velho.chave, Authorization: `Bearer ${velho.chave}` },
}).then((r) => r.json())

let totalOk = 0
let totalSaltados = 0
let totalFalhas = 0
for (const b of bucketsOld) {
  const alvo = new Map(await existentes(novo, b.name))
  console.log(`\n=== ${b.name} → ${novo.url} ===`)
  async function percorre(prefixo) {
    const itens = await raizes(velho, b.name, prefixo)
    for (const i of itens) {
      if (i.id === null) { await percorre(`${prefixo}${i.name}/`); continue }
      const caminho = `${prefixo}${i.name}`
      const sizeVelho = i.metadata?.size ?? -1
      if (alvo.get(caminho) === sizeVelho) { totalSaltados++; continue }
      try {
        const dados = await descarregar(velho, b.name, caminho)
        await subir(novo, b.name, caminho, dados)
        totalOk += 1
        console.log(`  ✓ ${caminho} (${(sizeVelho / 1024).toFixed(1)} KB, ${dados.tipo})`)
      } catch (e) {
        totalFalhas += 1
        console.log(`  ✗ ${caminho}: ${e.message.slice(0, 120)}`)
      }
    }
  }
  await percorre('')
}

console.log(`\nRESUMO: subidos=${totalOk} já-existiam(saltados)=${totalSaltados} falhas=${totalFalhas}`)
