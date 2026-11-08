import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Bot,
  FileText,
  Filter,
  History,
  Inbox,
  MessageSquare,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react'
import { api } from '../api.js'
import Markdown from '../components/Markdown.jsx'

const LABEL = 'mb-1.5 block admin-label text-ink/50'
const INPUT = 'w-full border border-line bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none'

const CLASSIFICACOES = {
  pendente: { label: 'Pendente', cor: 'bg-ink/10 text-ink/70' },
  sucesso: { label: 'Sucesso', cor: 'bg-green-100 text-green-800' },
  reclamacao: { label: 'Reclamação', cor: 'bg-orange-100 text-orange-800' },
  falha: { label: 'Falha do chat', cor: 'bg-red-100 text-red-800' },
  pedido_nao_atendido: { label: 'Pedido não atendido', cor: 'bg-yellow-100 text-yellow-900' },
}

const SEGURANCA = {
  ok: { label: 'OK', cor: 'bg-green-100 text-green-800' },
  suspeito: { label: 'Suspeito', cor: 'bg-orange-100 text-orange-800' },
  relevante: { label: 'Relevante', cor: 'bg-red-100 text-red-800' },
}

function Badge({ info, children }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-[0.06em] uppercase ${info?.cor || 'bg-ink/10 text-ink/70'}`}>
      {children || info?.label}
    </span>
  )
}

// Modal base — fundo escuro + cartão central, fecha no ✕ e no Esc
function Modal({ aberto, onFechar, titulo, subtitulo, largura = 'max-w-3xl', children }) {
  useEffect(() => {
    if (!aberto) return
    const onKey = (e) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="absolute inset-0 bg-black/55" onClick={onFechar} aria-hidden="true" />
      <div className={`relative flex max-h-[88vh] w-full ${largura} flex-col rounded-2xl border border-line bg-white shadow-2xl animate-fade-in`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-semibold tracking-[-0.02em]">{titulo}</p>
            {subtitulo && <p className="mt-0.5 text-xs text-ink/50">{subtitulo}</p>}
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 hover:bg-paper hover:text-ink"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Modal de Histórico de conversas ──
// Lista completa com filtros → clique numa conversa para ver o chat inteiro.
function ModalHistorico({ aberto, onFechar, filtros, setFiltros }) {
  const [lista, setLista] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [aberta, setAberta] = useState(null) // { conversa, mensagens }
  const [carregandoConversa, setCarregandoConversa] = useState(false)

  const carregar = useCallback(() => {
    setCarregando(true)
    setErro('')
    const params = new URLSearchParams({
      classificacao: filtros.classificacao,
      seguranca: filtros.seguranca,
      dias: String(filtros.dias),
    })
    if (filtros.pagina) params.set('pagina', filtros.pagina)
    api(`/ai-relatorios?${params}`)
      .then((d) => setLista(d.conversas || []))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [filtros])

  useEffect(() => {
    if (aberto) carregar()
  }, [aberto, carregar])

  async function abrirConversa(id) {
    setCarregandoConversa(true)
    setErro('')
    try {
      const d = await api(`/ai-relatorios/conversa/${id}`)
      setAberta(d)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregandoConversa(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={aberta ? 'Conversa' : 'Histórico de conversas'}
      subtitulo={aberta ? `${aberta.conversa.pagina || '—'} · ${new Date(aberta.conversa.criado_em).toLocaleString('pt-PT')}` : `${lista.length} conversa(s) — clica para abrir`}
      largura="max-w-3xl"
    >
      {erro && <p className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {!aberta ? (
        <>
          {/* Filtros */}
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div className="min-w-40">
              <label className={LABEL} htmlFor="h-class">Classificação</label>
              <select
                id="h-class"
                value={filtros.classificacao}
                onChange={(e) => setFiltros((f) => ({ ...f, classificacao: e.target.value }))}
                className={INPUT}
              >
                <option value="todas">Todas</option>
                {Object.entries(CLASSIFICACOES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="min-w-36">
              <label className={LABEL} htmlFor="h-seg">Segurança</label>
              <select
                id="h-seg"
                value={filtros.seguranca}
                onChange={(e) => setFiltros((f) => ({ ...f, seguranca: e.target.value }))}
                className={INPUT}
              >
                <option value="todos">Todos</option>
                {Object.entries(SEGURANCA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="min-w-32">
              <label className={LABEL} htmlFor="h-dias">Período</label>
              <select
                id="h-dias"
                value={filtros.dias}
                onChange={(e) => setFiltros((f) => ({ ...f, dias: Number(e.target.value) }))}
                className={INPUT}
              >
                <option value={7}>7 dias</option>
                <option value={30}>30 dias</option>
                <option value={90}>90 dias</option>
                <option value={365}>1 ano</option>
              </select>
            </div>
            <div className="min-w-40">
              <label className={LABEL} htmlFor="h-pag">Página</label>
              <input
                id="h-pag"
                value={filtros.pagina}
                onChange={(e) => setFiltros((f) => ({ ...f, pagina: e.target.value }))}
                placeholder="/candidatura"
                className={INPUT}
              />
            </div>
          </div>

          {/* Lista */}
          <div className="divide-y divide-line border border-line">
            {carregando && <p className="px-4 py-6 text-center text-sm text-ink/45">A carregar…</p>}
            {!carregando && lista.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink/45">Nenhuma conversa com estes filtros.</p>
            )}
            {lista.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => abrirConversa(c.id)}
                className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left hover:bg-paper"
              >
                <span className="font-mono text-[10px] text-ink/40">{new Date(c.criado_em).toLocaleString('pt-PT')}</span>
                <span className="text-sm text-ink/70">{c.pagina || '—'}</span>
                <span className="text-xs text-ink/40">{c.total_mensagens} msg</span>
                <Badge info={CLASSIFICACOES[c.classificacao]} />
                {c.flag_seguranca !== 'ok' && (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle size={12} className="text-red-500" />
                    <Badge info={SEGURANCA[c.flag_seguranca]} />
                  </span>
                )}
                {Array.isArray(c.temas) && c.temas.length > 0 && (
                  <span className="w-full truncate text-[11px] text-ink/45">{c.temas.join(' · ')}</span>
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        /* ── Detalhe da conversa ── */
        <div>
          <button
            type="button"
            onClick={() => setAberta(null)}
            className="mb-4 inline-flex min-h-9 items-center gap-1.5 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            ← Voltar à lista
          </button>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge info={CLASSIFICACOES[aberta.conversa.classificacao]} />
            <Badge info={SEGURANCA[aberta.conversa.flag_seguranca]} />
            {Array.isArray(aberta.conversa.temas) && aberta.conversa.temas.map((t) => (
              <span key={t} className="inline-flex items-center bg-brand/10 px-2 py-0.5 text-[10px] font-mono uppercase text-brand">{t}</span>
            ))}
          </div>

          {aberta.conversa.resumo_ia && (
            <div className="mb-4 border-l-4 border-brand bg-paper px-4 py-3 text-sm text-ink/75">
              <span className="mb-1 block font-mono text-[10px] tracking-[0.1em] uppercase text-ink/45">Resumo da AI</span>
              <Markdown texto={aberta.conversa.resumo_ia} />
            </div>
          )}

          {carregandoConversa && <p className="text-sm text-ink/45">A carregar mensagens…</p>}

          <div className="space-y-3">
            {(aberta.mensagens || []).map((msg) => (
              <div key={msg.id} className={msg.papel === 'user' ? 'flex justify-end' : ''}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.papel === 'user'
                    ? 'bg-ink/10'
                    : msg.papel === 'erro'
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : 'border border-line bg-white'
                }`}>
                  <span className="mb-1 block font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                    {msg.papel === 'user' ? 'Utilizador' : msg.papel === 'erro' ? 'Erro de chat' : 'Tecnocrata'}
                    {' · '}{new Date(msg.criado_em).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    {msg.modelo ? ` · ${msg.modelo}` : ''}
                  </span>
                  {msg.papel === 'assistant' ? <Markdown texto={msg.conteudo} /> : msg.conteudo}
                </div>
              </div>
            ))}
            {(aberta.mensagens || []).length === 0 && (
              <p className="text-sm text-ink/45">Sem mensagens registadas nesta conversa.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

// ── Modal de Relatórios gerados pela AI ──
function ModalRelatorios({ aberto, onFechar, relatorios }) {
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    if (!aberto) setSeleccionado(null)
  }, [aberto])

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={seleccionado ? 'Relatório' : 'Relatórios gerados pela AI'}
      subtitulo={seleccionado ? seleccionado.titulo : `${relatorios.length} relatório(s) — clica para ver`}
      largura="max-w-3xl"
    >
      {!seleccionado ? (
        <div className="divide-y divide-line border border-line">
          {relatorios.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink/45">
              Ainda sem relatórios. Usa “Analisar com AI” para gerar o primeiro.
            </p>
          )}
          {relatorios.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSeleccionado(r)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper"
            >
              <FileText size={16} className="mt-0.5 shrink-0 text-ink/35" strokeWidth={1.8} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.titulo}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink/50">{String(r.conteudo || '').replace(/[#*]/g, '').slice(0, 140)}…</p>
                <p className="mt-1 font-mono text-[10px] text-ink/35">{new Date(r.criado_em).toLocaleString('pt-PT')}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setSeleccionado(null)}
            className="mb-4 inline-flex min-h-9 items-center gap-1.5 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            ← Voltar à lista
          </button>

          {seleccionado.metricas && Object.keys(seleccionado.metricas).length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(seleccionado.metricas).map(([k, v]) => (
                <div key={k} className="border border-line bg-paper p-2.5">
                  <p className="text-lg font-bold tracking-[-0.03em]">{v}</p>
                  <p className="truncate text-[10px] text-ink/50" title={k}>{k.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          )}

          <article className="border border-line bg-paper px-5 py-4 text-sm leading-relaxed text-ink/85">
            <Markdown texto={seleccionado.conteudo} />
          </article>

          <p className="mt-3 font-mono text-[10px] text-ink/40">
            Gerado em {new Date(seleccionado.criado_em).toLocaleString('pt-PT')}
          </p>
        </div>
      )}
    </Modal>
  )
}

