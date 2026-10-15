import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants.js'
import {
  STATUS_LABELS,
  STATUS_STYLES,
  fetchCandidaturas,
} from '../lib/candidaturas.js'
import { useAuth } from '../lib/authContext.js'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Perfil() {
  const { user, loading, signOut } = useAuth()
  const [rows, setRows] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loadingRows, setLoadingRows] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarError, setAvatarError] = useState('')
  const avatarInputRef = useRef(null)

  useEffect(() => {
    if (!user) return
    fetchCandidaturas(user.id).then(({ rows: data, error }) => {
      setRows(data)
      setLoadError(error || '')
      setLoadingRows(false)
    })
  }, [user])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return

    supabase
      .from('perfis')
      .select('foto_path')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data?.foto_path) return
        const { data: signed } = await supabase.storage
          .from('perfis')
          .createSignedUrl(data.foto_path, 60 * 60 * 24 * 30)
        if (signed?.signedUrl) setAvatarUrl(signed.signedUrl)
      })
  }, [user])

  async function handleAvatar(file) {
    if (!file || !user) return
    setAvatarError('')

    if (!file.type.startsWith('image/')) {
      setAvatarError('Escolhe uma imagem (JPG, PNG ou WebP).')
      return
    }

    const path = `${user.id}/avatar.jpg`
    const { error } = await supabase.storage
      .from('perfis')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) {
      setAvatarError('Não foi possível enviar a foto. Tenta novamente.')
      return
    }

    await supabase.from('perfis').upsert({
      user_id: user.id,
      nome: user.user_metadata?.nome || null,
      foto_path: path,
    })

    setAvatarUrl(`${URL.createObjectURL(file)}?t=${Date.now()}`)
  }

  if (loading) return null

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  const nome = user.user_metadata?.nome || user.email
  const iniciais = nome
    .split(/\s+/)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-ink font-display text-xl font-bold text-brand sm:h-20 sm:w-20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                iniciais
              )}
            </span>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => handleAvatar(event.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Alterar foto de perfil"
              className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-sm shadow-sm"
            >
              ✎
            </button>
          </div>
          <div>
            <p className="section-label text-brand-deep">O meu perfil</p>
            <h1 className="mt-1.5 text-2xl font-bold sm:text-3xl">{nome}</h1>
            <p className="mt-1 text-sm text-ink/60">{user.email}</p>
            {avatarError && <p className="mt-1 text-xs text-red-600">{avatarError}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="min-h-11 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
        >
          Terminar sessão
        </button>
      </div>

      <div className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="section-label text-ink/50">As minhas candidaturas</p>
          <Link
            to="/candidatura"
            className="text-sm font-semibold text-ink underline underline-offset-2"
          >
            + Nova candidatura
          </Link>
        </div>

        {loadError && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
            Não foi possível carregar as candidaturas: {loadError}
          </div>
        )}

        {loadingRows ? (
          <p className="mt-6 text-sm text-ink/55">A carregar…</p>
        ) : rows.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-line bg-white p-6 text-center">
            <p className="text-sm font-semibold">Ainda não tens candidaturas.</p>
            <p className="mt-1.5 text-sm text-ink/65">
              Envia o vídeo da tua equipa e acompanha aqui o estado de verificação e aprovação.
            </p>
            <Link
              to="/candidatura"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
            >
              Apresentar o meu projecto
            </Link>
          </div>
        ) : (
          <ul className="mt-5 space-y-4">
            {rows.map((row) => (
              <li key={row.referencia} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-widest text-ink/45 uppercase">
                      {row.referencia}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{row.projecto}</h2>
                    <p className="mt-0.5 text-sm text-ink/60">
                      {row.equipa} · {row.municipio} · {row.area}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[row.status] || STATUS_STYLES.submetida
                    }`}
                  >
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  {row.status === 'rejeitada' ? (
                    <p className="text-xs font-medium text-red-700">
                      Candidatura não aprovada nesta fase — contacta-nos para saber mais.
                    </p>
                  ) : (
                    <>
                      <ol className="flex items-center gap-2">
                        {['submetida', 'em_verificacao', 'aprovada'].map((step, index) => {
                          const order = ['submetida', 'em_verificacao', 'aprovada']
                          const currentIndex = Math.max(order.indexOf(row.status), 0)
                          const done = index <= currentIndex

                          return (
                            <li key={step} className="flex-1">
                              <span
                                className={`block h-2 rounded-full ${done ? 'bg-brand' : 'bg-line'}`}
                              />
                            </li>
                          )
                        })}
                      </ol>
                      <div className="mt-2 flex justify-between text-[11px] text-ink/50">
                        <span>Enviada</span>
                        <span>Em verificação</span>
                        <span>Aprovada</span>
                      </div>
                    </>
                  )}
                  <p className="mt-3 text-xs text-ink/50">Enviada em {formatDate(row.created_at)}</p>
                </div>

                {row.admin_nota && (
                  <div className="mt-4 rounded-xl border border-brand/60 bg-brand/10 px-4 py-3">
                    <p className="text-xs font-semibold tracking-wider text-ink/70 uppercase">
                      Recado da equipa TECNATO · {formatDate(row.avaliado_em)}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{row.admin_nota}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-ink/70 sm:p-6">
        Tens dúvidas sobre o estado da tua candidatura?{' '}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-ink underline underline-offset-2"
        >
          Fala connosco por WhatsApp
        </a>
        .
      </div>
    </section>
  )
}
