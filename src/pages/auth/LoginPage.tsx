import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { getEmailError, getLoginPasswordError } from '../../utils/formValidation'
import { useNotification } from '../../contexts/NotificationContext'
import { useTranslation } from '../../contexts/PreferencesContext'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const { notifySuccess } = useNotification()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const state = location.state as { email?: string; message?: string } | null
    if (state?.email) setEmail(state.email)
    if (state?.message) setInfo(state.message)
    if (searchParams.get('session') === 'expired') {
      setInfo(t('auth.sessionExpired'))
    }
  }, [location.state, searchParams, t])

  const isValid =
    !getEmailError(email) &&
    !getLoginPasswordError(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    const nextEmailError = getEmailError(email)
    const nextPasswordError = getLoginPasswordError(password)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      await login(email, password)
      notifySuccess('Sesión iniciada con éxito')
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
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>{t('auth.welcome')}</h1>
        <GoogleButton onClick={handleGoogleLogin} />
        <p className="auth-divider">{t('auth.orEmail')}</p>

        {info && <div className="auth-info-banner" role="status">{info}</div>}
        {error && <div className="auth-error-banner" role="alert">{error}</div>}

        <TextField
          id="login-email"
          label={t('auth.email')}
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(getEmailError(e.target.value))
          }}
          onBlur={() => setEmailError(getEmailError(email))}
          autoComplete="email"
          hint={t('auth.emailHint')}
          fieldError={emailError}
          errorTestId="login-email-error"
          data-testid="login-email-input"
        />
        <TextField
          id="login-password"
          label={t('auth.password')}
          type="password"
          placeholder="••••••••"
          showToggle
          link={{ href: '/forgot-password', text: t('auth.forgot') }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(getLoginPasswordError(e.target.value))
          }}
          onBlur={() => setPasswordError(getLoginPasswordError(password))}
          autoComplete="current-password"
          fieldError={passwordError}
          data-testid="login-password-input"
        />
        <PrimaryButton disabled={!isValid || loading} data-testid="login-submit-button">
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </PrimaryButton>
        <p className="auth-footer">
          {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
