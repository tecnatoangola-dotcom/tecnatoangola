import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants.js'
import { useAuth } from '../lib/authContext.js'
import {
  FOTO_MAX_MB,
  MAX_DURATION_SECONDS,
  MAX_SIZE_MB,
  formatDuration,
  makeReference,
  readVideoDuration,
  saveCandidatura,
  uploadFile,
} from '../lib/candidaturas.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { track } from '../lib/track.js'

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

const AREAS = [
  'Gestão e Administração',
  'Ciência e Investigação',
  'Tecnologia e Inovação',
  'Empreendedorismo e Negócios',
  'Impacto Social e Comunitário',
  'Invenções e Criações Próprias',
  'Outra área',
]

const EMPTY_FORM = {
  equipa: '',
  projecto: '',
  municipio: '',
  area: '',
  whatsapp: '',
  email: '',
  descricao: '',
  consent: false,
}

const FIELD_CLASS =
  'w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none'

const LABEL_CLASS = 'mb-1.5 block text-sm font-semibold text-ink/80'

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ChannelChoice({ value, onChange }) {
  const options = [
    {
      id: 'plataforma',
      title: 'Enviar na plataforma',
      text: 'O vídeo fica guardado na nossa nuvem e acompanhas o estado no teu perfil.',
    },
    {
      id: 'whatsapp',
      title: 'Enviar por WhatsApp',
      text: 'Preferes falar? Envias o vídeo directamente na nossa conversa.',
    },
  ]

  return (
    <div className="mt-8">
      <p className={LABEL_CLASS}>Como queres enviar o vídeo? *</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                active ? 'border-ink bg-white' : 'border-line bg-white/60 hover:border-ink/40'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? 'border-ink' : 'border-line'
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                </span>
                <span className="text-sm font-semibold">{option.title}</span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-ink/65">{option.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CandidaturaPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [video, setVideo] = useState(null)
  const [videoDuration, setVideoDuration] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [uploadTarget, setUploadTarget] = useState('video')
  const [submitError, setSubmitError] = useState('')
  const [reference, setReference] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const photoInputRef = useRef(null)

  const busy = phase === 'validating' || phase === 'uploading' || phase === 'saving'

  const phaseLabel = useMemo(() => {
    if (phase === 'validating') return 'A validar o vídeo…'
    if (phase === 'uploading')
      return uploadTarget === 'foto'
        ? `A enviar a foto da equipa… ${progress}%`
        : `A enviar o vídeo para a nuvem… ${progress}%`
    if (phase === 'saving') return 'A concluir a candidatura…'
    return ''
  }, [phase, progress, uploadTarget])

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleFile(file) {
    setSubmitError('')
    setErrors((current) => ({ ...current, video: undefined }))

    if (!file) {
      setVideo(null)
      setVideoDuration(null)
      return
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setVideo(null)
      setVideoDuration(null)
      setErrors((current) => ({
        ...current,
        video: `O vídeo tem ${formatSize(file.size)}. O limite é ${MAX_SIZE_MB} MB.`,
      }))
      return
    }

    try {
      const duration = await readVideoDuration(file)
      if (duration > MAX_DURATION_SECONDS) {
        setVideo(null)
        setVideoDuration(null)
        setErrors((current) => ({
          ...current,
          video: `O vídeo tem ${formatDuration(duration)}. O limite é ${formatDuration(MAX_DURATION_SECONDS)}.`,
        }))
        return
      }
      setVideo(file)
      setVideoDuration(duration)
      setErrors((current) => ({ ...current, video: undefined }))
    } catch (error) {
      setErrors((current) => ({ ...current, video: error.message }))
    }
  }

  async function handlePhoto(file) {
    setSubmitError('')
    setErrors((current) => ({ ...current, photo: undefined }))

    if (!file) {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
      setPhoto(null)
      setPhotoUrl('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setPhoto(null)
      setPhotoUrl('')
      setErrors((current) => ({ ...current, photo: 'O ficheiro tem de ser uma imagem (JPG, PNG ou WebP).' }))
      return
    }

    if (file.size > FOTO_MAX_MB * 1024 * 1024) {
      setPhoto(null)
      setPhotoUrl('')
      setErrors((current) => ({
        ...current,
        photo: `A foto tem ${formatSize(file.size)}. O limite é ${FOTO_MAX_MB} MB.`,
      }))
      return
    }

    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhoto(file)
    setPhotoUrl(URL.createObjectURL(file))
  }

  function validate() {
    const next = {}

    if (form.equipa.trim().length < 2) next.equipa = 'Indica o nome da equipa.'
    if (form.projecto.trim().length < 2) next.projecto = 'Indica o nome do projecto.'
    if (!form.municipio) next.municipio = 'Escolhe o município que representas.'
    if (!form.area) next.area = 'Escolhe a área do projecto.'
    if (form.whatsapp.replace(/\D/g, '').length < 9) next.whatsapp = 'Indica um WhatsApp válido.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email inválido.'
    if (form.descricao.trim().length < 40)
      next.descricao = 'Descreve o projecto com pelo menos 40 caracteres.'
    if (!video) next.video = `Selecciona o vídeo da candidatura (até ${formatDuration(MAX_DURATION_SECONDS)}).`
    if (!photo) next.photo = 'Adiciona uma foto da equipa (obrigatória).'
    if (!form.consent) next.consent = 'É preciso autorizar o tratamento dos dados.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const ref = makeReference()

    try {
      setPhase('validating')
      setUploadTarget('video')
      const videoPath = await uploadFile({
        file: video,
        reference: ref,
        onProgress: (value) => {
          setPhase('uploading')
          setUploadTarget('video')
          setProgress(value)
        },
      })

      setUploadTarget('foto')
      const fotoPath = await uploadFile({
        file: photo,
        reference: ref,
        onProgress: (value) => {
          setPhase('uploading')
          setUploadTarget('foto')
          setProgress(value)
        },
      })

      setPhase('saving')
      await saveCandidatura({
        reference: ref,
        videoPath,
        fotoPath,
        form,
        userId: user?.id,
      })

      setReference(ref)
      setPhase('done')
      track('candidatura_plataforma', form.municipio)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setPhase('idle')
      setProgress(0)
      setSubmitError(error.message || 'O envio falhou. Tenta novamente.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function reset() {
    setChannel(null)
    setForm(EMPTY_FORM)
    setVideo(null)
    setVideoDuration(null)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhoto(null)
    setPhotoUrl('')
    setErrors({})
    setPhase('idle')
    setProgress(0)
    setUploadTarget('video')
    setSubmitError('')
    setReference('')
    setCopied(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponível */
    }
  }

  if (phase === 'done') {
    return (
      <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-24">
        <div
          role="status"
          className="rounded-2xl border border-green-300 bg-green-50 p-6 text-center sm:p-8"
        >
          <p className="flex items-center justify-center gap-2 text-lg font-semibold text-green-900">
            <span aria-hidden="true">✓</span> Envio bem-sucedido!
          </p>
          <p className="mt-2 text-sm leading-relaxed text-green-900/80">
            O vídeo e a foto da equipa foram guardados na nossa nuvem em segurança. A equipa do
            TECNATO vai analisar a candidatura.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-6 text-center">
          <p className="text-xs tracking-widest text-ink/50 uppercase">Referência</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-widest">{reference}</p>
          <p className="mt-2 text-sm text-ink/60">Estado actual: em verificação</p>
          <button
            type="button"
            onClick={copyReference}
            className="mt-4 min-h-11 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
          >
            {copied ? 'Copiado ✓' : 'Copiar referência'}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {user && (
            <Link
              to="/perfil"
              className="flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
            >
              Ver a minha candidatura no perfil
            </Link>
          )}
          <Link
            to="/"
            className={`flex min-h-12 items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold ${
              user ? 'border border-ink/25' : 'bg-ink text-white'
            }`}
          >
            Voltar ao início
          </Link>
          <button
            type="button"
            onClick={reset}
            className="flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold"
          >
            Enviar outra candidatura
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <Link to="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Início
      </Link>

      <p className="section-label mt-6 text-brand-deep">Candidatura · Vídeo</p>
      <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-5xl">
        Apresenta a tua equipa e o teu projecto.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink/70">
        O <strong>TECNATO</strong> é uma plataforma de identificação, valorização e visibilidade
        de talentos, projectos e iniciativas nas áreas da Gestão, Administração, Ciência,
        Inovação, Empreendedorismo, Tecnologia e outras áreas do conhecimento e da criatividade
        humana.
      </p>
      <p className="mt-3 text-base leading-relaxed text-ink/70">
        Escolhe como queres enviar o <strong>vídeo</strong> (até {MAX_DURATION_SECONDS / 60} min) e
        a <strong>foto da equipa</strong> — os dois são obrigatórios. Na plataforma, os ficheiros
        ficam guardados na nossa nuvem e recebes um código de referência no fim.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Vídeo', `Até ${MAX_DURATION_SECONDS / 60} min`],
          ['Vídeo (tamanho)', `Até ${MAX_SIZE_MB} MB`],
          ['Foto da equipa', `Até ${FOTO_MAX_MB} MB`],
          ['Formatos', 'Vídeo + JPG, PNG'],
        ].map(([label, value]) => (
          <li key={label} className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-xs tracking-wider text-ink/50 uppercase">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
          </li>
        ))}
      </ul>

      <ChannelChoice
        value={channel}
        onChange={(value) => {
          setChannel(value)
          if (value === 'whatsapp') track('candidatura_whatsapp')
        }}
      />

      {submitError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-800"
        >
          {submitError}
        </div>
      )}

      {channel === 'whatsapp' && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Enviar por WhatsApp</h2>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-ink/70">
            <li>1. Abre a nossa conversa no WhatsApp.</li>
            <li>
              2. Envia o vídeo (até {MAX_DURATION_SECONDS / 60} min) <strong>e a foto da equipa</strong>{' '}
              com a mensagem inicial.
            </li>
            <li>3. A equipa do TECNATO confirma a recepção e indica os próximos passos.</li>
          </ol>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white"
          >
            Abrir conversa no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setChannel('plataforma')}
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold"
          >
            Prefiro enviar na plataforma
          </button>
        </div>
      )}

      {channel === 'plataforma' && !user && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed text-ink/70 sm:p-5">
          Não precisas de conta para enviar — mas sem conta não consegues acompanhar o estado da
          candidatura.{' '}
          <Link to="/registar" className="font-semibold text-ink underline underline-offset-2">
            Cria conta
          </Link>{' '}
          ou{' '}
          <Link to="/entrar" className="font-semibold text-ink underline underline-offset-2">
            entra
          </Link>{' '}
          para ficares a acompanhar a verificação e a aprovação no teu perfil.
        </div>
      )}

      {channel === 'plataforma' && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className={LABEL_CLASS} htmlFor="equipa">
                Nome da equipa *
              </label>
              <input
                id="equipa"
                className={FIELD_CLASS}
                value={form.equipa}
                onChange={(event) => setValue('equipa', event.target.value)}
                placeholder="Ex.: Equipa KixiCasa"
                autoComplete="organization"
              />
              {errors.equipa && <p className="mt-1.5 text-xs text-red-600">{errors.equipa}</p>}
            </div>

            <div className="sm:col-span-1">
              <label className={LABEL_CLASS} htmlFor="projecto">
                Nome do projecto *
              </label>
              <input
                id="projecto"
                className={FIELD_CLASS}
                value={form.projecto}
                onChange={(event) => setValue('projecto', event.target.value)}
                placeholder="Ex.: KixiCasa"
              />
              {errors.projecto && <p className="mt-1.5 text-xs text-red-600">{errors.projecto}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="municipio">
                Município de Luanda *
              </label>
              <select
                id="municipio"
                className={FIELD_CLASS}
                value={form.municipio}
                onChange={(event) => setValue('municipio', event.target.value)}
              >
                <option value="">Selecciona o município</option>
                {MUNICIPIOS.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
              {errors.municipio && <p className="mt-1.5 text-xs text-red-600">{errors.municipio}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="area">
                Área do projecto *
              </label>
              <select
                id="area"
                className={FIELD_CLASS}
                value={form.area}
                onChange={(event) => setValue('area', event.target.value)}
              >
                <option value="">Selecciona a área</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.area && <p className="mt-1.5 text-xs text-red-600">{errors.area}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="whatsapp">
                WhatsApp *
              </label>
              <input
                id="whatsapp"
                type="tel"
                inputMode="tel"
                className={FIELD_CLASS}
                value={form.whatsapp}
                onChange={(event) => setValue('whatsapp', event.target.value)}
                placeholder="+244 900 000 000"
                autoComplete="tel"
              />
              {errors.whatsapp && <p className="mt-1.5 text-xs text-red-600">{errors.whatsapp}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="email">
                Email (opcional)
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                className={FIELD_CLASS}
                value={form.email}
                onChange={(event) => setValue('email', event.target.value)}
                placeholder="equipa@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL_CLASS} htmlFor="descricao">
                O que o projecto pretende fazer? *
              </label>
              <textarea
                id="descricao"
                rows={5}
                maxLength={800}
                className={`${FIELD_CLASS} resize-y`}
                value={form.descricao}
                onChange={(event) => setValue('descricao', event.target.value)}
                placeholder="Explica o problema que procuras resolver, a solução proposta e o impacto que queres gerar."
              />
              <div className="mt-1.5 flex items-baseline justify-between gap-3">
                {errors.descricao ? (
                  <p className="text-xs text-red-600">{errors.descricao}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-ink/40">{form.descricao.length}/800</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <span className={LABEL_CLASS}>Vídeo da candidatura *</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-paper px-4 py-6 text-center transition-colors hover:border-ink/40"
              >
                <span className="text-sm font-semibold">
                  {video ? 'Trocar vídeo' : 'Toque para escolher o vídeo'}
                </span>
                <span className="text-xs text-ink/50">
                  MP4, MOV ou WebM · até {MAX_DURATION_SECONDS / 60} min · {MAX_SIZE_MB} MB
                </span>
              </button>

              {video && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{video.name}</p>
                    <p className="text-xs text-ink/55">
                      {formatSize(video.size)} · {formatDuration(videoDuration)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Pronto ✓
                  </span>
                </div>
              )}

              {errors.video && <p className="mt-1.5 text-xs text-red-600">{errors.video}</p>}
            </div>

            <div className="sm:col-span-2">
              <span className={LABEL_CLASS}>Foto da equipa *</span>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => handlePhoto(event.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-paper px-4 py-6 text-center transition-colors hover:border-ink/40"
              >
                <span className="text-sm font-semibold">
                  {photo ? 'Trocar foto' : 'Toque para escolher a foto da equipa'}
                </span>
                <span className="text-xs text-ink/50">JPG, PNG ou WebP · até {FOTO_MAX_MB} MB</span>
              </button>

              {photo && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                  <img
                    src={photoUrl}
                    alt="Pré-visualização da foto da equipa"
                    className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{photo.name}</p>
                    <p className="text-xs text-ink/55">{formatSize(photo.size)}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Pronto ✓
                  </span>
                </div>
              )}

              {errors.photo && <p className="mt-1.5 text-xs text-red-600">{errors.photo}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed text-ink/70">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setValue('consent', event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
                />
                Autorizo a organização do TECNATO a tratar os meus dados e o vídeo para efeitos de
                candidatura e divulgação da plataforma. *
              </label>
              {errors.consent && <p className="mt-1.5 text-xs text-red-600">{errors.consent}</p>}
            </div>
          </div>

          {busy && (
            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-300"
                  style={{ width: `${phase === 'validating' ? 8 : progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-ink/60">{phaseLabel}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !isSupabaseConfigured}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'A enviar…' : 'Enviar candidatura'}
          </button>

          <p className="mt-3 text-xs leading-relaxed text-ink/50">
            Ao enviar, fica associada à tua conta para acompanhares o estado no{' '}
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="font-semibold text-ink underline underline-offset-2"
            >
              perfil
            </button>
            . O envio não significa selecção automática.
          </p>
        </form>
      )}

      {channel === null && (
        <p className="mt-6 text-sm text-ink/55">
          Escolhe acima como queres enviar o vídeo para continuares.
        </p>
      )}
    </section>
  )
}
