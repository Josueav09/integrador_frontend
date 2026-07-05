import axios from 'axios'
import { AUTH_STORAGE_KEY } from './session'

export { AUTH_STORAGE_KEY }

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-code', '/auth/reset-password']

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    try {
      const rawSession = localStorage.getItem(AUTH_STORAGE_KEY)
      if (rawSession) {
        const sessionData = JSON.parse(rawSession)
        if (sessionData?.access_token) {
          config.headers.Authorization = `Bearer ${sessionData.access_token}`
        }
      }
    } catch (error) {
      console.error('Error inyectando token JWT', error)
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl: string = error.config?.url ?? ''
    const isAuthRequest = AUTH_PATHS.some((path) => requestUrl.includes(path))

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      const onLogin = window.location.pathname.startsWith('/login')
      if (!onLogin) {
        window.location.href = '/login?session=expired'
      }
    }
    return Promise.reject(error)
  },
)
