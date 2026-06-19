import { describe, it, expect } from 'vitest';
import { validateUploadFile, validateCsvHeaders } from './uploadValidation';

describe('uploadValidation - validateUploadFile', () => {
  it('debe rechazar archivos nulos', () => {
    const res = validateUploadFile(null as any);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('No se ha seleccionado');
  });

  it('debe rechazar extensiones inválidas como png o xlsx', () => {
    const file = new File([''], 'delitos.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const res = validateUploadFile(file);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Solo se permiten archivos CSV o JSON');
  });

  it('debe rechazar archivos que superen los 10MB', () => {
    const file = new File([''], 'delitos.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB
    const res = validateUploadFile(file);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('supera el límite de 10 MB');
  });

  it('debe rechazar archivos vacíos', () => {
    const file = new File([''], 'delitos.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 0 });
    const res = validateUploadFile(file);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('está vacío');
  });

  it('debe aceptar archivos CSV válidos y de tamaño correcto', () => {
    const file = new File(['id_cuadrante,id_tipo_delito'], 'delitos.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 250 });
    const res = validateUploadFile(file);
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
  });
});

describe('uploadValidation - validateCsvHeaders', () => {
  it('debe rechazar CSV con cabeceras incompletas', () => {
    const res = validateCsvHeaders('id_cuadrante,fecha_delito');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Columnas faltantes');
  });

  it('debe aceptar CSV con cabeceras válidas', () => {
    const res = validateCsvHeaders('id_cuadrante,id_tipo_delito,fecha_delito,ubicacion');
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
  });
});
