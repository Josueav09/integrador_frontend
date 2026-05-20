import { useAuth } from '../../contexts/AuthContext'
import { useUserModal } from '../../contexts/UserModalContext'

type PageHeaderProps = {
  title: string
  subtitle?: string
  children?: React.ReactNode
  showUserBtn?: boolean
}

export function PageHeader({ title, subtitle, children, showUserBtn = true }: PageHeaderProps) {
  const { open } = useUserModal()
  const { user } = useAuth()

  return (
    <header className="dash-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="dash-header__actions">
        {user && <span className="dash-header__user">{user.email}</span>}
        {children}
        {showUserBtn && (
          <button type="button" className="dash-btn dash-btn--primary" onClick={open}>
            Gestión de Usuarios
          </button>
        )}
      </div>
    </header>
  )
}
