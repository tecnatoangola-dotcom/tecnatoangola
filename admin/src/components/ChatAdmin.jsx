import { useEffect, useRef, useState } from 'react'
import { Bot, Send, XCircle } from 'lucide-react'
import { api } from '../api.js'
import Markdown from './Markdown.jsx'

const INPUT = 'w-full border border-line bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none'

// Chat admin flutuante — presente em TODAS as páginas do admin (via Layout).
// Recebe e consulta relatórios das conversas do Tecnocrata, lê o conteúdo do
// site configurado no editor e responde sobre a operação.
export default function ChatAdmin() {
  const [aberto, setAberto] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Olá! Sou o assistente de relatórios do TECNATO. Pergunta-me sobre as conversas do Tecnocrata (satisfação, reclamações, falhas, segurança) ou sobre o que está configurado no site.' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, aberto])

  async function enviar() {
    const texto = input.trim()
    if (!texto || busy) return
    setMsgs((prev) => [...prev, { role: 'user', content: texto }])
    setInput('')
    setBusy(true)
    try {
      const historico = msgs
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))
      const data = await api('/ai-relatorios/chat', {
        method: 'POST',
        body: JSON.stringify({ message: texto, history: historico }),
      })
      setMsgs((prev) => [...prev, { role: 'assistant', content: data.content || 'Sem resposta.' }])
    } catch (err) {
      setMsgs((prev) => [...prev, { role: 'assistant', content: `Erro: ${err.message}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-2xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-paper"
        aria-label={aberto ? 'Fechar assistente de relatórios' : 'Abrir assistente de relatórios'}
        aria-expanded={aberto}
      >
        {aberto ? <XCircle size={22} strokeWidth={1.8} /> : <Bot size={22} strokeWidth={1.8} />}
        {!aberto && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand border-2 border-paper" aria-hidden="true" />
        )}
      </button>

      {aberto && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[460px] w-[calc(100%-3rem)] max-w-md flex-col rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={16} strokeWidth={1.8} />
              <div>
                <p className="text-sm font-semibold">Assistente de relatórios</p>
                <p className="text-[10px] text-white/60">Análise das conversas do Tecnocrata</p>
              </div>
            </div>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar" className="text-white/60 hover:text-white">
              <XCircle size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] whitespace-pre-wrap rounded-3xl bg-ink/10 px-4 py-2 text-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="text-sm leading-6 text-ink/85">
                  <Markdown texto={m.content} />
                </div>
              )
            ))}
            {busy && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
              placeholder="Pergunta sobre as conversas ou o site…"
              className={INPUT}
              disabled={busy}
              aria-label="Mensagem para o assistente de relatórios"
            />
            <button
              type="button"
              onClick={enviar}
              disabled={busy || !input.trim()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-white hover:bg-ink-soft disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
