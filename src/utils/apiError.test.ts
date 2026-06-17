import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './apiError'

describe('getApiErrorMessage', () => {
  it('retorna el detail string del backend', () => {
    const error = { response: { data: { detail: 'Credenciales inválidas' } } }
    expect(getApiErrorMessage(error)).toBe('Credenciales inválidas')
  })

  it('concatena errores de validación FastAPI', () => {
    const error = {
      response: {
        data: {
          detail: [{ msg: 'Campo requerido' }, { msg: 'Email inválido' }],
        },
      },
    }
    expect(getApiErrorMessage(error)).toBe('Campo requerido, Email inválido')
  })

  it('usa el mensaje de Error nativo', () => {
    expect(getApiErrorMessage(new Error('Fallo de red'))).toBe('Fallo de red')
  })

  it('retorna fallback cuando no hay detalle', () => {
    expect(getApiErrorMessage({}, 'Error genérico')).toBe('Error genérico')
  })

  it('detecta backend caído (ERR_NETWORK)', () => {
    expect(getApiErrorMessage({ code: 'ERR_NETWORK' })).toContain('No se pudo conectar con el servidor')
  })
})
