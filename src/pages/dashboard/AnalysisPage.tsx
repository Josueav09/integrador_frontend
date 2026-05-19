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
import {
  ANALYSIS_KPIS,
  CRIME_DISTRIBUTION,
  HOURLY_PATTERN,
  MONTHLY_BY_TYPE,
  WEEKDAY_PATTERN,
  ZONE_TABLE,
} from '../../data/mockData'

export function AnalysisPage() {
  return (
    <>
      <PageHeader title="Análisis Avanzado" subtitle="Exploración profunda de patrones delictivos">
        <select className="dash-select"><option>Últimos 30 días</option></select>
        <select className="dash-select"><option>Todos los delitos</option></select>
      </PageHeader>
      <div className="dash-content">
        <div className="dash-kpi-grid">
          {ANALYSIS_KPIS.map((k) => (
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
            <AreaChart data={MONTHLY_BY_TYPE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="robo" stackId="1" stroke="#ef4444" fill="#fecaca" />
              <Area type="monotone" dataKey="asalto" stackId="1" stroke="#f97316" fill="#fed7aa" />
              <Area type="monotone" dataKey="vandalismo" stackId="1" stroke="#eab308" fill="#fef08a" />
              <Area type="monotone" dataKey="fraude" stackId="1" stroke="#3b82f6" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Patrón Horario</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOURLY_PATTERN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-card">
            <h3>Patrón por Día de Semana</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={WEEKDAY_PATTERN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-grid-2">
          <div className="dash-card">
            <h3>Distribución de Delitos</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CRIME_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {CRIME_DISTRIBUTION.map((e) => (
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
                </tr>
              </thead>
              <tbody>
                {ZONE_TABLE.map((row) => (
                  <tr key={row.zone}>
                    <td><strong>{row.zone}</strong></td>
                    <td>{row.ene}</td>
                    <td>{row.feb}</td>
                    <td>{row.mar}</td>
                    <td>{row.abr}</td>
                    <td>{row.may}</td>
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