// Cartão de métrica do dashboard
function KPI({ Icon, valor, label, destaque }) {
  return (
    <div className={`border border-line bg-white p-4 ${destaque ? 'border-l-4 border-l-brand' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold tracking-[-0.04em]">{valor}</p>
        <Icon size={16} className="text-ink/30" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="mt-1 text-[11px] leading-tight text-ink/55">{label}</p>
    </div>
  )
}

// Gráfico de barras simples (conversas por dia)
function Grafico({ histograma }) {
  const entradas = Object.entries(histograma || {}).sort(([a], [b]) => a.localeCompare(b))
  const max = Math.max(1, ...entradas.map(([, v]) => v))
  return (
    <div className="border border-line bg-white p-4">
      <p className="admin-label text-ink/50">Conversas por dia — últimos 30 dias</p>
      <div className="mt-3 flex h-28 items-end gap-[3px]">
        {entradas.map(([dia, v]) => (
          <div key={dia} className="group relative flex-1">
            <div
              className="w-full bg-brand/70 transition-colors group-hover:bg-brand"
              style={{ height: `${Math.max(2, (v / max) * 100)}px` }}
              title={`${dia}: ${v} conversa(s)`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-ink/40">
        <span>{entradas[0]?.[0]}</span>
        <span>{entradas[entradas.length - 1]?.[0]}</span>
      </div>
    </div>
  )
}

// Painel completo de Relatórios de conversa do Tecnocrata
export default function RelatoriosConversa() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [busy, setBusy] = useState('')
  const [modalHistorico, setModalHistorico] = useState(false)
  const [modalRelatorios, setModalRelatorios] = useState(false)
  const [filtros, setFiltros] = useState({ classificacao: 'todas', seguranca: 'todos', pagina: '', dias: 30 })

  const carregar = useCallback(() => {
    setErro('')
    api('/ai-relatorios?dias=30')
      .then(setDados)
      .catch((err) => setErro(err.message))
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function analisar() {
    setBusy('analise')
    setErro('')
    try {
      await api('/ai-relatorios/analise', { method: 'POST' })
      carregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setBusy('')
    }
  }

  if (!dados) return <p className="text-sm text-ink/55">{erro || 'A carregar relatórios…'}</p>

  const m = dados.metricas || {}

  return (
    <div className="space-y-5">
      {/* Cabeçalho + acções */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">AI / relatórios</p>
          <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em]">Relatórios de conversa</h2>
          <p className="mt-1 text-sm text-ink/60">Todas as conversas com o Tecnocrata, filtradas e analisadas pela AI.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setModalHistorico(true)}
            className="inline-flex min-h-10 items-center gap-1.5 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            <History size={13} strokeWidth={1.8} /> Histórico de conversas
          </button>
          <button
            type="button"
            onClick={() => setModalRelatorios(true)}
            className="inline-flex min-h-10 items-center gap-1.5 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            <BarChart3 size={13} strokeWidth={1.8} /> Relatórios gerados ({(dados.relatorios || []).length})
          </button>
          <button
            type="button"
            onClick={carregar}
            className="inline-flex min-h-10 items-center gap-1.5 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            <RefreshCw size={13} strokeWidth={1.8} /> Actualizar
          </button>
          <button
            type="button"
            onClick={analisar}
            disabled={busy === 'analise'}
            className="inline-flex min-h-10 items-center gap-1.5 bg-ink px-5 font-mono text-[10px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft disabled:opacity-50"
          >
            <Sparkles size={13} strokeWidth={1.8} />
            {busy === 'analise' ? 'A analisar…' : 'Analisar com AI'}
          </button>
        </div>
      </div>

      {erro && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI Icon={MessageSquare} valor={m.total_conversas} label="Total de conversas" destaque />
        <KPI Icon={UserCheck} valor={m.pessoas_distintas} label="Pessoas que falaram com a AI" />
        <KPI Icon={ThumbsUp} valor={m.sucessos} label="Atendimentos bem-sucedidos" />
        <KPI Icon={ThumbsDown} valor={m.reclamacoes} label="Reclamações / para melhorar" />
        <KPI Icon={XCircle} valor={m.falhas} label="Falhas do chat" />
        <KPI Icon={Inbox} valor={m.pedidos_nao_atendidos} label="Pedidos não atendidos" />
        <KPI Icon={Shield} valor={m.flag_seguranca} label="Bandeiras de segurança" />
        <KPI Icon={Filter} valor={m.periodo_dias} label="Dias de análise" />
      </div>

      <Grafico histograma={dados.histograma} />

      {/* Resumo dos últimos relatórios (pré-visualização) */}
      <div className="border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="admin-label text-ink/50">Últimos relatórios da AI</p>
          <button
            type="button"
            onClick={() => setModalRelatorios(true)}
            className="font-mono text-[10px] tracking-[0.1em] text-brand uppercase hover:underline"
          >
            Ver todos →
          </button>
        </div>
        {(dados.relatorios || []).length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-ink/45">Ainda sem relatórios. Clica em “Analisar com AI”.</p>
        ) : (
          <div className="divide-y divide-line">
            {(dados.relatorios || []).slice(0, 2).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setModalRelatorios(true)}
                className="block w-full px-4 py-3 text-left hover:bg-paper"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{r.titulo}</p>
                  <span className="font-mono text-[10px] text-ink/40">{new Date(r.criado_em).toLocaleString('pt-PT')}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink/65">{String(r.conteudo || '').replace(/[#*]/g, '').slice(0, 200)}…</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <ModalHistorico
        aberto={modalHistorico}
        onFechar={() => setModalHistorico(false)}
        filtros={filtros}
        setFiltros={setFiltros}
      />
      <ModalRelatorios
        aberto={modalRelatorios}
        onFechar={() => setModalRelatorios(false)}
        relatorios={dados.relatorios || []}
      />
    </div>
  )
}
