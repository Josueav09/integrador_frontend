import { describe, it, expect } from 'vitest';
import { parseApiError } from './apiError';

describe('apiError - parseApiError', () => {
  it('debe retornar mensaje de error estándar si el error es nulo o indefinido', () => {
    const res = parseApiError(null, 'Error genérico');
    expect(res.message).toBe('Error genérico');
  });

  it('debe retornar mensaje de error de red cuando el código es ERR_NETWORK', () => {
    const networkError = {
      isAxiosError: true,
      code: 'ERR_NETWORK',
    };
    const res = parseApiError(networkError);
    expect(res.message).toContain('No se pudo conectar con el servidor');
  });

  it('debe traducir error HTTP 503 correctamente', () => {
    const serviceUnavailableError = {
      isAxiosError: true,
      response: {
        status: 503,
        statusText: 'Service Unavailable',
        data: {}
      }
    };
    const res = parseApiError(serviceUnavailableError);
    expect(res.message).toContain('servicio no está disponible temporalmente');
    expect(res.statusCode).toBe(503);
  });

  it('debe parsear string de FastAPI detail', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { detail: 'El recurso solicitado no existe.' }
      }
    };
    const res = parseApiError(error);
    expect(res.message).toBe('El recurso solicitado no existe.');
  });
});
