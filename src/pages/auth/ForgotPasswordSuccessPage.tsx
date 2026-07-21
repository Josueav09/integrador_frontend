import { AuthLayout } from '../../components/auth/AuthLayout'
import { AuthStepIndicator } from '../../components/auth/AuthStepIndicator'
import { SuccessScreen } from '../../components/auth/SuccessScreen'

export function ForgotPasswordSuccessPage() {
  return (
    <AuthLayout variant="recover">
      <AuthStepIndicator current={4} />
      <SuccessScreen
        title="¡Todo listo!"
        message="Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña."
        buttonText="Volver a iniciar sesión"
        buttonTo="/login"
      />
    </AuthLayout>
  )
}
