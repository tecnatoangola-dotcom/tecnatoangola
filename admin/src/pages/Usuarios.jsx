import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const STATUS_LABELS = {
  submetida: 'Enviada',
  em_verificacao: 'Em verificação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
}

function Inicial({ user }) {
  if (user.foto_url) {
    return <img src={user.foto_url} alt="" className="h-10 w-10 rounded-full object-cover" />
  }
  const iniciais = (user.nome || user.email)
    .split(/\s+/)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-brand">
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-4 py-4 sm:rounded-t-2xl sm:px-7 sm:pt-7">
          <div className="flex min-w-0 items-center gap-3">
            <Inicial user={user} />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold">{user.nome}</h2>
              <p className="text-sm break-all text-ink/60">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-4 pb-6 sm:px-7 sm:pb-7">
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Criado em
            </dt>
            <dd className="mt-1 font-medium">{new Date(user.criado_em).toLocaleString('pt-PT')}</dd>
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Último login
            </dt>
            <dd className="mt-1 font-medium">
              {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString('pt-PT') : '—'}
            </dd>
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Email confirmado
            </dt>
            <dd className="mt-1 font-medium">{user.confirmado ? 'Sim' : 'Não'}</dd>
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Provedor
            </dt>
            <dd className="mt-1 font-medium">{user.provedor}</dd>
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Foto de perfil
            </dt>
            <dd className="mt-1 font-medium">{user.foto_url ? 'Sim' : 'Não'}</dd>
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <dt className="text-xs font-semibold tracking-wider text-ink/45 uppercase">
              Candidaturas
            </dt>
            <dd className="mt-1 font-medium">{user.n_candidaturas}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold tracking-wider text-ink/50 uppercase">
            Actividade de candidatura
          </p>
          {user.candidaturas.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">
              Só tem conta — ainda não submeteu nenhuma candidatura.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {user.candidaturas.map((c) => (
                <li key={c.referencia} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{c.projecto}</span>
                  <span className="shrink-0 text-xs text-ink/55">
                    {STATUS_LABELS[c.status] || c.status} ·{' '}
                    {new Date(c.created_at).toLocaleDateString('pt-PT')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={apagarDados}
            disabled={Boolean(busy)}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-amber-400 px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
          >
            {busy === 'dados' ? 'A apagar…' : 'Apagar dados'}
          </button>
          <button
            type="button"
            onClick={apagarConta}
            disabled={Boolean(busy)}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy === 'conta' ? 'A eliminar…' : 'Eliminar conta'}
          </button>
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

  function removerLocal(id) {
    setUsers((current) => current.filter((u) => u.id !== id))
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand-deep uppercase">CRM</p>
          <h1 className="mt-1 text-2xl font-bold lg:text-3xl">Utilizadores</h1>
        </div>
        <p className="text-sm text-ink/55">
          {visiveis.length} conta{visiveis.length === 1 ? '' : 's'}
        </p>
      </div>

      <input
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
        placeholder="Procurar por nome ou email…"
        className="mt-5 min-h-11 w-full rounded-full border border-line bg-white px-5 py-2.5 text-sm focus:border-ink focus:outline-none sm:w-80"
      />

      {loading ? (
        <p className="mt-8 text-sm text-ink/55">A carregar utilizadores…</p>
      ) : visiveis.length === 0 ? (
        <p className="mt-8 text-sm text-ink/55">Nenhuma conta encontrada.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="hidden grid-cols-12 gap-3 border-b border-line bg-paper px-5 py-3 text-xs font-semibold tracking-wider text-ink/50 uppercase lg:grid">
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
              className="grid w-full grid-cols-1 gap-2 border-b border-line px-5 py-4 text-left last:border-b-0 hover:bg-paper lg:grid-cols-12 lg:items-center lg:gap-3"
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
