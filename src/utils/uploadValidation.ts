export const REQUIRED_UPLOAD_FIELDS = [
  'id_cuadrante',
  'id_tipo_delito',
  'fecha_delito',
  'ubicacion',
] as const

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const ALLOWED_EXTENSIONS = ['.csv', '.json'] as const

export function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.slice(dot).toLowerCase() : ''
}

export function validateUploadFileMeta(file: File): string | null {
  const ext = getFileExtension(file.name)
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return 'Solo se permiten archivos CSV o JSON.'
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'El archivo supera el límite de 10 MB.'
  }
  if (file.size === 0) {
    return 'El archivo está vacío.'
  }
  return null
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/^"|"$/g, '')
}

export function validateCsvContent(text: string): string | null {
  const lines = text.trim().split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length < 2) {
    return 'El CSV debe incluir cabecera y al menos una fila de datos.'
  }

  const headers = lines[0].split(',').map(normalizeHeader)
  const missing = REQUIRED_UPLOAD_FIELDS.filter((col) => !headers.includes(col))
  if (missing.length > 0) {
    return `Formato CSV inválido. Faltan columnas: ${missing.join(', ')}.`
  }

  return null
}

export function validateJsonContent(text: string): string | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return 'El archivo JSON no tiene un formato válido.'
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return 'El JSON debe ser un arreglo con al menos un registro.'
  }

  const first = parsed[0]
  if (!first || typeof first !== 'object') {
    return 'Cada registro del JSON debe ser un objeto.'
  }

  const missing = REQUIRED_UPLOAD_FIELDS.filter((col) => !(col in (first as Record<string, unknown>)))
  if (missing.length > 0) {
    return `Formato JSON inválido. Faltan campos: ${missing.join(', ')}.`
  }

  return null
}

export async function validateUploadFileContent(file: File): Promise<string | null> {
  const metaError = validateUploadFileMeta(file)
  if (metaError) return metaError

  const text = await file.text()
  const ext = getFileExtension(file.name)
  if (ext === '.csv') return validateCsvContent(text)
  return validateJsonContent(text)
}
