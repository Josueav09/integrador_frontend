import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiClient } from '../api/client'
import {
  AUTH_STORAGE_KEY,
  readStoredSession,
  type AuthUser,
  type SessionData,
} from '../api/session'
import { getApiErrorMessage } from '../utils/apiError'

export type { AuthUser, SessionData }

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  rolId: number | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredSession()?.user ?? null)

  const login = useCallback(async (email: string, password: string) => {
    if (!password.trim()) {
      throw new Error('La contraseña es obligatoria')
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password,
      })

      const displayName = email.trim().split('@')[0]
      const sessionData: SessionData = {
        access_token: response.data.access_token,
        user: {
          email: email.trim(),
          name: displayName,
          rol_id: response.data.rol_id,
        },
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData))
      setUser(sessionData.user)
    } catch (error: unknown) {
      console.error('Error de autenticación:', error)
      throw new Error(getApiErrorMessage(error, 'Credenciales inválidas'))
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(readStoredSession()?.access_token && user)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      rolId: user?.rol_id ?? null,
      login,
      logout,
    }),
    [user, isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
