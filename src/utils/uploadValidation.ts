export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateUploadFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo.' };
  }

  // Validar extensión
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'csv' && extension !== 'json') {
    return { isValid: false, error: 'Solo se permiten archivos CSV o JSON.' };
  }

  // Validar tamaño máximo: 10 MB (10 * 1024 * 1024 bytes)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'El archivo supera el límite de 10 MB.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'El archivo está vacío.' };
  }

  return { isValid: true, error: null };
}

export function validateCsvHeaders(headerLine: string): FileValidationResult {
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const required = ['id_cuadrante', 'id_tipo_delito', 'fecha_delito', 'ubicacion'];

  const missing = required.filter(field => !headers.includes(field));
  if (missing.length > 0) {
    return {
      isValid: false,
      error: `Columnas faltantes en el CSV: ${missing.join(', ')}.`
    };
  }

  return { isValid: true, error: null };
}
