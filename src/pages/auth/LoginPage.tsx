import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const state = location.state as { email?: string; message?: string } | null
    if (state?.email) setEmail(state.email)
    if (state?.message) setInfo(state.message)
    if (searchParams.get('session') === 'expired') {
      setInfo('Tu sesión expiró. Inicia sesión nuevamente.')
    }
  }, [location.state, searchParams])

  const isValid = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError('El inicio de sesión con Google está deshabilitado temporalmente.')
  }

  return (
    <AuthLayout variant="login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>¡Bienvenido de nuevo!</h1>
        <GoogleButton onClick={handleGoogleLogin} />
        <p className="auth-divider">o ingresa con tu email</p>

        {info && <div className="auth-info-banner" role="status">{info}</div>}
        {error && <div className="auth-error-banner" role="alert">{error}</div>}

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
