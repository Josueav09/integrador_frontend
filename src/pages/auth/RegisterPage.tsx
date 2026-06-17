import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'
import { getEmailError, getNameError, getPasswordError } from '../../utils/formValidation'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValid =
    !getNameError(name) &&
    !getEmailError(email) &&
    !getPasswordError(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    const nextNameError = getNameError(name)
    const nextEmailError = getEmailError(email)
    const nextPasswordError = getPasswordError(password)
    setNameError(nextNameError)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextNameError || nextEmailError || nextPasswordError) return

    setError(null)
    setLoading(true)
    try {
      const [nombre, ...apellidoParts] = name.trim().split(/\s+/)
      await apiClient.post('/auth/register', {
        nombre: nombre || name.trim(),
        apellido: apellidoParts.join(' ') || nombre || 'Usuario',
        email: email.trim(),
        password,
      })
      navigate('/register/success', { state: { email: email.trim(), name: name.trim() } })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo crear la cuenta. Intente nuevamente.'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setError('El registro con Google está deshabilitado temporalmente.')
  }

  return (
    <AuthLayout variant="register">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Regístrate</h1>
        <GoogleButton onClick={handleGoogleRegister} />
        <p className="auth-divider">o regístrate con tu email</p>

        {error && (
          <div className="auth-error-banner" role="alert">
            {error}
          </div>
        )}

        <TextField
          id="register-name"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (nameError) setNameError(getNameError(e.target.value))
          }}
          onBlur={() => setNameError(getNameError(name))}
          autoComplete="name"
          fieldError={nameError}
          data-testid="register-name-input"
        />
        <TextField
          id="register-email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(getEmailError(e.target.value))
          }}
          onBlur={() => setEmailError(getEmailError(email))}
          autoComplete="email"
          hint="Debe ser un correo válido con formato usuario@dominio.com"
          fieldError={emailError}
          data-testid="register-email-input"
        />
        <TextField
          id="register-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          showToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(getPasswordError(e.target.value))
          }}
          onBlur={() => setPasswordError(getPasswordError(password))}
          autoComplete="new-password"
          hint="Mínimo 6 caracteres."
          fieldError={passwordError}
          data-testid="register-password-input"
        />
        <PrimaryButton disabled={!isValid || loading} data-testid="register-submit-button">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </PrimaryButton>
        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
