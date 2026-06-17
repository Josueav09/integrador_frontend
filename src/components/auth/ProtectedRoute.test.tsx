import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../contexts/AuthContext'

function renderProtectedRoute(isAuthenticated: boolean) {
  vi.mocked(useAuth).mockReturnValue({
    user: isAuthenticated ? { email: 'a@pnp.gob.pe', name: 'Admin' } : null,
    isAuthenticated,
    rolId: isAuthenticated ? 1 : null,
    login: vi.fn(),
    logout: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Panel protegido</div>} />
        </Route>
        <Route path="/login" element={<div>Página login</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirige a login si no hay sesión', () => {
    renderProtectedRoute(false)
    expect(screen.getByText('Página login')).toBeInTheDocument()
  })

  it('permite acceso con sesión activa', () => {
    renderProtectedRoute(true)
    expect(screen.getByText('Panel protegido')).toBeInTheDocument()
  })
})
