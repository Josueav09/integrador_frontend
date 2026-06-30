import { useState, type InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type TextFieldProps = {
  label: string
  link?: { href: string; text: string }
  showToggle?: boolean
  hint?: string
  fieldError?: string | null
  errorTestId?: string
} & InputHTMLAttributes<HTMLInputElement>

export function TextField({
  label,
  link,
  showToggle,
  hint,
  fieldError,
  errorTestId,
  type = 'text',
  className,
  ...props
}: TextFieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showToggle && visible ? 'text' : type

  return (
    <div className="auth-field">
      <div className="auth-field__label-row">
        <label htmlFor={props.id}>{label}</label>
        {link && (
          <Link to={link.href} className="auth-field__link">
            {link.text}
          </Link>
        )}
      </div>
      <div className="auth-field__input-wrap">
        <input
          {...props}
          type={inputType}
          className={`${showToggle && isPassword ? 'has-toggle' : ''} ${fieldError ? 'input--error' : ''} ${className ?? ''}`}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={
            fieldError ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
          }
        />
        {showToggle && isPassword && (
          <button
            type="button"
            className="auth-field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {visible ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                  <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.45 18.45 0 0 1-4.11 5.17M6.12 6.12A18.45 18.45 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 2.12-.27" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {fieldError ? (
        <p
          id={`${props.id}-error`}
          className="auth-field__hint auth-field__hint--error"
          role="alert"
          data-testid={errorTestId}
        >
          {fieldError}
        </p>
      ) : hint ? (
        <p id={`${props.id}-hint`} className="auth-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
