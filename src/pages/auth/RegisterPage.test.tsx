import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'
import { apiClient } from '../../api/client'

const mockNavigate = vi.fn()

vi.mock('../../api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderRegister() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset()
    mockNavigate.mockReset()
  })

  it('deshabilita el botón con datos incompletos', () => {
    renderRegister()
    fireEvent.change(screen.getByTestId('register-name-input'), { target: { value: 'Juan' } })
    expect(screen.getByTestId('register-submit-button')).toBeDisabled()
  })

  it('habilita el botón con formulario válido', () => {
    renderRegister()
    fireEvent.change(screen.getByTestId('register-name-input'), { target: { value: 'Juan Pérez' } })
    fireEvent.change(screen.getByTestId('register-email-input'), {
      target: { value: 'juan@pnp.gob.pe' },
    })
    fireEvent.change(screen.getByTestId('register-password-input'), {
      target: { value: 'clave123' },
    })
    expect(screen.getByTestId('register-submit-button')).not.toBeDisabled()
  })

  it('muestra error del backend al fallar el registro', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { data: { detail: 'El correo ya está registrado' } },
    })

    renderRegister()
    fireEvent.change(screen.getByTestId('register-name-input'), { target: { value: 'Juan Pérez' } })
    fireEvent.change(screen.getByTestId('register-email-input'), {
      target: { value: 'juan@pnp.gob.pe' },
    })
    fireEvent.change(screen.getByTestId('register-password-input'), {
      target: { value: 'clave123' },
    })
    fireEvent.click(screen.getByTestId('register-submit-button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('El correo ya está registrado')
    })
  })
})
