import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'

export function ForgotPasswordNewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string; code?: string } | null)?.email
  const code = (location.state as { email?: string; code?: string } | null)?.code
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!email || !code) {
    return <Navigate to="/forgot-password" replace />
  }

  const isValid =
    password.trim().length >= 6 &&
    confirm.trim().length >= 6 &&
    password === confirm

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setError(null)
    setLoading(true)
    try {
      await apiClient.post('/auth/reset-password', { email, code, newPassword: password })
      navigate('/forgot-password/success')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo restablecer la contraseña.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Nueva contraseña</h1>
        <p className="auth-form__subtitle">
          Crea una contraseña segura y única para restablecer el acceso a tu cuenta.
        </p>
        {error && <div className="auth-error-banner" role="alert">{error}</div>}
        <TextField
          id="new-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <TextField
          id="confirm-password"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
        <PrimaryButton disabled={!isValid || loading}>
          {loading ? 'Guardando...' : 'Continuar'}
        </PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
