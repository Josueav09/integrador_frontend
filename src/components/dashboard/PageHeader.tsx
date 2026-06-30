import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../contexts/PreferencesContext'
import { useUserModal } from '../../contexts/UserModalContext'
import { AccessibilityTrigger } from '../accessibility/AccessibilityTrigger'

type PageHeaderProps = {
  title: string
  subtitle?: string
  children?: React.ReactNode
  showUserBtn?: boolean
}

export function PageHeader({ title, subtitle, children, showUserBtn = true }: PageHeaderProps) {
  const { open } = useUserModal()
  const { user, rolId } = useAuth()
  const { t } = useTranslation()

  const roleLabel =
    rolId === 1
      ? t('header.role.admin')
      : rolId === 3
        ? t('header.role.investigator')
        : rolId === 4
          ? t('header.role.manager')
          : t('header.role.analyst')

  return (
    <header className="dash-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="dash-header__actions">
        {user && (
          <span className="dash-header__user-pill" title={user.email}>
            {user.name} · {roleLabel}
          </span>
        )}
        {children}
        {showUserBtn && (
          <button type="button" className="dash-btn dash-btn--primary" onClick={open}>
            {t('header.userManagement')}
          </button>
        )}
        <AccessibilityTrigger />
      </div>
    </header>
  )
}
