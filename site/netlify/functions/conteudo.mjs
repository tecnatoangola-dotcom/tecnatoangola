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
  return responde(r.ok ? 200 : 500, { conteudo })
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
