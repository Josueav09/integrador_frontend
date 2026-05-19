import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { DISTRICT_COMPARISON, METRICS_KPIS, METRICS_MONTHLY } from '../../data/mockData'

export function ModelMetricsPage() {
  return (
    <>
      <PageHeader
        title="Métricas: Histórico vs Predicciones"
        subtitle="Evaluación del rendimiento del modelo GNN"
      />
      <div className="dash-content">
        <div className="dash-kpi-grid">
          {METRICS_KPIS.map((k) => (
            <div key={k.label} className="dash-kpi">
              <p className="dash-kpi__label">{k.label}</p>
              <p className="dash-kpi__value">{k.value}</p>
              <p className="dash-kpi__sub">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Predicción vs Realidad (Mensual)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={METRICS_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pred" name="Predicción GNN" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="real" name="Datos Reales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card">
          <h3>
            Comparación por Distrito{' '}
            <span className="dash-badge dash-badge--bueno" style={{ marginLeft: 8 }}>
              Error Promedio 5.0%
            </span>
          </h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Distrito</th>
                <th>Predicho</th>
                <th>Real</th>
                <th>% Error</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_COMPARISON.map((row) => (
                <tr key={row.distrito}>
                  <td>{row.distrito}</td>
                  <td>{row.predicho}</td>
                  <td>{row.real}</td>
                  <td>{row.error}%</td>
                  <td>
                    <span
                      className={`dash-badge dash-badge--${row.estado === 'Bueno' ? 'bueno' : 'revisar'}`}
                    >
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dash-status-banner" style={{ marginTop: '1rem' }}>
          <div>
            <strong>Estado del Modelo: Óptimo</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: '#374151' }}>
              El modelo GNN está funcionando correctamente con una precisión del 94.2% y un error
              promedio de 5.0%. Solo 3 distritos requieren atención.
            </p>
          </div>
          <div style={{ fontSize: '0.8125rem', textAlign: 'right' }}>
            <div>Distritos OK: <strong>9/12</strong></div>
            <div>Error Promedio: <strong>5.0%</strong></div>
            <div>Confiabilidad: <strong>Alta</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
