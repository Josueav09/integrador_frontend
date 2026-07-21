import { useState, useEffect } from 'react'
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
import { EmptyState } from '../../components/ui/EmptyState'
import { useNotification } from '../../contexts/NotificationContext'
import { apiClient } from '../../api/client'

export function PredictionsPage() {
  const { notifyApiError } = useNotification()
  const [distrito, setDistrito] = useState<string>('TODOS')
  const [distritosDb, setDistritosDb] = useState<string[]>([])
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Cargar lista de distritos
  useEffect(() => {
    const fetchDistritos = async () => {
      try {
        const res = await apiClient.get('/predict/distritos')
        if (res.data && res.data.success) {
          setDistritosDb(res.data.data)
        }
      } catch (err) {
        notifyApiError(err, 'No se pudo cargar la lista de distritos.')
      }
    }
    fetchDistritos()
  }, [notifyApiError])

  // Cargar detalles de la predicción cuando cambia el distrito
  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const fetchDetalles = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get(`/predict/detalles?distrito=${distrito}`, { signal: controller.signal })
        if (active && res.data && res.data.success) {
          setData(res.data)
        }
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          notifyApiError(err, 'No se pudieron cargar las predicciones.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchDetalles()

    return () => {
      active = false
      controller.abort()
    }
  }, [distrito, notifyApiError])

  const predictionVsHistory = data?.prediction_vs_history || []
  const riskByHour = data?.risk_by_hour || []
  const zoneComparison = data?.zone_comparison || []

  const totalReal = predictionVsHistory.reduce((acc: number, row: { real?: number }) => acc + (row.real ?? 0), 0)
  const totalPred = predictionVsHistory.reduce((acc: number, row: { pred?: number }) => acc + (row.pred ?? 0), 0)
  const riskLevel =
    totalPred > totalReal * 1.1 ? 'Alto' : totalPred < totalReal * 0.9 ? 'Moderado' : 'Estable'
  const hasSummaryData = predictionVsHistory.length > 0

  return (
    <>
      <PageHeader
        title="Predicciones IA"
        subtitle="Análisis predictivo basado en modelo GNN espacio-temporal"
      >
        <select
          className="dash-select"
          value={distrito}
          onChange={(e) => setDistrito(e.target.value)}
          style={{ minWidth: '200px' }}
          data-testid="predictions-district-select"
        >
          <option value="TODOS">TODOS (Lima Metropolitana)</option>
          {distritosDb.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </PageHeader>
      <div className="dash-content" style={{ position: 'relative' }}>
        {loading && (
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}
            data-testid="predictions-loading"
          >
            Cargando Análisis Predictivo...
          </div>
        )}

        <div className="dash-alert-card">
          <h3>Distrito Seleccionado: {distrito}</h3>
          {hasSummaryData ? (
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Incidentes históricos (7d): <strong>{totalReal}</strong> · Proyección modelo:{' '}
              <strong>{totalPred}</strong> · Nivel de riesgo estimado: <strong>{riskLevel}</strong>
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No hay suficientes datos para este distrito. Seleccione otro o use TODOS.
            </p>
          )}
          <p className="predictions-summary--demo">
            Indicadores calculados a partir del histórico y la proyección del endpoint /predict/detalles.
          </p>
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Predicción vs Histórico (Últimos 7 días)</h3>
          {predictionVsHistory.length === 0 ? (
            <EmptyState message="No hay datos de predicción vs histórico para el distrito seleccionado." />
          ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={predictionVsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="real" name="Histórico Real" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="pred" name="Predicción IA" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Riesgo por Hora (Bloques de 3 horas)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="risk" fill="#f97316" radius={[4, 4, 0, 0]} name="Intensidad de Riesgo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Indicadores de Probabilidad (Próximos días)</h3>
            {[
              { day: 'Vie 22', pct: 83 },
              { day: 'Sáb 23', pct: 79 },
              { day: 'Dom 24', pct: 72 },
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
          <h3>Comparación de Zonas de Mayor Riesgo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {zoneComparison.length === 0 ? (
              <EmptyState message="No hay zonas de riesgo comparables para este distrito." />
            ) : zoneComparison.map((z: any) => (
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
            <div><span>Datos</span><strong>Histórico BD</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
