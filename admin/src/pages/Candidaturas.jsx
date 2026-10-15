import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const STATES = {
  submetida: { label: 'Nova', style: 'bg-brand/35 text-ink' },
  em_verificacao: { label: 'Em análise', style: 'bg-blue-100 text-blue-900' },
  aprovada: { label: 'Aprovada', style: 'bg-emerald-100 text-emerald-900' },
  rejeitada: { label: 'Não seleccionada', style: 'bg-red-100 text-red-900' },
}

function Status({ value }) {
  const item = STATES[value] || STATES.submetida
  return <span className={`inline-flex shrink-0 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.06em] uppercase ${item.style}`}>{item.label}</span>
}

function Detail({ candidatura, onClose, onUpdated }) {
  const [media, setMedia] = useState(null)
  const [status, setStatus] = useState(candidatura.status)
  const [nota, setNota] = useState(candidatura.admin_nota || '')
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setMedia(null)
    api(`/candidaturas/${candidatura.referencia}/media`).then(setMedia).catch((err) => setFeedback(err.message))
  }, [candidatura.referencia])

  async function save() {
    setBusy(true); setFeedback('')
    try {
      const response = await api(`/candidaturas/${candidatura.referencia}`, { method: 'PATCH', body: JSON.stringify({ status, nota }) })
      onUpdated(response.candidatura)
      setFeedback('Decisão guardada. A equipa verá esta nota no perfil.')
    } catch (err) { setFeedback(err.message) } finally { setBusy(false) }
  }

  const c = candidatura
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/45" onClick={onClose}>
      <aside className="h-full w-full max-w-3xl overflow-y-auto bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-5 sm:px-8">
          <div className="min-w-0"><p className="admin-label text-ink/45">{c.referencia} / candidatura</p><h2 className="mt-2 truncate text-2xl font-bold tracking-[-0.04em]">{c.projecto}</h2><p className="mt-1 text-sm text-ink/60">{c.equipa} · {c.municipio}</p></div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-lg hover:bg-paper">×</button>
        </header>
        <div className="p-5 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              {media?.videoUrl ? <video src={media.videoUrl} controls className="aspect-video w-full bg-ink" /> : <div className="flex aspect-video items-center justify-center bg-ink font-mono text-xs text-white/50">{media ? 'SEM VÍDEO DISPONÍVEL' : 'A CARREGAR VÍDEO…'}</div>}
              {media?.fotoUrl && <img src={media.fotoUrl} alt={`Equipa ${c.equipa}`} className="max-h-80 w-full object-contain bg-paper" />}
            </div>
            <div className="space-y-3 text-sm"><div className="border border-line p-4"><p className="admin-label text-ink/45">Descrição</p><p className="mt-2 leading-relaxed text-ink/75">{c.descricao}</p></div><div className="grid grid-cols-2 gap-3"><Info label="Área" value={c.area} /><Info label="Recebida" value={new Date(c.created_at).toLocaleDateString('pt-PT')} /><Info label="WhatsApp" value={c.whatsapp} /><Info label="Email" value={c.email || '—'} /></div><Info label="Conta ligada" value={c.user_email || 'Sem conta associada'} /></div>
          </div>
          <section className="mt-7 border-t-2 border-brand bg-paper p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="admin-label text-ink/45">Decisão da equipa</p><h3 className="mt-1 text-lg font-semibold">Avaliar candidatura</h3></div><Status value={status} /></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><label><span className="mb-1.5 block text-xs font-semibold">Estado</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-line bg-white px-3 py-3 text-sm focus:border-ink focus:outline-none">{Object.entries(STATES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold">Nota para a equipa</span><textarea rows={4} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Escreve uma nota clara para a equipa candidata…" className="w-full resize-y border border-line bg-white px-3 py-3 text-sm focus:border-ink focus:outline-none" /></label></div>{feedback && <p className="mt-3 text-sm text-emerald-700">{feedback}</p>}<button type="button" onClick={save} disabled={busy} className="mt-5 min-h-11 bg-ink px-5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-white transition-colors hover:bg-brand hover:text-ink disabled:opacity-50">{busy ? 'A GUARDAR…' : 'Guardar decisão'}</button>{c.avaliado_em && <p className="mt-4 text-xs text-ink/45">Última avaliação: {new Date(c.avaliado_em).toLocaleString('pt-PT')}{c.avaliado_por ? ` · ${c.avaliado_por}` : ''}</p>}</section>
        </div>
      </aside>
    </div>
  )
}

