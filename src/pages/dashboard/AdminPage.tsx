import { PageHeader } from '../../components/dashboard/PageHeader'
import { PIPELINE_STEPS, RETRAIN_LOGS, UPLOAD_HISTORY } from '../../data/mockData'

export function AdminPage() {
  return (
    <>
      <PageHeader
        title="Administración del Sistema"
        subtitle="Gestión de datos y reentrenamiento del modelo"
        showUserBtn
      />
      <div className="dash-content">
        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Cargar Datos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div className="dash-upload-zone">
                Arrastra archivos CSV o JSON aquí
                <br />
                <small>Máximo 50MB</small>
              </div>
              <button type="button" className="dash-btn dash-btn--purple" style={{ width: '100%' }}>
                Procesar y Validar
              </button>
              <p style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '0.75rem' }}>
                Los datos deben validarse antes del reentrenamiento del modelo.
              </p>
            </div>
            <div className="dash-card" style={{ background: '#f9fafb', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              Vista Previa de Datos — Carga un archivo para ver la vista previa
            </div>
          </div>
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Reentrenamiento del Modelo</h3>
            <button type="button" className="dash-btn dash-btn--primary">
              ▶ Iniciar Reentrenamiento
            </button>
          </div>
          <div className="dash-terminal">
            {RETRAIN_LOGS.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Estado del Pipeline</h3>
          <div className="dash-pipeline">
            {PIPELINE_STEPS.map((step) => (
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
              {UPLOAD_HISTORY.map((row) => (
                <tr key={row.fecha}>
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
            <div><span>Total Registros</span><strong>45,320</strong></div>
            <div><span>Último Proceso</span><strong>15 May</strong></div>
            <div><span>Calidad Datos</span><strong>98.7%</strong></div>
            <div><span>Versión</span><strong>v1.2</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
