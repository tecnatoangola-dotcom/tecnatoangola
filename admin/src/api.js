const ADMIN_KEY = 'tec_admin'

export function getAdmin() {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_KEY) || 'null')
  } catch {
    return null
  }
}

export function setSession(admin) {
  sessionStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function clearSession() {
  sessionStorage.removeItem(ADMIN_KEY)
}

export async function api(path, options = {}) {
  const { redirectOnUnauthorized = true, ...requestOptions } = options
  const res = await fetch(`/api${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...requestOptions.headers,
    },
    credentials: 'same-origin',
  })

  if (res.status === 401 && redirectOnUnauthorized) {
    clearSession()
    window.location.href = '/login'
    throw new Error('Sessão expirada.')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Erro ${res.status}`)
  }

  const type = res.headers.get('content-type') || ''
  if (type.includes('application/json')) return res.json()
  return res
}
