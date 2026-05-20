import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { NAV_ITEMS } from '../../data/mockData'
import { NavIcon, ShieldIcon } from '../icons/Icons'

export function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
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
            <strong>GNN Crime AI</strong>
            <span>Sistema Predictivo</span>
          </div>
        </div>
        <nav className="dash-nav" onClick={closeMobile}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="dash-nav__icon">
                <NavIcon name={item.icon} />
              </span>
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
