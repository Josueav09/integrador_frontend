type AuthStepIndicatorProps = {
  current: number
  total?: number
}

export function AuthStepIndicator({ current, total = 4 }: AuthStepIndicatorProps) {
  return (
    <p className="auth-step" aria-label={`Paso ${current} de ${total}`}>
      Paso {current} de {total}
    </p>
  )
}
