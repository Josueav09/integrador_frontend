import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { apiClient } from '../api/client';
import '@testing-library/jest-dom';

vi.mock('../api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
  AUTH_STORAGE_KEY: 'test_auth_key',
}));

const TestingComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Auth' : 'NoAuth'}</span>
      <span data-testid="user-email">{user?.email || 'Guest'}</span>
      <button onClick={() => login('test@pnp.gob.pe', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe iniciar sin autenticación si localstorage está vacío', () => {
    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('NoAuth');
    expect(screen.getByTestId('user-email')).toHaveTextContent('Guest');
  });

  it('debe autenticar al usuario tras una llamada exitosa de login', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { access_token: 'fake_jwt_token', token_type: 'bearer' },
    });

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByRole('button', { name: 'Login' });
    await act(async () => {
      loginBtn.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Auth');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@pnp.gob.pe');
  });

  it('debe limpiar los datos del usuario tras hacer logout', () => {
    localStorage.setItem(
      'test_auth_key',
      JSON.stringify({
        access_token: 'fake_token',
        user: { email: 'admin@pnp.gob.pe', name: 'admin' },
      })
    );

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Auth');
    
    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    act(() => {
      logoutBtn.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('NoAuth');
    expect(localStorage.getItem('test_auth_key')).toBeNull();
  });
});
