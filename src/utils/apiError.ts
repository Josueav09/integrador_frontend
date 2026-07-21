import type { AxiosError } from 'axios'

function isAxiosLikeError(
  error: unknown,
): error is { code?: string; message?: string; response?: { data?: { detail?: unknown }; status?: number } } {
  return Boolean(error && typeof error === 'object')
}

export interface ParsedApiError {
  message: string
  statusCode?: number
  details?: string[]
}

export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (isAxiosLikeError(error)) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.'
    }

    const status = error.response?.status
    if (status === 503) {
      return 'El servicio no está disponible temporalmente. Intente nuevamente en unos minutos.'
    }

    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail
        .map((item) => (typeof item === 'object' && item && 'msg' in item ? String(item.msg) : String(item)))
        .join(', ')
    }
  }

  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function parseApiError(error: unknown, fallbackMessage = 'Ha ocurrido un error inesperado.'): ParsedApiError {
  if (!error) {
    return { message: fallbackMessage }
  }

  const axiosError = error as AxiosError<unknown>
  if (axiosError.isAxiosError) {
    if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
      return {
        message: 'No se pudo conectar con el servidor. Verifique su conexión de red.',
        statusCode: undefined,
      }
    }

    const response = axiosError.response
    const statusCode = response.status

    if (statusCode === 503) {
      return {
        message: 'El servicio no está disponible temporalmente. Inténtelo más tarde.',
        statusCode,
      }
    }

    const data = response.data as { detail?: unknown; message?: string } | undefined
    if (data?.detail) {
      if (typeof data.detail === 'string') {
        return { message: data.detail, statusCode }
      }
      if (Array.isArray(data.detail)) {
        const details = data.detail.map((err: { loc?: string[]; msg?: string }) => {
          const field = err.loc ? err.loc.join('.') : ''
          const msg = err.msg || 'Valor inválido'
          return field ? `${field}: ${msg}` : msg
        })
        return {
          message: 'Error de validación en los datos enviados.',
          statusCode,
          details,
        }
      }
    }

    if (data?.message) {
      return { message: data.message, statusCode }
    }

    return {
      message: `Error del servidor (${statusCode}): ${response.statusText || fallbackMessage}`,
      statusCode,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: String(error) }
}
