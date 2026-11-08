// Netlify Function (v2): proxy do chat "Tecnocrata" para a NVIDIA.
// - Esconde a chave NVIDIA no servidor (Netlify Environment Variables).
// - Regista a conversa em ai_conversas / ai_mensagens para os relatórios do admin.
// - Mesmo formato SSE do servidor admin (dev).

export const config = { path: '/api/ai-chat' }

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 })
  if (req.method !== 'POST') return erro(405, 'Método não permitido.')

  if (!NVIDIA_API_KEY) {
    console.error('[ai-chat] NVIDIA_API_KEY não configurada nas Environment Variables do Netlify')
    return erro(500, 'Serviço de IA não configurado.')
  }

  let body
  try {
    body = await req.json()
  } catch {
    return erro(400, 'JSON inválido.')
  }

  const { message, history, systemPrompt, temperature, maxTokens, stream, sessaoId, visitanteId, pagina } = body || {}
  if (!message) {
    return erro(400, 'Mensagem é obrigatória.')
  }

  const meta = { sessaoId, visitanteId, pagina, userAgent: req.headers.get('user-agent'), modelo: NVIDIA_MODEL }
  await registar(meta, 'user', message)

  // Histórico (multi-turno) + system prompt
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
    const resposta = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: mensagens,
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.7,
        ...(stream ? { stream: true } : {}),
      }),
    })

    if (!resposta.ok) {
      const txt = await resposta.text().catch(() => '')
      console.error('[ai-chat] NVIDIA', resposta.status, txt.slice(0, 300))
      await registar(meta, 'erro', `NVIDIA ${resposta.status}`)
      return erro(400, 'Não foi possível obter resposta do modelo.')
    }

    // ── Streaming (SSE) — encaminha os tokens e regista a resposta no fim ──
    if (stream && resposta.body) {
      const reader = resposta.body.getReader()
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      let bruto = ''
      let registado = false

      // Regista a resposta completa (usa o texto acumulado até aqui)
      const concluir = async () => {
        if (registado) return
        registado = true
        const texto = textoDeSSE(bruto)
        if (texto.trim()) await registar(meta, 'assistant', texto)
      }

      const flujo = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read()
          if (done) {
            await concluir()
            controller.close()
            return
          }
          const pedaco = decoder.decode(value, { stream: true })
          bruto += pedaco
          controller.enqueue(encoder.encode(pedaco))
        },
        async cancel() {
          // Cliente desligou: tenta consumir o resto do fluxo para registar
          // a resposta completa na BD (mesmo sem entregar ao cliente).
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              bruto += decoder.decode(value, { stream: true })
            }
          } catch {}
          await concluir()
          try {
            reader.cancel()
          } catch {}
        },
      })

      return new Response(flujo, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Fallback sem streaming (JSON)
    const data = await resposta.json()
    const content = data.choices?.[0]?.message?.content || ''
    if (content.trim()) await registar(meta, 'assistant', content)
    return json({ content })
  } catch (e) {
    console.error('[ai-chat] erro:', e?.message)
    await registar(meta, 'erro', String(e?.message || 'erro').slice(0, 400))
    return erro(500, 'Erro de conexão.')
  }
}

// ── Registo de conversas (mesma BD do admin: ai_conversas / ai_mensagens) ──
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

    // 1) Conversa (upsert por sessão única)
    const upsert = await fetch(
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
    )
    if (!upsert.ok) throw new Error(`upsert ${upsert.status}`)
    const [conversa] = await upsert.json()
    const conversaId = conversa?.id
    if (!conversaId) return

    // 2) Mensagem
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/ai_mensagens`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify([{ conversa_id: conversaId, papel, conteudo: texto, modelo: modelo || null }]),
    })
    if (!ins.ok) throw new Error(`insert ${ins.status}`)

    // 3) Total de mensagens (contador aproximado por query)
    const contagem = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_mensagens?select=id&conversa_id=eq.${conversaId}`,
      { headers: { ...headers, Prefer: 'count=exact', Range: '0-0' } },
    )
    const total = Number(String(contagem.headers.get('content-range') || '').split('/')[1]) || 0
    if (total > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/ai_conversas?id=eq.${conversaId}`, {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify({ total_mensagens: total, actualizado_em: new Date().toISOString() }),
      })
    }
  } catch (e) {
    // Nunca derruba o chat por falha de registo
    console.warn('[ai-log] falha ao registar:', e?.message)
  }
}

// Extrai o texto final (deltas) de um buffer SSE da NVIDIA
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

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function erro(status, mensagem) {
  return json({ error: mensagem }, status)
}