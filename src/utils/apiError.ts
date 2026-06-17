export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const detail = (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
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
