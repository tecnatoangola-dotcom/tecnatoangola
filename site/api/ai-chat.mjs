// Função da Vercel: proxy do chat "Tecnocrata" para a NVIDIA.
// - Esconde a chave NVIDIA (Environment Variables da Vercel).
// - Regista a conversa em ai_conversas / ai_mensagens (relatórios do admin).
// - Streaming SSE para o browser.

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'

// Streaming de IA pode demorar — aumenta o tempo limite da função.
export const maxDuration = 60

// Limite de espera pela NVIDIA (a função na Vercel corta aos 60s;
// se a NVIDIA não responder a tempo, respondemos com fallback em vez de 504).
const NVIDIA_TIMEOUT_MS = 22000

function fetchComTimeout(url, options = {}, ms) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer))
}

const MENSAGEM_FALLBACK = 'De momento o Tecnocrata está com dificuldade a responder. Podes explorar o site ou falar com a equipa. [LINK:/candidatura|Formulário de candidatura] [LINK:https://wa.me/244935073125|Falar por WhatsApp]'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' })

  if (!NVIDIA_API_KEY) {
    console.error('[ai-chat] NVIDIA_API_KEY não configurada nas Environment Variables da Vercel')
    return res.status(500).json({ error: 'Serviço de IA não configurado.' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  } catch {
    return res.status(400).json({ error: 'JSON inválido.' })
  }

  const { message, history, systemPrompt, temperature, maxTokens, stream, sessaoId, visitanteId, pagina } = body
  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória.' })
  }

  const meta = { sessaoId, visitanteId, pagina, userAgent: req.headers['user-agent'], modelo: NVIDIA_MODEL }
  // Regista sem bloquear a resposta (com timeout próprio).
  registar(meta, 'user', message).catch(() => {})

  const mensagens = [{ role: 'system', content: systemPrompt || 'És o assistente do TECNATO.' }]
  if (Array.isArray(history)) {
    for (const item of history.slice(-20)) {
      if (!item) continue
      const role = item.role === 'assistant' ? 'assistant' : 'user'
      const content = typeof item.content === 'string' ? item.content.trim() : ''
      if (content) mensagens.push({ role, content })
    }
  }
  mensagens.push({ role: 'user', content: message })

  try {
    const resposta = await fetchComTimeout('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: mensagens,
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.7,
        ...(stream ? { stream: true } : {}),
      }),
    }, NVIDIA_TIMEOUT_MS)

    if (!resposta.ok) {
      const txt = await resposta.text().catch(() => '')
      console.error('[ai-chat] NVIDIA', resposta.status, txt.slice(0, 300))
      registar(meta, 'erro', `NVIDIA ${resposta.status}`).catch(() => {})
      return res.status(200).json({ content: MENSAGEM_FALLBACK })
    }

    if (stream && resposta.body) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      const reader = resposta.body.getReader()
      const decoder = new TextDecoder()
      let bruto = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const pedaco = decoder.decode(value, { stream: true })
        bruto += pedaco
        res.write(pedaco)
      }
      res.end()
      const texto = textoDeSSE(bruto)
      if (texto.trim()) registar(meta, 'assistant', texto).catch(() => {})
      return
    }

    const data = await resposta.json()
    const content = data.choices?.[0]?.message?.content || ''
    if (content.trim()) {
      registar(meta, 'assistant', content).catch(() => {})
      return res.status(200).json({ content })
    }
    return res.status(200).json({ content: MENSAGEM_FALLBACK })
  } catch (e) {
    console.error('[ai-chat] erro:', e?.message)
    registar(meta, 'erro', String(e?.message || 'erro').slice(0, 400)).catch(() => {})
    // Se o streaming já começou, as headers foram enviadas — só fecha.
    if (res.headersSent) return res.end()
    return res.status(200).json({ content: MENSAGEM_FALLBACK })
  }
}

// ── Registo de conversas (mesma BD do admin: ai_conversas / ai_mensagens) ──
// Nunca pode bloquear a resposta: timeout curto em cada pedido.
async function registar({ sessaoId, visitanteId, pagina, userAgent, modelo }, papel, conteudo) {
  if (!SUPABASE_URL || !SERVICE_KEY) return
  try {
    if (!sessaoId || typeof sessaoId !== 'string' || sessaoId.length > 80) return
    const texto = String(conteudo || '').slice(0, 8000)
    if (!texto.trim()) return

    const headers = {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }

    const upsert = await fetchComTimeout(
      `${SUPABASE_URL}/rest/v1/ai_conversas?on_conflict=sessao_id&columns=sessao_id`,
      {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify({
          sessao_id: sessaoId,
          visitante_id: visitanteId ? String(visitanteId).slice(0, 80) : null,
          pagina: pagina ? String(pagina).slice(0, 200) : null,
          user_agent: userAgent ? String(userAgent).slice(0, 300) : null,
          estado: 'ativa',
          actualizado_em: new Date().toISOString(),
        }),
      },
      5000,
    )
    if (!upsert.ok) throw new Error(`upsert ${upsert.status}`)
    const [conversa] = await upsert.json()
    const conversaId = conversa?.id
    if (!conversaId) return

    const ins = await fetchComTimeout(`${SUPABASE_URL}/rest/v1/ai_mensagens`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify([{ conversa_id: conversaId, papel, conteudo: texto, modelo: modelo || null }]),
    }, 5000)
    if (!ins.ok) throw new Error(`insert ${ins.status}`)

    const contagem = await fetchComTimeout(
      `${SUPABASE_URL}/rest/v1/ai_mensagens?select=id&conversa_id=eq.${conversaId}`,
      { headers: { ...headers, Prefer: 'count=exact', Range: '0-0' } },
      5000,
    )
    const total = Number(String(contagem.headers.get('content-range') || '').split('/')[1]) || 0
    if (total > 0) {
      await fetchComTimeout(`${SUPABASE_URL}/rest/v1/ai_conversas?id=eq.${conversaId}`, {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify({ total_mensagens: total, actualizado_em: new Date().toISOString() }),
      }, 5000)
    }
  } catch (e) {
    console.warn('[ai-log] falha ao registar:', e?.message)
  }
}

function textoDeSSE(buffer) {
  let texto = ''
  for (const linha of String(buffer).split('\n')) {
    const t = linha.trim()
    if (!t.startsWith('data:')) continue
    const payload = t.slice(5).trim()
    if (!payload || payload === '[DONE]') continue
    try {
      const json = JSON.parse(payload)
      texto += json.choices?.[0]?.delta?.content || ''
    } catch {}
  }
  return texto
}
