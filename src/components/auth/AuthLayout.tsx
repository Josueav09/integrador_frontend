import type { ReactNode } from 'react'
import { useTranslation } from '../../contexts/PreferencesContext'
import { AccessibilityTrigger } from '../accessibility/AccessibilityTrigger'

type BrandVariant = 'login' | 'register' | 'recover'

type AuthLayoutProps = {
  variant?: BrandVariant
  children: ReactNode
}

export function AuthLayout({ variant = 'login', children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="auth-shell">
      <aside className={`auth-brand auth-brand--${variant}`}>
        <div className="auth-brand__waves" aria-hidden="true" />
        <div className="auth-brand__content">
          <h1 className="auth-brand__title">{t('auth.brandTitle')}</h1>
          <p className="auth-brand__subtitle">{t('auth.brandSubtitle')}</p>
        </div>
      </aside>
      <main className="auth-panel">
        <div className="auth-panel__toolbar">
          <AccessibilityTrigger />
        </div>
        {children}
      </main>
    </div>
  )
}
