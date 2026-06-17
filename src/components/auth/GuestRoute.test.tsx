import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { GuestRoute } from './GuestRoute'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../contexts/AuthContext'

function renderGuestRoute(isAuthenticated: boolean) {
  vi.mocked(useAuth).mockReturnValue({
    user: isAuthenticated ? { email: 'a@pnp.gob.pe', name: 'Admin' } : null,
    isAuthenticated,
    rolId: isAuthenticated ? 1 : null,
    login: vi.fn(),
    logout: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>Formulario login</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GuestRoute', () => {
  it('muestra login para usuarios no autenticados', () => {
    renderGuestRoute(false)
    expect(screen.getByText('Formulario login')).toBeInTheDocument()
  })

  it('redirige al dashboard si ya hay sesión', () => {
    renderGuestRoute(true)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
