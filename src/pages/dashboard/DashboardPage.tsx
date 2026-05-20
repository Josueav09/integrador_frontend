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
import {
  CRIMES_BY_TYPE,
  DASHBOARD_KPIS,
  RECENT_ALERTS,
  WEEKLY_TREND,
} from '../../data/mockData'
import { chartAxisTick, chartGridStroke, chartTooltipStyle } from '../../utils/chartTheme'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard Analítico"
        subtitle="Monitoreo en tiempo real del sistema de pronóstico"
      />
      <div className="dash-content">
        <div className="dash-kpi-grid">
          {DASHBOARD_KPIS.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={'change' in kpi ? kpi.change : undefined}
              sub={'sub' in kpi ? kpi.sub : undefined}
              tone={kpi.tone as 'blue' | 'orange' | 'red' | 'purple'}
              icon={kpi.icon}
            />
          ))}
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Delitos por Tipo</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CRIMES_BY_TYPE} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="name" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {CRIMES_BY_TYPE.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Tendencia Semanal</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={WEEKLY_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
            <h3>Alertas Recientes</h3>
            {RECENT_ALERTS.map((a) => (
              <div key={a.zone} className="dash-alert">
                <div>
                  <strong>{a.zone}</strong>
                  <p className="dash-alert__time">{a.time}</p>
                </div>
                <span className={`dash-badge dash-badge--${a.level.toLowerCase()}`}>{a.level}</span>
              </div>
            ))}
          </div>
          <div className="dash-ai-banner">
            <h4>Resumen de Predicción IA</h4>
            <p>
              El modelo GNN predice un incremento del 15% en actividad delictiva para las próximas
              24 horas, concentrado principalmente en zonas Centro y Norte.
            </p>
            <div className="dash-ai-banner__stats">
              <div>
                <span>Precisión del Modelo</span>
                <strong>94.2%</strong>
              </div>
              <div>
                <span>Confianza</span>
                <strong>Alta</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
