import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'

export function ForgotPasswordEmailPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValid = email.trim().length > 0 && email.includes('@')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setError(null)
    setLoading(true)
    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() })
      navigate('/forgot-password/code', { state: { email: email.trim() } })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo enviar el código de recuperación.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Recuperar contraseña</h1>
        <p className="auth-form__subtitle">
          Ingresa tu correo electrónico y te enviaremos un código para que puedas
          restablecerla de manera segura.
        </p>
        {error && <div className="auth-error-banner" role="alert">{error}</div>}
        <TextField
          id="forgot-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <PrimaryButton disabled={!isValid || loading}>
          {loading ? 'Enviando...' : 'Enviar código'}
        </PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
