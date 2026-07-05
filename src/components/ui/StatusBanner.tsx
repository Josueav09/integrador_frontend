type StatusBannerProps = {
  type: 'error' | 'info' | 'success'
  message: string
  onDismiss?: () => void
}

export function StatusBanner({ type, message, onDismiss }: StatusBannerProps) {
  const role = type === 'error' ? 'alert' : 'status'

  return (
    <div className={`status-banner status-banner--${type}`} role={role} data-testid={`status-banner-${type}`}>
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="status-banner__dismiss" onClick={onDismiss} aria-label="Cerrar mensaje">
          ×
        </button>
      )}
    </div>
  )
}
