import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { getEmailError, getLoginPasswordError } from '../../utils/formValidation'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { notifyApiError, notifySuccess } = useNotification()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEmailBlur = () => {
    setEmailError(getEmailError(email))
  }

  const handlePasswordBlur = () => {
    setPasswordError(getLoginPasswordError(password))
  }

  const isValid = email.trim().length > 0 && password.trim().length > 0 && !emailError && !passwordError

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validar antes de enviar
    const emailErr = getEmailError(email)
    const passErr = getLoginPasswordError(password)
    
    if (emailErr || passErr) {
      setEmailError(emailErr)
      setPasswordError(passErr)
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      notifySuccess('¡Sesión iniciada con éxito!')
      navigate('/dashboard')
    } catch (err: any) {
      notifyApiError(err, 'Fallo al iniciar sesión. Verifique sus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    alert("El inicio de sesión con Google está deshabilitado temporalmente.")
  }

  return (
    <AuthLayout variant="login">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>¡Bienvenido de nuevo!</h1>
        <GoogleButton onClick={handleGoogleLogin} />
        <p className="auth-divider">o ingresa con tu email</p>
        
        <TextField
          id="login-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(null)
          }}
          onBlur={handleEmailBlur}
          autoComplete="email"
          data-testid="login-email-input"
          hint="Usa tu correo institucional registrado en el sistema"
          fieldError={emailError}
        />
        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          link={{ href: '/forgot-password', text: '¿Olvidaste?' }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(null)
          }}
          onBlur={handlePasswordBlur}
          autoComplete="current-password"
          data-testid="login-password-input"
          fieldError={passwordError}
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


