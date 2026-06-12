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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValid = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    alert("El inicio de sesión con Google está deshabilitado temporalmente.")
  }

  return (
    <AuthLayout variant="login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>¡Bienvenido de nuevo!</h1>
        <GoogleButton onClick={handleGoogleLogin} />
        <p className="auth-divider">o ingresa con tu email</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <TextField
          id="login-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          data-testid="login-email-input"
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
          data-testid="login-password-input"
        />
        <PrimaryButton disabled={!isValid || loading} data-testid="login-submit-button">
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </PrimaryButton>
        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

