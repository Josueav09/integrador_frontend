import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderLogin(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset()
    mockNavigate.mockReset()
  })

  it('deshabilita el botón si faltan credenciales', () => {
    renderLogin()
    expect(screen.getByTestId('login-submit-button')).toBeDisabled()
  })

  it('habilita el botón con email y contraseña', () => {
    renderLogin()
    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'admin@pnp.gob.pe' },
    })
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'clave123' },
    })
    expect(screen.getByTestId('login-submit-button')).not.toBeDisabled()
  })

  it('muestra error cuando falla el login', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'))
    renderLogin()

    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'admin@pnp.gob.pe' },
    })
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'mala-clave' },
    })
    fireEvent.click(screen.getByTestId('login-submit-button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas')
    })
  })

  it('redirige al dashboard tras login exitoso', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    renderLogin()

    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'admin@pnp.gob.pe' },
    })
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'clave123' },
    })
    fireEvent.click(screen.getByTestId('login-submit-button'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@pnp.gob.pe', 'clave123')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})