function Info({ label, value }) { return <div className="border border-line bg-paper p-3.5"><p className="admin-label text-ink/45">{label}</p><p className="mt-1.5 break-words text-sm font-medium text-ink/80">{value}</p></div> }

function exportCsv(rows) {
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const data = [['Referência', 'Projecto', 'Equipa', 'Município', 'Área', 'Estado', 'Data'], ...rows.map((r) => [r.referencia, r.projecto, r.equipa, r.municipio, r.area, STATES[r.status]?.label || r.status, new Date(r.created_at).toLocaleString('pt-PT')])]
  const url = URL.createObjectURL(new Blob([data.map((line) => line.map(quote).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = 'tecnato-candidaturas.csv'; link.click(); URL.revokeObjectURL(url)
}

export default function Candidaturas() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [search, setSearch] = useState(''); const [state, setState] = useState('todas'); const [municipio, setMunicipio] = useState('todos'); const [area, setArea] = useState('todas'); const [order, setOrder] = useState('recentes'); const [selected, setSelected] = useState([]); const [bulkState, setBulkState] = useState('em_verificacao'); const [busy, setBusy] = useState(false); const [detail, setDetail] = useState(null)
  function load() { setLoading(true); api('/candidaturas').then((json) => { setRows(json.candidaturas); setError('') }).catch((err) => setError(err.message)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])
  const municipios = useMemo(() => [...new Set(rows.map((r) => r.municipio).filter(Boolean))].sort(), [rows]); const areas = useMemo(() => [...new Set(rows.map((r) => r.area).filter(Boolean))].sort(), [rows])
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return rows.filter((r) => (!q || [r.projecto, r.equipa, r.referencia, r.municipio, r.area].join(' ').toLowerCase().includes(q)) && (state === 'todas' || r.status === state) && (municipio === 'todos' || r.municipio === municipio) && (area === 'todas' || r.area === area)).sort((a, b) => order === 'recentes' ? new Date(b.created_at) - new Date(a.created_at) : a.projecto.localeCompare(b.projecto, 'pt')) }, [rows, search, state, municipio, area, order])
  const counts = Object.fromEntries(Object.keys(STATES).map((key) => [key, rows.filter((r) => r.status === key).length]))
  function toggle(ref) { setSelected((current) => current.includes(ref) ? current.filter((item) => item !== ref) : [...current, ref]) }
  async function bulkUpdate() { if (!selected.length || busy) return; setBusy(true); try { const updated = await Promise.all(selected.map((referencia) => { const row = rows.find((item) => item.referencia === referencia); return api(`/candidaturas/${referencia}`, { method: 'PATCH', body: JSON.stringify({ status: bulkState, nota: row?.admin_nota || '' }) }) })); const map = new Map(updated.map((item) => [item.candidatura.referencia, item.candidatura])); setRows((current) => current.map((row) => map.get(row.referencia) || row)); setSelected([]) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  function update(updated) { setRows((current) => current.map((row) => row.referencia === updated.referencia ? { ...row, ...updated } : row)); setDetail((current) => current?.referencia === updated.referencia ? { ...current, ...updated } : current) }
  return <div className="panel-rise"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="admin-label text-brand-deep">02 / triagem</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">Candidaturas</h1><p className="mt-2 text-sm text-ink/60">Analisa, decide e acompanha os projectos da edição.</p></div><div className="flex gap-2"><button type="button" onClick={load} className="min-h-10 border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink">Actualizar</button><button type="button" onClick={() => exportCsv(filtered)} className="min-h-10 bg-ink px-4 font-mono text-[10px] tracking-[0.1em] uppercase text-white hover:bg-ink-soft">Exportar CSV</button></div></div>
    <div className="mt-7 grid grid-cols-2 border border-line bg-white sm:grid-cols-4">{Object.entries(STATES).map(([key, item]) => <button key={key} type="button" onClick={() => setState(state === key ? 'todas' : key)} className={`border-r border-line p-4 text-left last:border-r-0 transition-colors ${state === key ? 'bg-brand' : 'hover:bg-paper'}`}><p className="admin-label text-ink/50">{item.label}</p><p className="mt-1 text-2xl font-bold tracking-[-0.04em]">{counts[key]}</p></button>)}</div>
    <div className="mt-6 grid gap-3 border-y border-line py-4 lg:grid-cols-[minmax(220px,1.5fr)_1fr_1fr_150px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar projecto, equipa ou referência…" className="min-h-11 border border-line bg-white px-4 text-sm focus:border-ink focus:outline-none" /><select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="min-h-11 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"><option value="todos">Todos os municípios</option>{municipios.map((value) => <option key={value}>{value}</option>)}</select><select value={area} onChange={(e) => setArea(e.target.value)} className="min-h-11 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"><option value="todas">Todas as áreas</option>{areas.map((value) => <option key={value}>{value}</option>)}</select><select value={order} onChange={(e) => setOrder(e.target.value)} className="min-h-11 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"><option value="recentes">Mais recentes</option><option value="projecto">Nome do projecto</option></select></div>
    {selected.length > 0 && <div className="sticky top-20 z-20 mt-4 flex flex-wrap items-center gap-3 border border-brand bg-brand px-4 py-3"><p className="text-sm font-semibold">{selected.length} seleccionada{selected.length > 1 ? 's' : ''}</p><select value={bulkState} onChange={(e) => setBulkState(e.target.value)} className="min-h-9 bg-white px-3 text-xs"><option value="em_verificacao">Mover para análise</option><option value="aprovada">Aprovar</option><option value="rejeitada">Não seleccionar</option></select><button type="button" onClick={bulkUpdate} disabled={busy} className="min-h-9 bg-ink px-4 font-mono text-[10px] tracking-[0.1em] uppercase text-white disabled:opacity-50">{busy ? 'A guardar…' : 'Aplicar em lote'}</button><button type="button" onClick={() => setSelected([])} className="ml-auto text-xs font-semibold underline">Limpar</button></div>}
    {error && <p className="mt-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    {loading ? <p className="mt-8 text-sm text-ink/55">A carregar candidaturas…</p> : filtered.length === 0 ? <p className="mt-8 text-sm text-ink/55">Nenhuma candidatura corresponde aos filtros.</p> : <div className="mt-6 overflow-hidden border border-line bg-white"><div className="hidden grid-cols-[40px_minmax(200px,1.6fr)_1fr_1fr_130px_40px] gap-4 border-b border-line bg-paper px-5 py-3 admin-label text-ink/45 lg:grid"><span><input aria-label="Seleccionar todas" type="checkbox" checked={filtered.length > 0 && filtered.every((r) => selected.includes(r.referencia))} onChange={(e) => setSelected(e.target.checked ? filtered.map((r) => r.referencia) : [])} /></span><span>Projecto</span><span>Área e município</span><span>Recebida</span><span>Estado</span><span /></div>{filtered.map((row) => <article key={row.referencia} className="grid grid-cols-[28px_1fr_28px] gap-3 border-b border-line p-4 last:border-b-0 lg:grid-cols-[40px_minmax(200px,1.6fr)_1fr_1fr_130px_40px] lg:items-center lg:gap-4 lg:px-5"><input aria-label={`Seleccionar ${row.projecto}`} type="checkbox" checked={selected.includes(row.referencia)} onChange={() => toggle(row.referencia)} /><button type="button" onClick={() => setDetail(row)} className="min-w-0 text-left"><p className="truncate text-sm font-semibold">{row.projecto}</p><p className="mt-0.5 truncate text-xs text-ink/55">{row.equipa} · {row.referencia}</p></button><div className="hidden lg:block"><p className="text-sm">{row.area}</p><p className="mt-0.5 text-xs text-ink/55">{row.municipio}</p></div><p className="hidden text-xs text-ink/60 lg:block">{new Date(row.created_at).toLocaleDateString('pt-PT')}</p><div className="hidden lg:block"><Status value={row.status} /></div><button type="button" onClick={() => setDetail(row)} aria-label={`Abrir ${row.projecto}`} className="text-lg text-ink/50 transition-transform hover:translate-x-0.5">→</button><div className="col-start-2 flex items-center justify-between gap-2 lg:hidden"><p className="truncate text-xs text-ink/55">{row.area} · {row.municipio}</p><Status value={row.status} /></div></article>)}</div>}
    {detail && <Detail candidatura={detail} onClose={() => setDetail(null)} onUpdated={update} />}
  </div>
}
