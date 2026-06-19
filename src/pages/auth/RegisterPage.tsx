import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotification } from '../../contexts/NotificationContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleButton } from '../../components/auth/GoogleButton'
import { TextField } from '../../components/auth/TextField'
import { PrimaryButton } from '../../components/auth/PrimaryButton'
import { getEmailError, getPasswordError, getNameError } from '../../utils/formValidation'

export function RegisterPage() {
  const navigate = useNavigate()
  const { notifySuccess } = useNotification()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleNameBlur = () => {
    setNameError(getNameError(name))
  }

  const handleEmailBlur = () => {
    setEmailError(getEmailError(email))
  }

  const handlePasswordBlur = () => {
    setPasswordError(getPasswordError(password))
  }

  const isValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    !nameError &&
    !emailError &&
    !passwordError

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const nErr = getNameError(name)
    const eErr = getEmailError(email)
    const pErr = getPasswordError(password)

    if (nErr || eErr || pErr) {
      setNameError(nErr)
      setEmailError(eErr)
      setPasswordError(pErr)
      return
    }

    notifySuccess('¡Registro completado de forma simulada!')
    navigate('/register/success', { state: { email, name } })
  }

  const handleGoogleRegister = () => {
    notifySuccess('¡Registro con Google exitoso!')
    navigate('/register/success', {
      state: { email: 'usuario@gmail.com', name: 'Usuario Google' },
    })
  }

  return (
    <AuthLayout variant="register">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Regístrate</h1>
        <GoogleButton onClick={handleGoogleRegister} />
        <p className="auth-divider">o regístrate con tu email</p>
        <TextField
          id="register-name"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (nameError) setNameError(null)
          }}
          onBlur={handleNameBlur}
          autoComplete="name"
          data-testid="register-name-input"
          fieldError={nameError}
        />
        <TextField
          id="register-email"
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
          data-testid="register-email-input"
          hint="Ingresa tu correo institucional"
          fieldError={emailError}
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
            if (passwordError) setPasswordError(null)
          }}
          onBlur={handlePasswordBlur}
          autoComplete="new-password"
          data-testid="register-password-input"
          hint="La contraseña debe tener al menos 6 caracteres"
          fieldError={passwordError}
        />
        <PrimaryButton disabled={!isValid} data-testid="register-submit-button">Crear cuenta</PrimaryButton>
        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

