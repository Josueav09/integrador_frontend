import {
  Bar,
  BarChart,
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
import {
  PREDICTION_VS_HISTORY,
  RISK_BY_HOUR,
  ZONE_COMPARISON,
} from '../../data/mockData'

export function PredictionsPage() {
  return (
    <>
      <PageHeader
        title="Predicciones IA"
        subtitle="Análisis predictivo basado en modelo GNN espacio-temporal"
      >
        <select className="dash-select" defaultValue="centro">
          <option>Centro Histórico</option>
        </select>
        <select className="dash-select" defaultValue="7d">
          <option>Próximos 7 días</option>
        </select>
      </PageHeader>
      <div className="dash-content">
        <div className="dash-alert-card">
          <h3>Centro Histórico</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            <strong>88%</strong> Confiabilidad del modelo · Probabilidad de incremento delictivo:{' '}
            <strong>88%</strong> · Nivel de Riesgo: <strong>Alto</strong> · Tendencia:{' '}
            <strong>Ascendente</strong>
          </p>
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Predicción vs Histórico</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={PREDICTION_VS_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="real" name="Histórico Real" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="pred" name="Predicción IA" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Riesgo por Hora — Próximas 24h</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={RISK_BY_HOUR}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="risk" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Indicadores de Probabilidad</h3>
            {[
              { day: 'Vie 25', pct: 83 },
              { day: 'Sáb 26', pct: 79 },
              { day: 'Dom 27', pct: 72 },
            ].map((d) => (
              <div key={d.day} className="dash-progress-row">
                <div className="dash-progress-row__head">
                  <span>{d.day}</span>
                  <span>{d.pct}%</span>
                </div>
                <div className="dash-progress-bar">
                  <div
                    className="dash-progress-bar__fill"
                    style={{ width: `${d.pct}%`, background: '#8b5cf6' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card" style={{ marginTop: '1rem' }}>
          <h3>Comparación de Zonas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {ZONE_COMPARISON.map((z) => (
              <div key={z.zone} className="dash-zone-card">
                <div className="dash-zone-card__head">
                  <span>{z.zone}</span>
                  <span className={`dash-badge dash-badge--${z.risk === 'Alto' ? 'alta' : z.risk === 'Medio' ? 'media' : 'baja'}`}>
                    Riesgo {z.risk}
                  </span>
                </div>
                <div className="dash-progress-bar">
                  <div
                    className="dash-progress-bar__fill"
                    style={{ width: `${z.value}%`, background: z.color }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem' }}>{z.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-ai-banner" style={{ marginTop: '1rem' }}>
          <h4>Información del Modelo GNN</h4>
          <p>Modelo de red neuronal de grafos para predicción espacio-temporal de delitos.</p>
          <div className="dash-ai-banner__stats">
            <div><span>Precisión</span><strong>94.2%</strong></div>
            <div><span>F1-Score</span><strong>0.89</strong></div>
            <div><span>Última Act.</span><strong>15 min</strong></div>
            <div><span>Datos</span><strong>2.3M</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
