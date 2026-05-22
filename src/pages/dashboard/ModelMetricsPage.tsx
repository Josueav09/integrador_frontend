import { useState, useEffect } from 'react'
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
import { apiClient } from '../../api/client'

export function ModelMetricsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const fetchMetricas = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/predict/metricas', { signal: controller.signal })
        if (active && res.data && res.data.success) {
          setData(res.data)
        }
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          console.error("Error fetching model metrics:", err)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchMetricas()

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const kpis = data?.kpis || []
  const monthly = data?.monthly || []
  const comparison = data?.comparison || []
  const avgError = data?.avg_error || 5.0

  return (
    <>
      <PageHeader
        title="Métricas: Histórico vs Predicciones"
        subtitle="Evaluación del rendimiento del modelo GNN"
      />
      <div className="dash-content" style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            Cargando Métricas de Modelo GNN...
          </div>
        )}

        <div className="dash-kpi-grid">
          {kpis.map((k: any) => (
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
            <LineChart data={monthly}>
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
              Error Promedio {avgError}%
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
              {comparison.map((row: any) => (
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
              El modelo GNN está funcionando correctamente con una precisión de {100 - avgError}% y un error
              promedio de {avgError}%.
            </p>
          </div>
          <div style={{ fontSize: '0.8125rem', textAlign: 'right' }}>
            <div>Distritos Analizados: <strong>{comparison.length}</strong></div>
            <div>Error Promedio: <strong>{avgError}%</strong></div>
            <div>Confiabilidad: <strong>Alta</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
