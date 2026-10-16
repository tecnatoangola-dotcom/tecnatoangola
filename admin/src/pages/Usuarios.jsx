import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const STATUS_LABELS = {
  submetida: 'Enviada',
  em_verificacao: 'Em verificação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
}

const STATUS_STYLE = {
  submetida: 'bg-brand/30 text-ink',
  em_verificacao: 'bg-blue-100 text-blue-900',
  aprovada: 'bg-emerald-100 text-emerald-900',
  rejeitada: 'bg-red-100 text-red-900',
}

function Inicial({ user }) {
  if (user.foto_url) {
    return <img src={user.foto_url} alt="" className="h-10 w-10 shrink-0 border border-line object-cover" />
  }
  const iniciais = (user.nome || user.email)
    .split(/\s+/)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink font-mono text-[11px] font-bold text-brand">
      {iniciais}
    </span>
  )
}

function Detalhe({ user, onClose, onChanged }) {
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function apagarDados() {
    if (!window.confirm('Apagar TODOS os dados deste utilizador (candidaturas, fotos, perfil)? A conta fica activa.')) return
    setBusy('dados')
    setError('')
    try {
      const res = await api(`/users/${user.id}/data`, { method: 'DELETE' })
      onChanged(user.id, { dados: true, mensagem: res.mensagem })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  async function apagarConta() {
    if (!window.confirm('ELIMINAR definitivamente a conta e todos os dados deste utilizador?')) return
    setBusy('conta')
    setError('')
    try {
      const res = await api(`/users/${user.id}`, { method: 'DELETE' })
      onChanged(user.id, { conta: true, mensagem: res.mensagem })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <Inicial user={user} />
            <div className="min-w-0">
              <p className="admin-label text-ink/45">conta / utilizador</p>
              <h2 className="mt-1 truncate text-lg font-bold tracking-[-0.03em]">{user.nome}</h2>
              <p className="text-sm break-all text-ink/60">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-lg hover:bg-paper"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-6 sm:px-7 sm:pb-7">
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {[
              ['Criado em', new Date(user.criado_em).toLocaleString('pt-PT')],
              ['Último login', user.ultimo_login ? new Date(user.ultimo_login).toLocaleString('pt-PT') : '—'],
              ['Email confirmado', user.confirmado ? 'Sim' : 'Não'],
              ['Provedor', user.provedor],
              ['Foto de perfil', user.foto_url ? 'Sim' : 'Não'],
              ['Candidaturas', String(user.n_candidaturas)],
            ].map(([label, value]) => (
              <div key={label} className="border border-line bg-paper p-3.5">
                <dt className="admin-label text-ink/45">{label}</dt>
                <dd className="mt-1.5 text-sm font-medium break-words text-ink/80">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 border border-line bg-paper p-4">
            <p className="admin-label text-ink/50">Actividade de candidatura</p>
            {user.candidaturas.length === 0 ? (
              <p className="mt-2 text-sm text-ink/60">
                Só tem conta — ainda não submeteu nenhuma candidatura.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {user.candidaturas.map((c) => (
                  <li key={c.referencia} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{c.projecto}</span>
                    <span
                      className={`inline-flex shrink-0 px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase ${STATUS_STYLE[c.status] || 'bg-paper text-ink/60'}`}
                    >
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-5 border-t border-line pt-5">
            <p className="admin-label text-ink/45">Zona de perigo</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={apagarDados}
                disabled={Boolean(busy)}
                className="flex min-h-11 flex-1 items-center justify-center border border-amber-400 px-5 font-mono text-[10px] tracking-[0.1em] text-amber-800 uppercase hover:bg-amber-50 disabled:opacity-50"
              >
                {busy === 'dados' ? 'A apagar…' : 'Apagar dados'}
              </button>
              <button
                type="button"
                onClick={apagarConta}
                disabled={Boolean(busy)}
                className="flex min-h-11 flex-1 items-center justify-center bg-red-600 px-5 font-mono text-[10px] tracking-[0.1em] text-white uppercase hover:bg-red-700 disabled:opacity-50"
              >
                {busy === 'conta' ? 'A eliminar…' : 'Eliminar conta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Usuarios() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    api('/users')
      .then((json) => setUsers(json.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }, [users, busca])

  const comCandidaturas = users.filter((u) => u.n_candidaturas > 0).length

  function removerLocal(id) {
    setUsers((current) => current.filter((u) => u.id !== id))
  }

  if (error) {
    return (
      <div className="border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        {error}
      </div>
    )
  }

  return (
    <div className="panel-rise space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">03 / contas</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">Utilizadores</h1>
          <p className="mt-1 text-sm text-ink/60">
            Contas registadas na plataforma e o seu histórico de candidaturas.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] text-ink/60 uppercase">
            {visiveis.length} conta{visiveis.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:grid-cols-3 lg:gap-3">
        <div className="border border-ink bg-ink px-3 py-2.5 text-white">
          <p className="admin-label text-white/50">Total de contas</p>
          <p className="mt-1 font-display text-xl leading-none font-bold tracking-[-0.03em]">{users.length}</p>
        </div>
        <div className="border border-line bg-white px-3 py-2.5">
          <p className="admin-label text-ink/45">Com candidaturas</p>
          <p className="mt-1 font-display text-xl leading-none font-bold tracking-[-0.03em]">{comCandidaturas}</p>
        </div>
        <div className="border border-line bg-white px-3 py-2.5">
          <p className="admin-label text-ink/45">Só conta</p>
          <p className="mt-1 font-display text-xl leading-none font-bold tracking-[-0.03em]">
            {users.length - comCandidaturas}
          </p>
        </div>
      </div>

      <input
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
        placeholder="Procurar por nome ou email…"
        className="min-h-11 w-full border border-line bg-white px-4 text-sm focus:border-ink focus:outline-none sm:w-80"
      />

      {loading ? (
        <p className="text-sm text-ink/55">A carregar utilizadores…</p>
      ) : visiveis.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-line bg-white p-8 text-center">
          <p className="font-display text-lg font-bold">Nenhuma conta encontrada</p>
          <p className="mt-1 text-xs text-ink/55">Ajusta a pesquisa ou aguarda novos registos.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-line bg-white">
          <div className="hidden grid-cols-12 gap-3 border-b border-line bg-paper px-5 py-3 admin-label text-ink/45 lg:grid">
            <span className="col-span-4">Utilizador</span>
            <span className="col-span-3">Criado em</span>
            <span className="col-span-3">Último login</span>
            <span className="col-span-2 text-right">Candidaturas</span>
          </div>

          {visiveis.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setSeleccionado(user)}
              className="grid w-full grid-cols-1 gap-2 border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-paper lg:grid-cols-12 lg:items-center lg:gap-3"
            >
              <span className="flex items-center gap-3 lg:col-span-4">
                <Inicial user={user} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{user.nome}</span>
                  <span className="block truncate text-xs text-ink/55">{user.email}</span>
                </span>
              </span>
              <span className="hidden text-xs text-ink/60 lg:col-span-3 lg:block">
                {new Date(user.criado_em).toLocaleString('pt-PT')}
              </span>
              <span className="hidden text-xs text-ink/60 lg:col-span-3 lg:block">
                {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString('pt-PT') : '—'}
              </span>
              <span className="text-xs font-semibold lg:col-span-2 lg:text-right">
                {user.n_candidaturas}
                {user.n_candidaturas === 0 && (
                  <span className="ml-2 font-normal text-ink/45">só conta</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {seleccionado && (
        <Detalhe
          user={seleccionado}
          onClose={() => setSeleccionado(null)}
          onChanged={(id, result) => {
            if (result.conta) removerLocal(id)
          }}
        />
      )}
    </div>
  )
}
