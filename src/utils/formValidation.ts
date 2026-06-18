export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function getEmailError(email: string): string | null {
  if (!email) {
    return 'El correo electrónico es obligatorio.';
  }
  if (!isValidEmail(email)) {
    return 'El formato del correo institucional es incorrecto.';
  }
  return null;
}

export function getPasswordError(password: string): string | null {
  if (!password) {
    return 'La contraseña es obligatoria.';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  return null;
}

export function getLoginPasswordError(password: string): string | null {
  if (!password) {
    return 'La contraseña es obligatoria.';
  }
  return null;
}

export function getNameError(name: string): string | null {
  if (!name.trim()) {
    return 'El nombre es obligatorio.';
  }
  return null;
}
