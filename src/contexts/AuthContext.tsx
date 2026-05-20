import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiClient, AUTH_STORAGE_KEY } from '../api/client'

export type AuthUser = {
  email: string
  name: string
}

export type SessionData = {
  access_token: string
  user: AuthUser
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionData
    if (parsed?.user?.email) return parsed.user
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const login = useCallback(async (email: string, password?: string) => {
    try {
      // Petición real al backend de FastAPI
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password: password || '123456' // Fallback for mockup if needed
      })
      
      // El backend devuelve: { access_token, token_type, rol_id }
      // Construimos el SessionData para el frontend
      const sessionData: SessionData = {
        access_token: response.data.access_token,
        user: {
          email: email.trim(),
          name: email.trim().split('@')[0]
        }
      }
      
      // Guardamos el payload completo (incluyendo el token) en localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData))
      
      // Actualizamos el estado con la info del usuario para que isAuthenticated sea true
      setUser(sessionData.user)
    } catch (error: any) {
      console.error('Error de autenticación:', error.response?.data || error.message)
      throw new Error(error.response?.data?.detail || 'Credenciales inválidas')
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
