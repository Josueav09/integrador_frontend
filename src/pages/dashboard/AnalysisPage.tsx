import { useState, useEffect } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { apiClient } from '../../api/client'

export function AnalysisPage() {
  const [anio, setAnio] = useState<string>('todos')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const fetchAnalysis = async () => {
      setLoading(true)
      try {
        const url = anio !== 'todos' ? `/dashboard/analisis?anio=${anio}` : '/dashboard/analisis'
        const res = await apiClient.get(url, { signal: controller.signal })
        if (active && res.data && res.data.success) {
          setData(res.data.data)
        }
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          console.error("Error loading analysis data:", err)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchAnalysis()

    return () => {
      active = false
      controller.abort()
    }
  }, [anio])

  const kpis = data?.kpis || []
  const monthlyByType = data?.monthly_by_type || []
  const hourlyPattern = data?.hourly_pattern || []
  const weeklyPattern = data?.weekly_pattern || []
  const crimeDistribution = data?.crime_distribution || []
  const zoneTable = data?.zone_table || []

  return (
    <>
      <PageHeader title="Análisis Avanzado" subtitle="Exploración profunda de patrones delictivos">
        <select 
          className="dash-select" 
          value={anio} 
          onChange={(e) => setAnio(e.target.value)}
        >
          <option value="todos">Últimos 30 días</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </PageHeader>
      <div className="dash-content" style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            Cargando Análisis Avanzado...
          </div>
        )}
        
        <div className="dash-kpi-grid">
          {kpis.map((k: any) => (
            <div key={k.label} className="dash-kpi">
              <p className="dash-kpi__label">{k.label}</p>
              <p className="dash-kpi__value">{k.value}</p>
              <p className="dash-kpi__sub">{k.change}</p>
            </div>
          ))}
        </div>

        <div className="dash-card" style={{ marginBottom: '1rem' }}>
          <h3>Tendencia Mensual por Tipo de Delito</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="robo" stackId="1" stroke="#ef4444" fill="#fecaca" name="Robo" />
              <Area type="monotone" dataKey="asalto" stackId="1" stroke="#f97316" fill="#fed7aa" name="Asalto/Hurto" />
              <Area type="monotone" dataKey="vandalismo" stackId="1" stroke="#eab308" fill="#fef08a" name="Vandalismo" />
              <Area type="monotone" dataKey="fraude" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Fraude/Otros" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Patrón Horario</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Incidentes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Patrón por Día de Semana</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} name="Incidentes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Distribución de Delitos</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={crimeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {crimeDistribution.map((e: any) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Comparación de Zonas — Últimos 6 meses</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Zona</th>
                  <th>Ene</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Abr</th>
                  <th>May</th>
                  <th>Jun</th>
                </tr>
              </thead>
              <tbody>
                {zoneTable.map((row: any) => (
                  <tr key={row.zone}>
                    <td><strong>{row.zone}</strong></td>
                    <td>{row.ene || 0}</td>
                    <td>{row.feb || 0}</td>
                    <td>{row.mar || 0}</td>
                    <td>{row.abr || 0}</td>
                    <td>{row.may || 0}</td>
                    <td>{row.jun || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
