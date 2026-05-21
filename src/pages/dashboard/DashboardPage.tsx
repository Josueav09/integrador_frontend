import { useState, useEffect } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { KpiCard } from '../../components/dashboard/KpiCard'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { apiClient } from '../../api/client'
import { chartAxisTick, chartGridStroke, chartTooltipStyle } from '../../utils/chartTheme'

export function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/dashboard/kpis')
        if (res.data && res.data.success) {
          setData(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching dashboard kpis", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Cargando datos históricos...</div>
  }

  // Mapeos para adaptar datos reales de BD a los gráficos de Recharts
  const kpis = [
    { label: 'Delitos (30D)', value: data?.total_delitos_30d || 0, icon: 'pulse', tone: 'blue' as const },
    { label: 'Zonas Críticas', value: data?.top_zonas?.length || 0, icon: 'pin', tone: 'orange' as const },
    { label: 'Riesgo Global', value: data?.nivel_riesgo_global || 'Bajo', icon: 'warning', tone: 'red' as const },
  ]

  const chartColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  const delitosPorTipo = (data?.distribucion_tipos || []).map((d: any, index: number) => ({
    name: d.type,
    value: d.count,
    color: chartColors[index % chartColors.length]
  }))

  const tendenciaSemanal = (data?.tendencia_7d || []).map((d: any) => ({
    day: d.date.split('-')[2], // Solo el dia para que quepa en el grafico
    value: d.count
  }))

  return (
    <>
      <PageHeader
        title="Dashboard Analítico"
        subtitle="Monitoreo en tiempo real del sistema de pronóstico"
      />
      <div className="dash-content">
        <div className="dash-kpi-grid">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value.toString()}
              tone={kpi.tone}
              icon={kpi.icon}
            />
          ))}
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Delitos por Tipo (Últimos 30 días)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={delitosPorTipo} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="name" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {delitosPorTipo.map((entry: any) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Tendencia Semanal</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={tendenciaSemanal} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="day" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Zonas más Peligrosas (Histórico Real)</h3>
            {data?.top_zonas?.map((a: any, i: number) => (
              <div key={i} className="dash-alert">
                <div>
                  <strong>{a.zone}</strong>
                  <p className="dash-alert__time">{a.count} delitos reportados</p>
                </div>
                <span className="dash-badge dash-badge--high">Zona Crítica</span>
              </div>
            ))}
            {(!data?.top_zonas || data.top_zonas.length === 0) && (
              <p style={{ color: '#aaa', marginTop: '1rem' }}>No hay registros de delitos recientes.</p>
            )}
          </div>
          <div className="dash-ai-banner">
            <h4>Resumen del Histórico</h4>
            <p>
              Estos datos provienen en tiempo real de la base de datos oficial (PostGIS). El sistema usa un caché de 5 minutos para optimizar las cargas de la DB policial.
            </p>
            <div className="dash-ai-banner__stats">
              <div>
                <span>Total DB (30D)</span>
                <strong>{data?.total_delitos_30d || 0} Incidentes</strong>
              </div>
              <div>
                <span>Estado Servidor</span>
                <strong>En Línea</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
