import { Link } from 'react-router-dom'

type SuccessScreenProps = {
  title: string
  message: string
  buttonText: string
  buttonTo?: string
  onButtonClick?: () => void
}

export function SuccessScreen({
  title,
  message,
  buttonText,
  buttonTo,
  onButtonClick,
}: SuccessScreenProps) {
  return (
    <div className="auth-form auth-success">
      <div className="auth-success__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1>{title}</h1>
      <p>{message}</p>
      {onButtonClick ? (
        <button type="button" className="auth-btn auth-btn--primary auth-success__btn" onClick={onButtonClick}>
          {buttonText}
        </button>
      ) : (
        <Link to={buttonTo ?? '/login'} className="auth-btn auth-btn--primary auth-success__btn">
          {buttonText}
        </Link>
      )}
    </div>
  )
}
