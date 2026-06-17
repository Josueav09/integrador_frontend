import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { OtpInput } from '../../components/auth/OtpInput'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'

export function ForgotPasswordCodePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  const isValid = code.length === 6

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setError(null)
    setLoading(true)
    try {
      await apiClient.post('/auth/verify-code', { email, code })
      navigate('/forgot-password/new', { state: { email, code } })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Código incorrecto o expirado.'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setInfo(null)
    setResending(true)
    try {
      await apiClient.post('/auth/forgot-password', { email })
      setInfo('Se envió un nuevo código a tu correo.')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo reenviar el código.'))
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Código de verificación</h1>
        <p className="auth-form__subtitle">
          Te enviamos un código a <strong>{email}</strong>.
        </p>
        {info && <div className="auth-info-banner" role="status">{info}</div>}
        {error && <div className="auth-error-banner" role="alert">{error}</div>}
        <OtpInput value={code} onChange={setCode} />
        <p className="auth-resend">
          ¿No recibiste el código?{' '}
          <button type="button" onClick={handleResend} disabled={resending}>
            {resending ? 'Reenviando...' : 'Click para reenviar'}
          </button>
        </p>
        <PrimaryButton disabled={!isValid || loading}>
          {loading ? 'Verificando...' : 'Continuar'}
        </PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
