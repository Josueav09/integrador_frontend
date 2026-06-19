

export type BannerVariant = 'error' | 'success' | 'info';

export interface StatusBannerProps {
  variant: BannerVariant;
  message: string;
  onClose?: () => void;
}

export function StatusBanner({ variant, message, onClose }: StatusBannerProps) {
  if (!message) return null;

  // Determinar rol semántico de accesibilidad
  const role = variant === 'error' ? 'alert' : 'status';

  // Determinar clase de estilo CSS
  const bannerClass = `status-banner status-banner--${variant}`;

  return (
    <div className={bannerClass} role={role}>
      <span className="status-banner__message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="status-banner__close-btn"
          onClick={onClose}
          aria-label="Cerrar banner de notificación"
        >
          &times;
        </button>
      )}
    </div>
  );
}
