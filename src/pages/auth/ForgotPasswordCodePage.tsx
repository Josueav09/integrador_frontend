import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { OtpInput } from '../../components/auth/OtpInput'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'

export function ForgotPasswordCodePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [code, setCode] = useState('')

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  const isValid = code.length === 4

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    navigate('/forgot-password/new', { state: { email } })
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Código de verificación</h1>
        <p className="auth-form__subtitle">
          Te enviamos un código a <strong>{email}</strong>.
        </p>
        <OtpInput value={code} onChange={setCode} />
        <p className="auth-resend">
          ¿No recibiste el código? <button type="button">Click para reenviar</button>
        </p>
        <PrimaryButton disabled={!isValid}>Continuar</PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
