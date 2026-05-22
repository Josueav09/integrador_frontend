import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { apiClient } from '../../api/client'

const RISK_COLORS = { high: '#ef4444', medium: '#f97316', low: '#22c55e' }

export function GnnNetworkPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const fetchGrafo = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/predict/grafo', { signal: controller.signal })
        if (active && res.data && res.data.success) {
          setData(res.data)
        }
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          console.error("Error fetching GNN graph:", err)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchGrafo()

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const nodes = data?.nodos || []
  const edges = data?.aristas || []
  const correlations = data?.correlaciones || []
  const nodeMap = Object.fromEntries(nodes.map((n: any) => [n.id, n]))

  return (
    <>
      <PageHeader
        title="Visualización de Red (GNN)"
        subtitle="Análisis de conexiones y patrones delictivos entre zonas"
      />
      <div className="dash-content" style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            Cargando Topología GNN...
          </div>
        )}

        <div className="dash-kpi-grid">
          <div className="dash-kpi">
            <p className="dash-kpi__label">Nodos Activos</p>
            <p className="dash-kpi__value">{nodes.length}</p>
            <p className="dash-kpi__sub">Zonas monitoreadas</p>
          </div>
          <div className="dash-kpi">
            <p className="dash-kpi__label">Conexiones</p>
            <p className="dash-kpi__value">{edges.length}</p>
            <p className="dash-kpi__sub">Relaciones detectadas</p>
          </div>
          <div className="dash-kpi">
            <p className="dash-kpi__label">Correlación Promedio</p>
            <p className="dash-kpi__value">62%</p>
            <p className="dash-kpi__sub">Entre zonas vinculadas</p>
          </div>
        </div>

        <div className="dash-gnn-layout">
          <div className="dash-card">
            <h3>Grafo de Relaciones</h3>
            <svg className="dash-gnn-graph" viewBox="0 0 460 280" width="100%">
              {edges.map((e: any) => {
                const from = nodeMap[e.from]
                const to = nodeMap[e.to]
                if (!from || !to) return null
                return (
                  <line
                    key={`${e.from}-${e.to}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={e.strength === 'high' ? '#ef4444' : '#d1d5db'}
                    strokeWidth={e.strength === 'high' ? 3 : 1.5}
                    opacity={0.8}
                  />
                )
              })}
              {nodes.map((n: any) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.size / 2}
                    fill={RISK_COLORS[n.risk as keyof typeof RISK_COLORS] || '#22c55e'}
                    opacity={0.85}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.size / 2 + 14}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#374151"
                    fontWeight="600"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              ● Riesgo Alto · ● Medio · ● Bajo · — Correlación Alta
            </p>
          </div>
          <div>
            <div className="dash-card" style={{ marginBottom: '1rem' }}>
              <h3>Información</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>
                Tamaño del nodo = actividad · Color = nivel de riesgo · Grosor de línea = correlación
              </p>
            </div>
            <div className="dash-card">
              <h3>Correlaciones Más Fuertes</h3>
              {correlations.map((c: any) => (
                <div key={c.pair} className="dash-correlation">
                  <span>{c.pair}</span>
                  <strong>{c.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-insight">
          <strong>Insights del Modelo GNN:</strong> Centro y Comercial son nodos centrales del grafo.
          Intervenciones coordinadas en estas zonas podrían reducir la actividad delictiva hasta un 35%.
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '2rem', fontSize: '0.8125rem' }}>
            <span>Centralidad Mayor: <strong>Centro (0.92)</strong></span>
            <span>Cluster detectado: <strong>3 zonas</strong></span>
          </div>
        </div>
      </div>
    </>
  )
}
