import { useEffect, useState } from 'react'
import { Activity, BarChart3, Inbox, Users } from 'lucide-react'
import { api } from '../api.js'

const FOLHAS = [
  {
    nome: 'Resumo',
    desc: 'Todos os indicadores do dashboard: online, submetidas, registados, WhatsApp, estados.',
    key: 'resumo',
    Icon: BarChart3,
  },
  {
    nome: 'Utilizadores',
    desc: 'Nome, email, data de criação, último login, confirmação e nº de candidaturas.',
    key: 'users',
    Icon: Users,
  },
  {
    nome: 'Candidaturas',
    desc: 'Referência, equipa, projecto, município, área, contactos, descrição, estado e sentença.',
    key: 'cands',
    Icon: Inbox,
  },
  {
    nome: 'Eventos (30 dias)',
    desc: 'Agrupamento diário de visitas, registos, envios de plataforma e WhatsApp.',
    key: 'eventos',
    Icon: Activity,
  },
]

export default function Relatorios() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    api('/dashboard')
      .then((json) => setPreview(json))
      .catch(() => setPreview(null))
  }, [])

  const counts = {
    resumo: preview ? Object.keys(preview.cards).length : null,
    users: preview?.cards?.registados_total ?? null,
    cands: preview?.cards?.submetidas_total ?? null,
    eventos: preview?.serie ? preview.serie.length : null,
  }

  async function exportar() {
    setBusy(true)
    setError('')
    setOk('')
    try {
      const res = await api('/reports/excel')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tecnato-crm-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setOk('Relatório exportado com sucesso.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel-rise space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">04 / relatórios</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">
            Exportar CRM completo
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Gera um ficheiro Excel com tudo o que está a acontecer no TECNATO — utilizadores,
            candidaturas, estados, sentenças e métricas de tráfego dos últimos 30 dias.
          </p>
        </div>
        <button
          type="button"
          onClick={exportar}
          disabled={busy}
          className="inline-flex min-h-10 items-center bg-ink px-5 font-mono text-[10px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft disabled:opacity-50"
        >
          {busy ? 'A gerar ficheiro…' : '⤓ Exportar Excel'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FOLHAS.map((folha, index) => (
          <div key={folha.nome} className="border border-line bg-white p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="admin-label flex items-center gap-1.5 text-ink/45">
                <folha.Icon aria-hidden="true" size={13} strokeWidth={1.8} className="shrink-0 text-ink/40" />
                {String(index + 1).padStart(2, '0')} / folha
              </p>
              <span className="font-mono text-[11px] text-ink/50">
                {counts[folha.key] !== null && counts[folha.key] !== undefined
                  ? `${counts[folha.key]} ${folha.key === 'resumo' ? 'indicadores' : folha.key === 'eventos' ? 'dias' : counts[folha.key] === 1 ? 'registo' : 'registos'}`
                  : '…'}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em]">{folha.nome}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/55">{folha.desc}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
      {ok && (
        <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{ok}</div>
      )}

      <div className="border border-line bg-white p-5">
        <p className="admin-label text-ink/45">Nota</p>
        <p className="mt-2 text-xs leading-relaxed text-ink/60">
          O ficheiro é gerado no teu dispositivo com os dados mais recentes da base. Inclui
          credenciais sensíveis? Não — exportamos apenas nomes, emails e métricas operacionais.
          Guarda o ficheiro com cuidado e partilha apenas com a equipa directiva.
        </p>
        <button
          type="button"
          onClick={exportar}
          disabled={busy}
          className="mt-4 inline-flex min-h-11 items-center bg-ink px-6 font-mono text-[10px] tracking-[0.12em] text-white uppercase hover:bg-brand hover:text-ink disabled:opacity-50"
        >
          {busy ? 'A GERAR FICHEIRO…' : '⤓ EXPORTAR RELATÓRIO EXCEL'}
        </button>
      </div>
    </div>
  )
}
