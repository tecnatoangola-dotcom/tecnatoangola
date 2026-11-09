// Devolve o conteúdo público do site (textos, fotos e vídeo editados no CRM).
// Função da Vercel — usa a service key apenas no servidor (o browser nunca a vê).
export default async function handler(_req, res) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    res.status(500).json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY em falta.' })
    return
  }
  try {
    const r = await fetch(`${url}/rest/v1/site_conteudo?select=chave,valor`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
    })
    const rows = await r.json()
    const conteudo = {}
    if (Array.isArray(rows)) for (const row of rows) conteudo[row.chave] = row.valor
    // Segurança: nunca expor chaves de API ao browser (igual à function Netlify).
    sanitizar(conteudo)
    res.status(r.ok ? 200 : 500).json({ conteudo })
  } catch (e) {
    res.status(500).json({ error: 'Falha ao carregar conteúdo: ' + e.message })
  }
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
