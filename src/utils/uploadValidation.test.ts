import { describe, expect, it } from 'vitest'
import {
  validateCsvContent,
  validateJsonContent,
  validateUploadFileMeta,
} from './uploadValidation'

function makeFile(name: string, content: string, type = 'text/plain'): File {
  return new File([content], name, { type })
}

describe('validateUploadFileMeta', () => {
  it('rechaza extensiones no permitidas', () => {
    const file = makeFile('datos.xlsx', 'contenido')
    expect(validateUploadFileMeta(file)).toBe('Solo se permiten archivos CSV o JSON.')
  })

  it('rechaza archivos vacíos', () => {
    const file = makeFile('datos.csv', '')
    expect(validateUploadFileMeta(file)).toBe('El archivo está vacío.')
  })

  it('acepta metadatos válidos', () => {
    const file = makeFile('datos.csv', 'a')
    expect(validateUploadFileMeta(file)).toBeNull()
  })
})

describe('validateCsvContent', () => {
  const header = 'id_cuadrante,id_tipo_delito,fecha_delito,ubicacion'

  it('rechaza CSV sin filas de datos', () => {
    expect(validateCsvContent(header)).toContain('al menos una fila')
  })

  it('rechaza columnas faltantes', () => {
    const csv = 'id_cuadrante,fecha_delito\n1,2024-01-01'
    expect(validateCsvContent(csv)).toContain('Faltan columnas')
  })

  it('acepta CSV con estructura correcta', () => {
    const csv = `${header}\n101,2,2024-01-01,POINT(-77.03 -12.05)`
    expect(validateCsvContent(csv)).toBeNull()
  })
})

describe('validateJsonContent', () => {
  it('rechaza JSON mal formado', () => {
    expect(validateJsonContent('{invalid')).toContain('formato válido')
  })

  it('rechaza arreglo vacío', () => {
    expect(validateJsonContent('[]')).toContain('al menos un registro')
  })

  it('rechaza campos faltantes', () => {
    const json = JSON.stringify([{ id_cuadrante: 1 }])
    expect(validateJsonContent(json)).toContain('Faltan campos')
  })

  it('acepta JSON válido', () => {
    const json = JSON.stringify([
      {
        id_cuadrante: 1,
        id_tipo_delito: 2,
        fecha_delito: '2024-01-01',
        ubicacion: 'POINT(-77.03 -12.05)',
      },
    ])
    expect(validateJsonContent(json)).toBeNull()
  })
})
