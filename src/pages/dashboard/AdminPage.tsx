import { useState, useEffect, useRef } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { apiClient } from '../../api/client'
import { useNotification } from '../../contexts/NotificationContext'
import { validateUploadFile, validateCsvHeaders } from '../../utils/uploadValidation'

export function AdminPage() {
  const { notifySuccess, notifyError, notifyApiError } = useNotification()

  const [pipeline, setPipeline] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rbacError, setRbacError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar todos los datos
  const loadData = async () => {
    setLoading(true)
    setRbacError(null)
    try {
      const [pipelineRes, historyRes, logsRes] = await Promise.all([
        apiClient.get('/admin/pipeline'),
        apiClient.get('/admin/uploads'),
        apiClient.get('/admin/logs')
      ])
      
      if (pipelineRes.data?.success) {
        setPipeline(pipelineRes.data.pipeline)
        setIsRunning(pipelineRes.data.is_running)
      }
      if (historyRes.data?.success) setHistory(historyRes.data.history)
      if (logsRes.data?.success) setLogs(logsRes.data.logs)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setRbacError("Acceso Denegado: Su rol no cuenta con permisos de Administrador o Investigador para gestionar esta sección.")
      } else {
        console.error("Error loading admin data:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Refrescar logs y pipeline periódicamente mientras el reentrenamiento esté activo
  useEffect(() => {
    let intervalId: any
    if (isRunning) {
      intervalId = setInterval(async () => {
        try {
          const [pipelineRes, logsRes] = await Promise.all([
            apiClient.get('/admin/pipeline'),
            apiClient.get('/admin/logs')
          ])
          if (pipelineRes.data?.success) {
            setPipeline(pipelineRes.data.pipeline)
            setIsRunning(pipelineRes.data.is_running)
          }
          if (logsRes.data?.success) {
            setLogs(logsRes.data.logs)
          }
        } catch (err) {
          console.error("Error polling training status:", err)
        }
      }, 2500)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning])

  // Disparar reentrenamiento
  const handleRetrain = async () => {
    try {
      const res = await apiClient.post('/admin/retrain')
      if (res.data?.success) {
        setIsRunning(true)
        setLogs(prev => [...prev, "[REACT] Solicitud de reentrenamiento enviada..."])
        notifySuccess("Reentrenamiento de GNN iniciado correctamente.")
      } else {
        notifyError(res.data?.message || "No se pudo iniciar el reentrenamiento.")
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        notifyError("Acceso Denegado: Requiere rol Administrador o Investigador.")
      } else {
        notifyApiError(err, "Error al iniciar el reentrenamiento.")
      }
    }
  }

  const uploadFileToServer = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    setUploadStatus("Subiendo archivo...")
    try {
      const res = await apiClient.post('/admin/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data?.success) {
        const successMsg = `Éxito: cargado "${res.data.filename}" con ${res.data.registros} registros.`
        setUploadStatus(successMsg)
        notifySuccess(successMsg)
        loadData()
      } else {
        const errMsg = "Error al cargar el archivo en el servidor."
        setUploadStatus(errMsg)
        notifyError(errMsg)
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        const rbacMsg = "Error: Rol no autorizado (Requiere Administrador/Investigador)."
        setUploadStatus(rbacMsg)
        notifyError(rbacMsg)
      } else {
        const procMsg = "Error al procesar el archivo en el backend."
        setUploadStatus(procMsg)
        notifyApiError(err, procMsg)
      }
    }
  }

  // Carga de archivos CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validación local del archivo antes del envío (APF3)
    const validation = validateUploadFile(file)
    if (!validation.isValid) {
      notifyError(validation.error || "Archivo no válido")
      setUploadStatus(validation.error)
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension === 'csv') {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const text = event.target?.result as string
        const firstLine = text.split('\n')[0] || ''
        const headerValidation = validateCsvHeaders(firstLine)
        if (!headerValidation.isValid) {
          notifyError(headerValidation.error || "Cabeceras de CSV incorrectas")
          setUploadStatus(headerValidation.error)
          return
        }
        await uploadFileToServer(file)
      }
      reader.readAsText(file.slice(0, 1024))
    } else {
      await uploadFileToServer(file)
    }
  }

  return (
    <>
      <PageHeader
        title="Administración del Sistema"
        subtitle="Gestión de datos y reentrenamiento del modelo"
        showUserBtn
      />
      <div className="dash-content" style={{ position: 'relative' }}>
        {rbacError ? (
          <div className="dash-card" style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🔒</span>
            <h3 style={{ color: '#991b1b', marginTop: '1rem' }}>Sección Restringida (RBAC)</h3>
            <p style={{ color: '#7f1d1d', maxWidth: '500px', margin: '0.5rem auto 0', fontSize: '0.875rem' }}>
              {rbacError}
            </p>
          </div>
        ) : (
          <>
            {loading && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
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
                    data-testid="admin-file-input"
                  />
                  <div 
                    className="dash-upload-zone" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                    data-testid="admin-upload-zone"
                  >
                    Haga clic aquí para seleccionar un archivo CSV o JSON
                    <br />
                    <small>Estructura: id_cuadrante, id_tipo_delito, fecha_delito, ubicacion</small>
                  </div>
                  {uploadStatus && (
                    <p style={{ fontSize: '0.8125rem', color: '#4f46e5', fontWeight: 'bold', marginTop: '0.5rem' }}>
                      {uploadStatus}
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '0.75rem' }}>
                    Los datos deben validarse antes del reentrenamiento del modelo.
                  </p>
                </div>
                <div className="dash-card" style={{ background: '#f9fafb', minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '1rem' }}>
                  <strong>Panel de Carga Rápida</strong>
                  <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>
                    Sube datos de la PNP para automatizar el cálculo de pesos y reentrenar el modelo de IA.
                  </p>
                </div>
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Reentrenamiento del Modelo GNN</h3>
                <button 
                  type="button" 
                  className={`dash-btn ${isRunning ? 'dash-btn--outline' : 'dash-btn--primary'}`}
                  onClick={handleRetrain}
                  disabled={isRunning}
                  data-testid="admin-retrain-btn"
                >
                  {isRunning ? '⟳ Reentrenando...' : '▶ Iniciar Reentrenamiento'}
                </button>
              </div>
              <div className="dash-terminal" data-testid="admin-terminal-logs">
                {logs.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <h3>Estado del Pipeline</h3>
              <div className="dash-pipeline" data-testid="admin-pipeline-steps">
                {pipeline.map((step) => (
                  <div key={step.name} className={`dash-pipeline__step ${step.done ? 'done' : ''}`}>
                    <div style={{ fontSize: '1.25rem' }}>{step.done ? '✓' : '○'}</div>
                    <strong>{step.name}</strong>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{step.time}</p>
                  </div>
                ))}
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
                  {history.map((row, idx) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dash-ai-banner">
              <h4>Información del Sistema</h4>
              <div className="dash-ai-banner__stats">
                <div><span>Total Registros</span><strong>{history.reduce((acc, curr) => acc + parseInt(curr.registros.replace(/,/g, '') || '0'), 45320).toLocaleString()}</strong></div>
                <div><span>Último Proceso</span><strong>Hace poco</strong></div>
                <div><span>Calidad Datos</span><strong>98.7%</strong></div>
                <div><span>Versión</span><strong>v1.2</strong></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
