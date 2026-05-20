import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isValid = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    login(email)
    navigate('/dashboard')
  }

  const handleGoogleLogin = () => {
    login('usuario@gmail.com', 'Usuario Google')
    navigate('/dashboard')
  }

  return (
    <AuthLayout variant="login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>¡Bienvenido de nuevo!</h1>
        <GoogleButton onClick={handleGoogleLogin} />
        <p className="auth-divider">o ingresa con tu email</p>
        <TextField
          id="login-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          link={{ href: '/forgot-password', text: '¿Olvidaste?' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <PrimaryButton disabled={!isValid}>Iniciar sesión</PrimaryButton>
        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
