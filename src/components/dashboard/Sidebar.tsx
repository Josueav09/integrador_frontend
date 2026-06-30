import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../contexts/PreferencesContext'
import { NavIcon, ShieldIcon } from '../icons/Icons'

const NAV_CONFIG = [
  { path: '/dashboard', labelKey: 'nav.dashboard' as const, icon: 'dashboard', end: true },
  { path: '/dashboard/mapa', labelKey: 'nav.map' as const, icon: 'map' },
  { path: '/dashboard/predicciones', labelKey: 'nav.predictions' as const, icon: 'predict' },
  { path: '/dashboard/analisis', labelKey: 'nav.analysis' as const, icon: 'analysis' },
  { path: '/dashboard/red-gnn', labelKey: 'nav.gnn' as const, icon: 'network' },
  { path: '/dashboard/metricas', labelKey: 'nav.metrics' as const, icon: 'metrics' },
  { path: '/dashboard/monitor', labelKey: 'nav.monitor' as const, icon: 'monitor' },
  { path: '/dashboard/administracion', labelKey: 'nav.admin' as const, icon: 'admin' },
  { path: '/dashboard/denuncias', labelKey: 'nav.inbox' as const, icon: 'predict' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="dash-brand">
          <div className="dash-brand__icon">
            <ShieldIcon size={20} />
          </div>
          <div className="dash-brand__text">
            <strong>{t('app.name')}</strong>
            <span>{t('app.subtitle')}</span>
          </div>
        </div>
        <nav className="dash-nav" onClick={closeMobile}>
          {NAV_CONFIG.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="dash-nav__icon">
                <NavIcon name={item.icon} />
              </span>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="dash-sidebar__footer">
          {user && (
            <p className="dash-sidebar__user" title={user.email}>
              {user.name}
            </p>
          )}
          <p className="dash-sidebar__version">{t('app.version')}</p>
          <button
            type="button"
            className="dash-logout"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            ↪ {t('nav.logout')}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="dash-filters-backdrop open"
          aria-label="Cerrar menú"
          onClick={closeMobile}
          style={{ zIndex: 35 }}
        />
      )}

      <button
        type="button"
        className="dash-mobile-toggle"
        aria-label="Abrir menú"
        onClick={() => setMobileOpen((o) => !o)}
      >
        ☰
      </button>
    </>
  )
}
