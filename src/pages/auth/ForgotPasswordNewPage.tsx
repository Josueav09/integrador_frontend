import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { BackLink } from '../../components/auth/BackLink'

export function ForgotPasswordNewPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const isValid =
    password.trim().length >= 6 &&
    confirm.trim().length >= 6 &&
    password === confirm

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    navigate('/forgot-password/success')
  }

  return (
    <AuthLayout variant="recover">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Nueva contraseña</h1>
        <p className="auth-form__subtitle">
          Crea una contraseña segura y única para restablecer el acceso a tu cuenta.
        </p>
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
        <PrimaryButton disabled={!isValid}>Continuar</PrimaryButton>
        <BackLink to="/login" />
      </form>
    </AuthLayout>
  )
}
