import { useState } from 'react'
import { api } from '../api.js'

const FOLHAS = [
  ['Resumo', 'Todos os indicadores do dashboard: online, submetidas, registados, WhatsApp, estados.'],
  ['Utilizadores', 'Nome, email, data de criação, último login, confirmação e nº de candidaturas.'],
  [
    'Candidaturas',
    'Referência, equipa, projecto, município, área, contactos, descrição, estado e sentença.',
  ],
  ['Eventos (30 dias)', 'Agrupamento diário de visitas, registos, envios de plataforma e WhatsApp.'],
]

export default function Relatorios() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

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
    <div className="max-w-2xl">
      <p className="text-xs font-semibold tracking-widest text-brand-deep uppercase">Relatórios</p>
      <h1 className="mt-1 text-2xl font-bold lg:text-3xl">Exportar CRM completo</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        Gera um ficheiro Excel com tudo o que está a acontecer no TECNATO — utilizadores,
        candidaturas, estados, sentenças e métricas de tráfego dos últimos 30 dias.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {FOLHAS.map(([nome, desc]) => (
          <div key={nome} className="border-b border-line px-5 py-4 last:border-b-0">
            <p className="text-sm font-semibold">{nome}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">{desc}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {ok && (
        <div className="mt-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {ok}
        </div>
      )}

      <button
        type="button"
        onClick={exportar}
        disabled={busy}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-50 sm:w-auto"
      >
        {busy ? 'A gerar ficheiro…' : '⤓ Exportar relatório Excel'}
      </button>
    </div>
  )
}
