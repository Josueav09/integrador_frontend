import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { AuthStepIndicator } from '../../components/auth/AuthStepIndicator'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'
import { getEmailError } from '../../utils/formValidation'

export function ForgotPasswordEmailPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValid = !getEmailError(email)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    const nextEmailError = getEmailError(email)
    setEmailError(nextEmailError)
    if (nextEmailError) return

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
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthStepIndicator current={1} />
        <h1>Recuperar contraseña</h1>
        <p className="auth-form__subtitle">
          Ingresa tu correo electrónico. Si la cuenta existe, recibirás un código válido por 15 minutos.
        </p>
        {error && <div className="auth-error-banner" role="alert">{error}</div>}
        <TextField
          id="forgot-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(getEmailError(e.target.value))
          }}
          onBlur={() => setEmailError(getEmailError(email))}
          autoComplete="email"
          hint="Usa el mismo correo con el que te registraste."
          fieldError={emailError}
        />
        <PrimaryButton disabled={!isValid || loading}>
          {loading ? 'Enviando...' : 'Enviar código'}
        </PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
