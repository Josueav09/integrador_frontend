import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../components/dashboard/PageHeader'
import {
  MODEL_VERSIONS,
  PRECISION_OVER_TIME,
  TRAINING_LOGS,
} from '../../data/mockData'

export function MonitorPage() {
  const [logsOpen, setLogsOpen] = useState(false)

  return (
    <>
      <PageHeader title="Monitor del Modelo IA" subtitle="Seguimiento en tiempo real del rendimiento GNN" />
      <div className="dash-content">
        <div className="dash-status-banner">
          <div>
            <strong>✓ Estado: Activo</strong>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
              Versión v1.2 · Precisión actual: 94.2%
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              Último entrenamiento: 2024-05-15 14:30h · Alertas: 0
            </p>
          </div>
          <span className="dash-badge dash-badge--activo">En Línea</span>
        </div>

        <div className="dash-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="dash-kpi"><p className="dash-kpi__label">Precisión Actual</p><p className="dash-kpi__value">94.2%</p></div>
          <div className="dash-kpi"><p className="dash-kpi__label">Versión Activa</p><p className="dash-kpi__value">v1.2</p></div>
          <div className="dash-kpi"><p className="dash-kpi__label">Alertas Activas</p><p className="dash-kpi__value">0</p></div>
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Precisión del Modelo en el Tiempo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PRECISION_OVER_TIME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[88, 96]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Última medida: 95% · Promedio 7 días: 94.2%
          </p>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Historial de Versiones</h3>
            {MODEL_VERSIONS.map((v) => (
              <div key={v.version} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <strong>{v.version}</strong> — {v.desc}
                <span
                  className={`dash-badge ${v.status === 'Activa' ? 'dash-badge--activo' : ''}`}
                  style={{ marginLeft: 8, background: v.status === 'Activa' ? undefined : '#f3f4f6', color: '#6b7280' }}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
          <div className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Detalles del Último Entrenamiento</h3>
              <button type="button" className="dash-btn dash-btn--outline" onClick={() => setLogsOpen(true)}>
                Ver Logs Completos
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', fontSize: '0.8125rem' }}>
              {[
                ['Duración', '2h 15m'],
                ['Datos Procesados', '45,320'],
                ['Epochs', '150'],
                ['Learning Rate', '0.001'],
                ['Batch Size', '64'],
                ['Nodos del Grafo', '1,247'],
                ['Aristas', '3,821'],
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <br />
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem' }}>
              Estado Final: <span className="dash-badge dash-badge--activo">Exitoso</span>
            </p>
          </div>
        </div>

        <div className="dash-card" style={{ marginTop: '1rem' }}>
          <h3>Alertas del Sistema</h3>
          <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: 8, marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
            Modelo funcionando dentro de parámetros normales — Hace 2 min
          </div>
          <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: 8, fontSize: '0.8125rem' }}>
            Precisión mejoró 0.7% respecto a la versión anterior — Hace 2 días
          </div>
        </div>
      </div>

      {logsOpen && (
        <div className="dash-modal-overlay" onClick={() => setLogsOpen(false)} role="presentation">
          <div className="dash-modal dash-modal--dark" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="dash-modal__head">
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>Logs de Entrenamiento Completos</h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Modelo GNN v1.2 — 15 Mayo 2024 · Total: 61 · Info: 36 · Success: 23 · Warning: 2
                </p>
              </div>
              <button type="button" className="dash-modal__close" style={{ color: '#fff' }} onClick={() => setLogsOpen(false)}>
                ×
              </button>
            </div>
            <div className="dash-modal__body">
              {TRAINING_LOGS.map((log) => (
                <div key={log.time} className={`dash-log-entry dash-log-entry--${log.type}`}>
                  <span>{log.time}</span>
                  <span>{log.msg}</span>
                </div>
              ))}
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
                Mostrando {TRAINING_LOGS.length} registros (vista parcial)
              </p>
              <button type="button" className="dash-btn dash-btn--ghost" style={{ marginTop: '1rem' }} onClick={() => setLogsOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
