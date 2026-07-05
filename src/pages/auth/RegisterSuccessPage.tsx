import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { SuccessScreen } from '../../components/auth/SuccessScreen'

type RegisterState = {
  email?: string
  name?: string
}

export function RegisterSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email = 'usuario@gnn.com' } = (location.state as RegisterState) ?? {}

  const handleEnter = () => {
    navigate('/login', {
      state: { email, message: 'Cuenta creada. Inicia sesión con tu correo y contraseña.' },
    })
  }

  return (
    <AuthLayout variant="register">
      <SuccessScreen
        title="¡Cuenta creada!"
        message="Tu cuenta ha sido creada exitosamente. Inicia sesión para acceder al panel."
        buttonText="Ir a iniciar sesión"
        onButtonClick={handleEnter}
      />
    </AuthLayout>
  )
}
