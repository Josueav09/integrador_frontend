import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isValid =
    name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    navigate('/register/success', { state: { email, name } })
  }

  const handleGoogleRegister = () => {
    navigate('/register/success', {
      state: { email: 'usuario@gmail.com', name: 'Usuario Google' },
    })
  }

  return (
    <AuthLayout variant="register">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Regístrate</h1>
        <GoogleButton onClick={handleGoogleRegister} />
        <p className="auth-divider">o regístrate con tu email</p>
        <TextField
          id="register-name"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <TextField
          id="register-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          id="register-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <PrimaryButton disabled={!isValid}>Crear cuenta</PrimaryButton>
        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
