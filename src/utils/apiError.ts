import type { AxiosError } from 'axios';

export interface ParsedApiError {
  message: string;
  statusCode?: number;
  details?: string[];
}

export function parseApiError(error: unknown, fallbackMessage = 'Ha ocurrido un error inesperado.'): ParsedApiError {
  if (!error) {
    return { message: fallbackMessage };
  }

  // Verificar si es un AxiosError
  const axiosError = error as AxiosError<any>;
  if (axiosError.isAxiosError) {
    // Error de Red
    if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
      return {
        message: 'No se pudo conectar con el servidor. Verifique su conexión de red.',
        statusCode: undefined
      };
    }

    const response = axiosError.response;
    const statusCode = response.status;

    // Error 503
    if (statusCode === 503) {
      return {
        message: 'El servicio no está disponible temporalmente. Inténtelo más tarde.',
        statusCode
      };
    }

    // Errores de Validación de FastAPI (detail)
    const data = response.data;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        return { message: data.detail, statusCode };
      }
      if (Array.isArray(data.detail)) {
        const details = data.detail.map((err: any) => {
          const field = err.loc ? err.loc.join('.') : '';
          const msg = err.msg || 'Valor inválido';
          return field ? `${field}: ${msg}` : msg;
        });
        return {
          message: 'Error de validación en los datos enviados.',
          statusCode,
          details
        };
      }
    }

    if (data && data.message) {
      return { message: data.message, statusCode };
    }

    return {
      message: `Error del servidor (${statusCode}): ${response.statusText || fallbackMessage}`,
      statusCode
    };
  }

  // Error estándar de JS
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: String(error) };
}
