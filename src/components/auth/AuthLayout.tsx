import type { ReactNode } from 'react'

type BrandVariant = 'login' | 'register' | 'recover'

type AuthLayoutProps = {
  variant?: BrandVariant
  children: ReactNode
}

export function AuthLayout({ variant = 'login', children }: AuthLayoutProps) {
  return (
    <div className="auth-shell">
      <aside className={`auth-brand auth-brand--${variant}`}>
        <div className="auth-brand__waves" aria-hidden="true" />
        <h1 className="auth-brand__title">GNN Crime AI</h1>
      </aside>
      <main className="auth-panel">{children}</main>
    </div>
  )
}
