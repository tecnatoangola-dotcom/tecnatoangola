import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api.js'

const MUNICIPIOS = [
  'Belas',
  'Cacuaco',
  'Cazenga',
  'Icolo e Bengo',
  'Luanda',
  'Quilamba',
  'Quissama',
  'Talatona',
  'Viana',
]

const ESTADO_CORES = {
  submetida: '#FFA000',
  em_verificacao: '#3B82F6',
  aprovada: '#22C55E',
  rejeitada: '#EF4444',
}

const ESTADO_LABELS = {
  submetida: 'Enviadas',
  em_verificacao: 'Em verificação',
  aprovada: 'Aprovadas',
  rejeitada: 'Rejeitadas',
}

function Card({ label, value, hint, tone = 'light' }) {
  return (
    <div
      className={`border p-4 transition-colors hover:border-ink/35 sm:p-5 ${
        tone === 'dark' ? 'border-ink bg-ink text-white' : 'border-line bg-white'
      }`}
    >
      <p className={`admin-label ${tone === 'dark' ? 'text-white/50' : 'text-ink/45'}`}>
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{value}</p>
      {hint && (
        <p className={`mt-1 text-[11px] sm:text-xs ${tone === 'dark' ? 'text-white/50' : 'text-ink/50'}`}>{hint}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api('/dashboard')
      .then((json) => {
        setData(json)
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [load])

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        {error}
      </div>
    )
  }

  if (!data) return <p className="text-sm text-ink/55">A carregar o dashboard…</p>

  const { cards, serie, por_estado, por_municipio, por_area } = data

  const estadoData = Object.entries(por_estado).map(([status, value]) => ({
    name: ESTADO_LABELS[status] || status,
    value,
  }))
  const areaData = Object.entries(por_area)
    .map(([area, value]) => ({ area: area.length > 18 ? area.slice(0, 18) + '…' : area, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)

  const heatMax = Math.max(1, ...MUNICIPIOS.map((m) => por_municipio[m] || 0))

  return (
    <div className="panel-rise space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">01 / visão geral</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">Operação TECNATO</h1>
          <p className="mt-2 text-sm text-ink/60">Acompanha a participação e decide onde agir primeiro.</p>
        </div>
        <div className="flex gap-2"><Link to="/candidaturas" className="inline-flex min-h-10 items-center bg-ink px-4 font-mono text-[10px] tracking-[0.1em] uppercase text-white hover:bg-ink-soft">Ver candidaturas</Link><button type="button" onClick={load} className="min-h-10 border border-ink/20 bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink">Actualizar</button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Card label="Online agora" value={cards.online} hint="últimos 3 minutos" tone="dark" />
        <Card
          label="Candidaturas submetidas"
          value={cards.submetidas_total}
          hint={`${cards.submetidas_mes} nos últimos 30 dias`}
        />
        <Card
          label="Contas criadas"
          value={cards.registados_total}
          hint={`${cards.registados_mes} nos últimos 30 dias`}
        />
        <Card label="Enviaram por WhatsApp" value={cards.whatsapp_mes} hint="últimos 30 dias" />
        <Card
          label="Leram e saíram sem acção"
          value={cards.sem_accao_mes}
          hint={`de ${cards.visitantes_mes} visitantes no mês`}
        />
        <Card label="Em verificação" value={cards.em_verificacao} hint="por analisar" />
        <Card label="Aprovadas" value={cards.aprovadas} hint={`${cards.rejeitadas} rejeitadas`} />
        <Card
          label="Taxa de conversão (mês)"
          value={`${cards.visitantes_mes ? Math.round((cards.conversao_mes / cards.visitantes_mes) * 100) : 0}%`}
          hint="visitante → acção"
        />
      </div>

      <div className="border border-line bg-white p-5 lg:p-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">Últimos 30 dias</h2>
          <p className="text-xs text-ink/50">candidaturas · registos · WhatsApp</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serie} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 10 }}
                interval={Math.max(0, Math.ceil(serie.length / 6) - 1)}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={32} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="candidaturas" stroke="#0B0B0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="registos" stroke="#FFA000" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="whatsapp" stroke="#22C55E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-line bg-white p-5 lg:p-6">
          <h2 className="mb-4 text-base font-semibold">Estados das candidaturas</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={estadoData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {estadoData.map((entry) => (
                    <Cell key={entry.name} fill={ESTADO_CORES[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-line bg-white p-5 lg:p-6">
          <h2 className="mb-4 text-base font-semibold">Candidaturas por área</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="area"
                  width={100}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#FFA000" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="border border-line bg-white p-5 lg:p-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">Mapa de calor — municípios</h2>
          <p className="text-xs text-ink/50">
            {Object.values(por_municipio).reduce((a, b) => a + b, 0)} candidaturas
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {MUNICIPIOS.map((municipio) => {
            const count = por_municipio[municipio] || 0
            const intensity = count / heatMax
            return (
              <div
                key={municipio}
                className="rounded-xl border border-line p-3 text-center"
                style={{
                  backgroundColor: `rgba(255, 160, 0, ${0.12 + intensity * 0.85})`,
                }}
              >
                <p className="font-display text-lg font-bold">{count}</p>
                <p className="mt-0.5 text-[11px] leading-tight font-medium text-ink/70">
                  {municipio}
                </p>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-ink/50">
          <span>menos</span>
          <span className="h-3 w-24 rounded bg-gradient-to-r from-brand/15 to-brand" />
          <span>mais</span>
        </div>
      </div>
    </div>
  )
}
