import { useState, useEffect } from 'react'
import { useUserModal } from '../../contexts/UserModalContext'
import { apiClient } from '../../api/client'

type UserData = {
  id_usuario_sistema: number
  nombre_usuario_sistema: string
  email_usuario_sistema: string
  estado_usuario_sistema: string
  id_rol: number
  rol_nombre: string
}

export function UserManagementModal() {
  const { isOpen, close } = useUserModal()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')
  
  // Form state
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rolId, setRolId] = useState(2) // 2 = Analista por defecto

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/usuarios')
      setUsers(res.data)
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
      setShowForm(false)
    }
  }, [isOpen])

  const handleCreate = async () => {
    try {
      await apiClient.post('/usuarios', {
        nombre,
        email,
        id_rol: rolId
      })
      alert("Usuario creado correctamente. El correo de bienvenida ha sido encolado.")
      setNombre('')
      setEmail('')
      setShowForm(false)
      fetchUsers()
    } catch (err: any) {
      alert("Error al crear usuario: " + (err.response?.data?.detail || err.message))
    }
  }

  const handleToggleStatus = async (id: number) => {
    if (window.confirm("¿Seguro que desea desactivar esta cuenta Policial?")) {
      try {
        await apiClient.delete(`/usuarios/${id}`)
        fetchUsers()
      } catch (err) {
        console.error(err)
        alert("Error al desactivar")
      }
    }
  }

  if (!isOpen) return null

  const filtered = users.filter((u) => {
    const matchTab =
      tab === 'all' ||
      (tab === 'active' && u.estado_usuario_sistema === 'activo') ||
      (tab === 'inactive' && u.estado_usuario_sistema === 'inactivo')
    const matchSearch =
      !search ||
      u.nombre_usuario_sistema.toLowerCase().includes(search.toLowerCase()) ||
      u.email_usuario_sistema.toLowerCase().includes(search.toLowerCase())
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
            <button type="button" className="dash-btn dash-btn--primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : '+ Agregar Usuario'}
            </button>
          </div>

          {showForm && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Nuevo Oficial de Policía</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Rango y Nombres" className="dash-input" value={nombre} onChange={e => setNombre(e.target.value)} />
                <input type="email" placeholder="Correo (@pnp.gob.pe)" className="dash-input" value={email} onChange={e => setEmail(e.target.value)} />
                <select className="dash-select" value={rolId} onChange={e => setRolId(Number(e.target.value))}>
                  <option value={1}>Administrador</option>
                  <option value={2}>Analista</option>
                </select>
              </div>
              <button type="button" className="dash-btn dash-btn--primary" onClick={handleCreate}>Guardar e Invitar</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['all', 'active', 'inactive'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`dash-btn ${tab === t ? 'dash-btn--primary' : 'dash-btn--ghost'}`}
                onClick={() => setTab(t)}
              >
                {t === 'all' ? `Todo (${users.length})` : t === 'active' ? `Activos (${users.filter(u => u.estado_usuario_sistema === 'activo').length})` : `Inactivos (${users.filter(u => u.estado_usuario_sistema === 'inactivo').length})`}
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
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Cargando usuarios desde DB...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron usuarios.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.email_usuario_sistema}>
                  <td><strong>{u.nombre_usuario_sistema}</strong></td>
                  <td>{u.email_usuario_sistema}</td>
                  <td>
                    <span className="dash-role-tag">{u.rol_nombre}</span>
                  </td>
                  <td>
                    <span className={`dash-badge dash-badge--${u.estado_usuario_sistema === 'activo' ? 'activo' : 'inactivo'}`}>
                      ● {u.estado_usuario_sistema}
                    </span>
                  </td>
                  <td>-</td>
                  <td>
                    <div className="dash-user-actions">
                      {u.estado_usuario_sistema === 'activo' && (
                        <button type="button" title="Desactivar" onClick={() => handleToggleStatus(u.id_usuario_sistema)}>🗑</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
