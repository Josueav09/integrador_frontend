import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { NAV_ITEMS } from '../../data/mockData'

const ICONS: Record<string, string> = {
  dashboard: '▣',
  map: '◎',
  predict: '◈',
  analysis: '◫',
  network: '⬡',
  metrics: '▤',
  monitor: '◉',
  admin: '⚙',
}

export function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <div className="dash-brand__icon">🛡</div>
        <div className="dash-brand__text">
          <strong>GNN Crime AI</strong>
          <span>Sistema Predictivo</span>
        </div>
      </div>
      <nav className="dash-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="dash-nav__icon">{ICONS[item.icon]}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="dash-sidebar__footer">
        {user && (
          <p className="dash-sidebar__user" title={user.email}>
            {user.name}
          </p>
        )}
        <p className="dash-sidebar__version">Sistema de Pronóstico Espaciotemporal v1.0</p>
        <button
          type="button"
          className="dash-logout"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          ↪ Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
