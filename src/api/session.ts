export const AUTH_STORAGE_KEY = 'gnn_crime_ai_session'

export type AuthUser = {
  email: string
  name: string
  rol_id?: number
}

export type SessionData = {
  access_token: string
  user: AuthUser
}

export function readStoredSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionData
    if (parsed?.access_token && parsed?.user?.email) return parsed
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
  return null
}
