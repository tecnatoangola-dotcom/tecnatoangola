// Devolve o conteúdo público do site (textos, fotos e vídeo editados no CRM).
// Usa a service key apenas no servidor — o browser nunca vê a chave.
export const handler = async () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    return responde(500, { error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY em falta.' })
  }
  const r = await fetch(`${url}/rest/v1/site_conteudo?select=chave,valor`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  })
  const rows = await r.json()
  const conteudo = {}
  if (Array.isArray(rows)) for (const row of rows) conteudo[row.chave] = row.valor
  // Segurança: nunca expor chaves de API ao browser (a DB guarda apiKey do
  // AI Support, mas o chat usa NVIDIA_API_KEY via function). Remove em
  // profundidade qualquer campo com cara de segredo.
  sanitizar(conteudo)
  return responde(r.ok ? 200 : 500, { conteudo })
}

function sanitizar(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) sanitizar(item)
    return
  }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (/api[-_]?key|secret|password|token/i.test(k)) delete obj[k]
      else sanitizar(obj[k])
    }
  }
}

function responde(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
    body: JSON.stringify(body),
  }
}
