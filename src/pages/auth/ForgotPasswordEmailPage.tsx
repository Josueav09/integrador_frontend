import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'

export function ForgotPasswordEmailPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const isValid = email.trim().length > 0 && email.includes('@')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    navigate('/forgot-password/code', { state: { email } })
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Recuperar contraseña</h1>
        <p className="auth-form__subtitle">
          Ingresa tu correo electrónico y te enviaremos un código para que puedas
          restablecerla de manera segura.
        </p>
        <TextField
          id="forgot-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <PrimaryButton disabled={!isValid}>Enviar código</PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
