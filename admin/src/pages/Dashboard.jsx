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

const URGENCIA = {
  alta: 'bg-red-100 text-red-800 border-red-200',
  media: 'bg-amber-100 text-amber-800 border-amber-200',
  baixa: 'bg-white text-ink/55 border-line',
}

/* Cartão pequeno e denso — identidade do hero (label mono + número forte) */
function Mini({ label, value, hint, tone = 'light' }) {
  return (
    <div
      className={`border px-3 py-2.5 transition-colors hover:border-ink/35 ${
        tone === 'dark' ? 'border-ink bg-ink text-white' : 'border-line bg-white'
      }`}
    >
      <p className={`admin-label ${tone === 'dark' ? 'text-white/50' : 'text-ink/45'}`}>{label}</p>
      <p className="mt-1 font-display text-xl leading-none font-bold tracking-[-0.03em]">
        {value}
      </p>
      {hint && (
        <p className={`mt-1 text-[10px] ${tone === 'dark' ? 'text-white/50' : 'text-ink/50'}`}>
          {hint}
        </p>
      )}
    </div>
  )
}

/* Funil de conversão (Sales Ops): cada etapa do engagement mensal */
function Funnel({ funil }) {
  const steps = [
    { label: 'Visitantes (30d)', value: funil.visitantes },
    { label: 'Contactos (registo + WhatsApp)', value: funil.contactos },
    { label: 'Candidaturas enviadas', value: funil.candidaturas },
    { label: 'Em verificação', value: funil.em_verificacao },
    { label: 'Aprovadas', value: funil.aprovadas },
  ]
  const max = Math.max(1, ...steps.map((s) => s.value))

  return (
    <div className="border border-line bg-white p-4 lg:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-[-0.02em]">Funil de conversão</h2>
        <p className="admin-label text-ink/40">últimos 30 dias</p>
      </div>
      <ul className="space-y-2">
        {steps.map((step, index) => {
          const previous = index > 0 ? steps[index - 1].value : null
          const pctStep = previous ? Math.round((step.value / Math.max(1, previous)) * 100) : null
          const pctTotal = Math.round((step.value / Math.max(1, funil.visitantes)) * 100)
          return (
            <li key={step.label}>
              <div className="flex items-baseline justify-between gap-2 text-[11px]">
                <span className="text-ink/70">
                  <span className="mr-1.5 font-mono text-[10px] text-ink/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step.label}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-ink/50">
                  {step.value}
                  {pctStep !== null && <span className="ml-1.5 text-brand-deep">{pctStep}%</span>}
                  <span className="ml-1.5 text-ink/30">{pctTotal}%</span>
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full bg-paper">
                <div
                  className="h-full bg-ink transition-[width] duration-500"
                  style={{
                    width: `${Math.max(2, (step.value / max) * 100)}%`,
                    backgroundColor: index === steps.length - 1 ? '#22C55E' : undefined,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* Fila de trabalho: pendentes com idade e próxima acção */
function Pendentes({ pendentes }) {
  if (!pendentes?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-dashed border-line bg-white p-6 text-center">
        <p className="font-display text-lg font-bold">Fila vazia</p>
        <p className="mt-1 text-xs text-ink/55">
          Nenhuma candidatura pendente de acção. Tudo em dia.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-line bg-white">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold tracking-[-0.02em]">Próximas acções</h2>
        <Link
          to="/candidaturas"
          className="admin-label text-brand-deep hover:text-ink"
        >
          abrir fila →
        </Link>
      </div>
      <ul className="divide-y divide-line">
        {pendentes.map((p) => (
          <li
            key={p.referencia}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-paper"
          >
            <span
              className={`inline-flex shrink-0 items-center border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.05em] uppercase ${URGENCIA[p.urgencia] || URGENCIA.baixa}`}
            >
              {p.dias}d
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">
                {p.equipa || p.projecto || p.referencia}
              </p>
              <p className="truncate text-[11px] text-ink/50">
                <span className="font-mono">{p.referencia}</span>
                {' · '}
                {p.proxima}
              </p>
            </div>
            <span
              className={`admin-label hidden shrink-0 sm:inline ${
                p.status === 'submetida' ? 'text-brand-deep' : 'text-blue-700'
              }`}
            >
              {p.status === 'submetida' ? 'verificar' : 'decidir'}
            </span>
          </li>
        ))}
      </ul>
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
      <div className="border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        {error}
      </div>
    )
  }

  if (!data) return <p className="text-sm text-ink/55">A carregar o dashboard…</p>

  const { cards, serie, por_estado, por_municipio, por_area, funil, pendentes } = data

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
    <div className="panel-rise space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">01 / visão geral</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">
            Operação TECNATO
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Acompanha a participação e decide onde agir primeiro.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/candidaturas"
            className="inline-flex min-h-9 items-center bg-ink px-4 font-mono text-[10px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft"
          >
            Ver candidaturas
          </Link>
          <button
            type="button"
            onClick={load}
            className="min-h-9 border border-ink/20 bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Cartões pequenos — KPIs densos */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 lg:gap-3">
        <Mini label="Online agora" value={cards.online} hint="últimos 3 min" tone="dark" />
        <Mini
          label="Submetidas"
          value={cards.submetidas_total}
          hint={`+${cards.submetidas_mes} no mês`}
        />
        <Mini label="Por verificar" value={cards.submetidas_estado} hint="estado: nova" />
        <Mini label="Em análise" value={cards.em_verificacao} hint="em verificação" />
        <Mini
          label="Aprovadas"
          value={cards.aprovadas}
          hint={`${cards.rejeitadas} rejeitadas`}
        />
        <Mini
          label="Conversão"
          value={`${
            cards.visitantes_mes
              ? Math.round((cards.conversao_mes / cards.visitantes_mes) * 100)
              : 0
          }%`}
          hint={`${cards.conversao_mes}/${cards.visitantes_mes} no mês`}
        />
        <Mini label="Contas" value={cards.registados_total} hint={`+${cards.registados_mes} no mês`} />
        <Mini label="WhatsApp" value={cards.whatsapp_mes} hint="últimos 30 dias" />
        <Mini label="Sem acção" value={cards.sem_accao_mes} hint={`de ${cards.visitantes_mes} vis.`} />
        <Mini
          label="Ticket aberto"
          value={pendentes?.length || 0}
          hint="pendentes na fila"
        />
        <Mini
          label="SLA > 7 dias"
          value={pendentes?.filter((p) => p.dias >= 7).length || 0}
          hint="prioridade alta"
        />
        <Mini
          label="Média de idade"
          value={
            pendentes?.length
              ? `${Math.round(pendentes.reduce((acc, p) => acc + p.dias, 0) / pendentes.length)}d`
              : '—'
          }
          hint="das pendentes"
        />
      </div>

      {/* Sales Ops: funil + fila de acções */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Funnel funil={funil || cards} />
        <Pendentes pendentes={pendentes} />
      </div>

      <div className="border border-line bg-white p-4 lg:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-[-0.02em]">Últimos 30 dias</h2>
          <p className="admin-label text-ink/40">candidaturas · registos · whatsapp</p>
        </div>
        <div className="h-56">
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
        <div className="border border-line bg-white p-4 lg:p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-[-0.02em]">Estados das candidaturas</h2>
          {estadoData.length === 0 ? (
            <div className="flex h-56 items-center justify-center border border-dashed border-line text-xs text-ink/50">
              Ainda sem candidaturas registadas.
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={estadoData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                    {estadoData.map((entry) => (
                      <Cell key={entry.name} fill={ESTADO_CORES[entry.name] || '#999'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="border border-line bg-white p-4 lg:p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-[-0.02em]">Candidaturas por área</h2>
          {areaData.length === 0 ? (
            <div className="flex h-56 items-center justify-center border border-dashed border-line text-xs text-ink/50">
              Ainda sem áreas representadas.
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="area" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FFA000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="border border-line bg-white p-4 lg:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-[-0.02em]">Mapa de calor — municípios</h2>
          <p className="admin-label text-ink/40">
            {Object.values(por_municipio).reduce((a, b) => a + b, 0)} candidaturas
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {MUNICIPIOS.map((municipio) => {
            const count = por_municipio[municipio] || 0
            const intensity = count / heatMax
            return (
              <div
                key={municipio}
                className="border border-line p-2 text-center"
                style={{
                  backgroundColor: `rgba(255, 160, 0, ${0.12 + intensity * 0.85})`,
                }}
              >
                <p className="font-display text-base font-bold">{count}</p>
                <p className="mt-0.5 text-[10px] leading-tight font-medium text-ink/70">{municipio}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-ink/50">
          <span>menos</span>
          <span className="h-2.5 w-20 bg-gradient-to-r from-brand/15 to-brand" />
          <span>mais</span>
        </div>
      </div>
    </div>
  )
}
