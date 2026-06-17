import { useState, useEffect, useRef } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.csv', '.json']

function validateUploadFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
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

export function AdminPage() {
  const [pipeline, setPipeline] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rbacError, setRbacError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [retraining, setRetraining] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    setLoading(true)
    setRbacError(null)
    try {
      const [pipelineRes, historyRes, logsRes] = await Promise.all([
        apiClient.get('/admin/pipeline'),
        apiClient.get('/admin/uploads'),
        apiClient.get('/admin/logs'),
      ])

      if (pipelineRes.data?.success) {
        setPipeline(pipelineRes.data.pipeline)
        setIsRunning(pipelineRes.data.is_running)
      }
      if (historyRes.data?.success) setHistory(historyRes.data.history)
      if (logsRes.data?.success) setLogs(logsRes.data.logs)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setRbacError(
          'Acceso Denegado: Su rol no cuenta con permisos de Administrador o Investigador para gestionar esta sección.',
        )
      } else {
        console.error('Error loading admin data:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined
    if (isRunning) {
      intervalId = setInterval(async () => {
        try {
          const [pipelineRes, logsRes] = await Promise.all([
            apiClient.get('/admin/pipeline'),
            apiClient.get('/admin/logs'),
          ])
          if (pipelineRes.data?.success) {
            setPipeline(pipelineRes.data.pipeline)
            setIsRunning(pipelineRes.data.is_running)
          }
          if (logsRes.data?.success) {
            setLogs(logsRes.data.logs)
          }
        } catch (err) {
          console.error('Error polling training status:', err)
        }
      }, 2500)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning])

  const handleRetrain = async () => {
    setRetraining(true)
    try {
      const res = await apiClient.post('/admin/retrain')
      if (res.data?.success) {
        setIsRunning(true)
        setLogs((prev) => [...prev, '[REACT] Solicitud de reentrenamiento enviada...'])
      } else {
        setUploadStatus(res.data?.message || 'No se pudo iniciar el reentrenamiento.')
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setUploadStatus('Acceso Denegado: Requiere rol Administrador o Investigador.')
      } else {
        setUploadStatus(getApiErrorMessage(err, 'Error al iniciar el reentrenamiento.'))
      }
    } finally {
      setRetraining(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateUploadFile(file)
    if (validationError) {
      setUploadStatus(validationError)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setUploadStatus(`Subiendo "${file.name}"...`)
    try {
      const res = await apiClient.post('/admin/upload-csv', formData)
      if (res.data?.success) {
        setUploadStatus(`Éxito: cargado "${res.data.filename}" con ${res.data.registros} registros.`)
        await loadData()
      } else {
        setUploadStatus('Error al cargar el archivo.')
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setUploadStatus('Error: Rol no autorizado (Requiere Administrador/Investigador).')
      } else {
        setUploadStatus(getApiErrorMessage(err, 'Error al procesar el archivo.'))
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const totalRegistros = history.reduce(
    (acc, curr) => acc + parseInt(String(curr.registros).replace(/,/g, '') || '0', 10),
    0,
  )

  return (
    <>
      <PageHeader
        title="Administración del Sistema"
        subtitle="Gestión de datos y reentrenamiento del modelo"
        showUserBtn
      />
      <div className="dash-content" style={{ position: 'relative' }}>
        {rbacError ? (
          <div
            className="dash-card"
            style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '3rem' }}>🔒</span>
            <h3 style={{ color: '#991b1b', marginTop: '1rem' }}>Sección Restringida (RBAC)</h3>
            <p style={{ color: '#7f1d1d', maxWidth: '500px', margin: '0.5rem auto 0', fontSize: '0.875rem' }}>
              {rbacError}
            </p>
          </div>
        ) : (
          <>
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.4)',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                Cargando Módulo de Control...
              </div>
            )}

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <h3>Cargar Datos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".csv,.json"
                    disabled={uploading}
                  />
                  <div
                    className="dash-upload-zone"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.7 : 1 }}
                    data-testid="admin-upload-zone"
                  >
                    {uploading
                      ? 'Procesando archivo...'
                      : 'Haga clic aquí para seleccionar un archivo CSV o JSON'}
                    <br />
                    <small>Estructura: id_cuadrante, id_tipo_delito, fecha_delito, ubicacion (máx. 10 MB)</small>
                  </div>
                  {uploadStatus && (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: uploadStatus.startsWith('Éxito') ? '#059669' : '#4f46e5',
                        fontWeight: 'bold',
                        marginTop: '0.5rem',
                      }}
                      role="status"
                    >
                      {uploadStatus}
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '0.75rem' }}>
                    Los datos deben validarse antes del reentrenamiento del modelo.
                  </p>
                </div>
                <div
                  className="dash-card"
                  style={{
                    background: '#f9fafb',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    padding: '1rem',
                  }}
                >
                  <strong>Panel de Carga Rápida</strong>
                  <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>
                    Sube datos de la PNP para automatizar el cálculo de pesos y reentrenar el modelo de IA.
                  </p>
                </div>
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <h3 style={{ margin: 0 }}>Reentrenamiento del Modelo GNN</h3>
                <button
                  type="button"
                  className={`dash-btn ${isRunning ? 'dash-btn--outline' : 'dash-btn--primary'}`}
                  onClick={handleRetrain}
                  disabled={isRunning || retraining}
                  data-testid="admin-retrain-btn"
                >
                  {isRunning || retraining ? '⟳ Reentrenando...' : '▶ Iniciar Reentrenamiento'}
                </button>
              </div>
              <div className="dash-terminal" data-testid="admin-terminal-logs">
                {logs.length === 0 ? (
                  <div>Sin logs de entrenamiento todavía.</div>
                ) : (
                  logs.map((line, idx) => <div key={idx}>{line}</div>)
                )}
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <h3>Estado del Pipeline</h3>
              <div className="dash-pipeline" data-testid="admin-pipeline-steps">
                {pipeline.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pipeline no disponible.</p>
                ) : (
                  pipeline.map((step) => (
                    <div key={step.name} className={`dash-pipeline__step ${step.done ? 'done' : ''}`}>
                      <div style={{ fontSize: '1.25rem' }}>{step.done ? '✓' : '○'}</div>
                      <strong>{step.name}</strong>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{step.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <h3>Historial de Cargas</h3>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Archivo</th>
                    <th>Registros</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
                        No hay cargas registradas.
                      </td>
                    </tr>
                  ) : (
                    history.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.fecha}</td>
                        <td>{row.archivo}</td>
                        <td>{row.registros}</td>
                        <td>
                          <span
                            className={`dash-badge dash-badge--${row.estado === 'Exitoso' ? 'exitoso' : 'advertencia'}`}
                          >
                            {row.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="dash-ai-banner">
              <h4>Información del Sistema</h4>
              <div className="dash-ai-banner__stats">
                <div>
                  <span>Total Registros</span>
                  <strong>{totalRegistros.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Último Proceso</span>
                  <strong>{history[0]?.fecha ?? '—'}</strong>
                </div>
                <div>
                  <span>Cargas exitosas</span>
                  <strong>{history.filter((h) => h.estado === 'Exitoso').length}</strong>
                </div>
                <div>
                  <span>Versión</span>
                  <strong>v1.2</strong>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
