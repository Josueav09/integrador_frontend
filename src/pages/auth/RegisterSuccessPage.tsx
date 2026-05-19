import { AuthLayout } from '../../components/auth/AuthLayout'
import { SuccessScreen } from '../../components/auth/SuccessScreen'

export function RegisterSuccessPage() {
  return (
    <AuthLayout variant="register">
      <SuccessScreen
        title="¡Cuenta creada!"
        message="Tu cuenta ha sido creada exitosamente"
        buttonText="Volver a inicio sesión"
        buttonTo="/login"
      />
    </AuthLayout>
  )
}
