import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { SuccessScreen } from '../../components/auth/SuccessScreen'

type RegisterState = {
  email?: string
  name?: string
}

export function RegisterSuccessPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const { email = 'usuario@gnn.com', name = 'Usuario' } = (location.state as RegisterState) ?? {}

  const handleEnter = () => {
    login(email, name)
    navigate('/dashboard')
  }

  return (
    <AuthLayout variant="register">
      <SuccessScreen
        title="¡Cuenta creada!"
        message="Tu cuenta ha sido creada exitosamente"
        buttonText="Ir al dashboard"
        onButtonClick={handleEnter}
      />
    </AuthLayout>
  )
}
