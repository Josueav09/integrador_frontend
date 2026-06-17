function isAxiosLikeError(
  error: unknown,
): error is { code?: string; message?: string; response?: { data?: { detail?: unknown }; status?: number } } {
  return Boolean(error && typeof error === 'object')
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
