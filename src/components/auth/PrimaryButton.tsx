import type { ButtonHTMLAttributes } from 'react'

type PrimaryButtonProps = {
  disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className="auth-btn auth-btn--primary"
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
