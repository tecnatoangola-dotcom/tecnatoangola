import { BUCKET, isSupabaseConfigured, supabase } from './supabase.js'

export const MAX_DURATION_SECONDS = 60 // 1 minuto
export const MAX_SIZE_MB = Number(import.meta.env.VITE_MAX_VIDEO_MB) || 30
export const FOTO_MAX_MB = 10

export const STATUS_LABELS = {
  submetida: 'Enviada',
  em_verificacao: 'Em verificação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
}

export const STATUS_STYLES = {
  submetida: 'bg-amber-100 text-amber-900',
  em_verificacao: 'bg-blue-100 text-blue-900',
  aprovada: 'bg-green-100 text-green-900',
  rejeitada: 'bg-red-100 text-red-900',
}

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return '--:--'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function makeReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint32Array(6)
  crypto.getRandomValues(bytes)
  const code = Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('')
  return `TEC-${code}`
}

export function readVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(video.duration)
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível ler este ficheiro de vídeo. Tenta com outro formato.'))
    }

    video.src = objectUrl
  })
}

function uploadWithXhr({ path, file, onProgress }) {
  const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = import.meta.env

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${url}/storage/v1/object/${BUCKET}/${path}`)
    xhr.setRequestHeader('Authorization', `Bearer ${key}`)
    xhr.setRequestHeader('apikey', key)
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
        return
      }
      reject(new Error(`O servidor recusou o envio (${xhr.status}).`))
    }

    xhr.onerror = () => reject(new Error('Falha de ligação durante o envio. Tenta novamente.'))
    xhr.send(file)
  })
}

export async function uploadFile({ file, reference, onProgress }) {
  if (!isSupabaseConfigured) {
    throw new Error('A plataforma de armazenamento ainda não está configurada.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${reference}/${Date.now()}-${safeName}`

  try {
    await uploadWithXhr({ path, file, onProgress })
  } catch (xhrError) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })

    if (error) {
      throw new Error(xhrError.message || error.message)
    }
    if (onProgress) onProgress(100)
  }

  return path
}

export async function saveCandidatura({ reference, videoPath, fotoPath, form, userId }) {
  if (!isSupabaseConfigured) return

  const { error } = await supabase.from('candidaturas').insert({
    user_id: userId ?? null,
    referencia: reference,
    equipa: form.equipa,
    projecto: form.projecto,
    municipio: form.municipio,
    area: form.area,
    whatsapp: form.whatsapp,
    email: form.email || null,
    descricao: form.descricao,
    video_path: videoPath,
    foto_path: fotoPath || null,
    status: 'submetida',
  })

  if (error) {
    console.warn('[TECNATO] candidatura guardada apenas no Storage:', error.message)
  }
}

export async function fetchCandidaturas(userId) {
  if (!isSupabaseConfigured || !userId) {
    return { rows: [], error: null }
  }

  const { data, error } = await supabase
    .from('candidaturas')
    .select(
      'referencia, equipa, projecto, municipio, area, status, created_at, admin_nota, avaliado_em',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return { rows: [], error: error.message }
  return { rows: data ?? [], error: null }
}
