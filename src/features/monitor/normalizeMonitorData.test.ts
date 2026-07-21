import { describe, expect, it } from 'vitest'
import { normalizeMonitorData } from './normalizeMonitorData'

describe('normalizeMonitorData', () => {
  it('usa valores por defecto cuando la respuesta es inválida', () => {
    const result = normalizeMonitorData(null)

    expect(result).toEqual({
      version: 'v1.2',
      precision: '94.2%',
      registros: 45320,
      nodos: 1247,
      aristas: 3821,
      logs: [],
    })
  })

  it('normaliza precisión, métricas numéricas y filtra logs inválidos', () => {
    const result = normalizeMonitorData({
      version: 'v2.0',
      precision: 95.8,
      registros: '50000',
      nodos: '1300',
      aristas: 4100,
      logs: [
        { type: 'info', time: '10:01', msg: 'Entrenamiento iniciado' },
        { type: 'warning', time: '10:05', msg: '' },
        'invalid',
        { type: 'error', time: '10:10', msg: 'Gradiente inestable' },
      ],
    })

    expect(result).toEqual({
      version: 'v2.0',
      precision: '95.8%',
      registros: 50000,
      nodos: 1300,
      aristas: 4100,
      logs: [
        { type: 'info', time: '10:01', msg: 'Entrenamiento iniciado' },
        { type: 'error', time: '10:10', msg: 'Gradiente inestable' },
      ],
    })
  })
})

