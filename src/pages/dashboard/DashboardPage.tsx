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
import { PageHeader } from '../../components/dashboard/PageHeader'
import {
  CRIMES_BY_TYPE,
  DASHBOARD_KPIS,
  RECENT_ALERTS,
  WEEKLY_TREND,
} from '../../data/mockData'

const KPI_ICONS: Record<string, string> = {
  pulse: '📊',
  pin: '📍',
  warning: '⚠',
  trend: '📈',
}

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard Analítico" subtitle="Vista general del sistema predictivo" />
      <div className="dash-content">
        <div className="dash-kpi-grid">
          {DASHBOARD_KPIS.map((kpi) => (
            <div key={kpi.label} className="dash-kpi">
              <div className="dash-kpi__top">
                <div>
                  <p className="dash-kpi__label">{kpi.label}</p>
                  <p className="dash-kpi__value">{kpi.value}</p>
                  {'change' in kpi && kpi.change && (
                    <p className="dash-kpi__change">{kpi.change}</p>
                  )}
                  {'sub' in kpi && kpi.sub && <p className="dash-kpi__sub">{kpi.sub}</p>}
                </div>
                <div className={`dash-kpi__icon dash-kpi__icon--${kpi.tone}`}>
                  {KPI_ICONS[kpi.icon]}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Delitos por Tipo</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CRIMES_BY_TYPE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
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
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
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
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{a.time}</p>
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
