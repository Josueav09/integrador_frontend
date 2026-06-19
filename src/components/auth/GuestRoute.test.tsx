import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuestRoute } from './GuestRoute';
import { useAuth } from '../../contexts/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('GuestRoute Component', () => {
  it('debe redirigir a /dashboard si el usuario está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      user: { name: 'Josue', email: 'admin@pnp.gob.pe' },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Página de Login</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Panel Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Panel Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).toBeNull();
  });

  it('debe renderizar el contenido público si el usuario NO está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Página de Login</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Panel Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Panel Dashboard')).toBeNull();
  });
});
