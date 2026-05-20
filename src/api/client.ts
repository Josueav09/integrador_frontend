import axios from 'axios'

// La URL base del backend FastAPI. Usa la variable de entorno o localhost por defecto.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Instancia global de Axios pre-configurada
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Clave donde guardaremos el JWT y los datos del usuario
export const AUTH_STORAGE_KEY = 'gnn_crime_ai_session'

// Interceptor de Peticiones: Adjuntar el Token JWT
apiClient.interceptors.request.use(
  (config) => {
    try {
      const rawSession = localStorage.getItem(AUTH_STORAGE_KEY)
      if (rawSession) {
        const sessionData = JSON.parse(rawSession)
        // Si existe un token JWT en el storage, inyectarlo como Bearer Token
        if (sessionData && sessionData.access_token) {
          config.headers.Authorization = `Bearer ${sessionData.access_token}`
        }
      }
    } catch (error) {
      console.error('Error inyectando token JWT', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de Respuestas: Manejar caducidad del token (HTTP 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expira o es inválido, limpiamos la sesión para obligar re-login
      console.warn("Sesión expirada o token inválido (401).")
      localStorage.removeItem(AUTH_STORAGE_KEY)
      // Opcional: Redirigir al login si ocurre un 401
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
