import { isSupabaseConfigured, supabase } from './supabase.js'

function getVisitorId() {
  try {
    let id = localStorage.getItem('tec_visitor')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('tec_visitor', id)
    }
    return id
  } catch {
    return 'sem-id'
  }
}

export const visitorId = getVisitorId()

export function track(tipo, detalhe = '') {
  if (!isSupabaseConfigured) return
  supabase.from('eventos').insert({ visitor_id: visitorId, tipo, detalhe }).then(() => {})
}

export function trackOnce(tipo, detalhe = '') {
  try {
    const key = `tec_${tipo}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch {
    /* sem sessão */
  }
  track(tipo, detalhe)
}
