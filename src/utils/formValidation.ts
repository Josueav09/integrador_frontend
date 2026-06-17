const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export function getEmailError(email: string): string | null {
  const value = email.trim()
  if (!value) return 'El correo electrónico es obligatorio.'
  if (!isValidEmail(value)) return 'Ingresa un correo electrónico válido (ej: usuario@pnp.gob.pe).'
  return null
}

export function getPasswordError(password: string, minLength = 6): string | null {
  if (!password.trim()) return 'La contraseña es obligatoria.'
  if (password.length < minLength) {
    return `La contraseña debe tener al menos ${minLength} caracteres.`
  }
  return null
}

export function getLoginPasswordError(password: string): string | null {
  if (!password.trim()) return 'La contraseña es obligatoria.'
  return null
}

export function getNameError(name: string): string | null {
  if (!name.trim()) return 'El nombre es obligatorio.'
  return null
}
