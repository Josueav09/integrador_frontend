import { Link } from 'react-router-dom'

type BackLinkProps = {
  to: string
  children?: string
}

export function BackLink({ to, children = 'Volver a iniciar sesión' }: BackLinkProps) {
  return (
    <Link to={to} className="auth-back">
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  )
}
