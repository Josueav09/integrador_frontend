import { useState } from 'react'
import { useUserModal } from '../../contexts/UserModalContext'
import { USERS } from '../../data/mockData'

export function UserManagementModal() {
  const { isOpen, close } = useUserModal()
  const [tab, setTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filtered = USERS.filter((u) => {
    const matchTab =
      tab === 'all' ||
      (tab === 'active' && u.status === 'Activo') ||
      (tab === 'inactive' && u.status === 'Inactivo')
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="dash-modal-overlay" onClick={close} role="presentation">
      <div
        className="dash-modal dash-modal--wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="users-modal-title"
      >
        <div className="dash-modal__head">
          <div>
            <h2 id="users-modal-title" style={{ margin: 0 }}>
              Gestión de Usuarios
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Administrar roles y permisos del sistema
            </p>
          </div>
          <button type="button" className="dash-modal__close" onClick={close} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="dash-modal__body">
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="search"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dash-select"
              style={{ flex: 1, minWidth: 200 }}
            />
            <select className="dash-select" defaultValue="all">
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="analista">Analista</option>
            </select>
            <button type="button" className="dash-btn dash-btn--primary">
              + Agregar Usuario
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['all', 'active', 'inactive'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`dash-btn ${tab === t ? 'dash-btn--primary' : 'dash-btn--ghost'}`}
                onClick={() => setTab(t)}
              >
                {t === 'all' ? `Todo (${USERS.length})` : t === 'active' ? `Activos (4)` : `Inactivos (1)`}
              </button>
            ))}
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.email}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`dash-role-tag ${
                        u.role === 'Operario'
                          ? 'dash-role-tag--operario'
                          : u.role === 'Investigador'
                            ? 'dash-role-tag--investigador'
                            : ''
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`dash-badge dash-badge--${u.status === 'Activo' ? 'activo' : 'inactivo'}`}>
                      ● {u.status}
                    </span>
                  </td>
                  <td>{u.date}</td>
                  <td style={{ fontSize: '1rem' }}>✎ 🗑{u.status === 'Inactivo' ? ' ✓' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
