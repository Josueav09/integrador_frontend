import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import '@testing-library/jest-dom';

describe('LoginPage Component', () => {
  const renderComponent = () => {
    return render(
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    );
  };

  it('debe deshabilitar el botón de login al inicio si los campos están vacíos', () => {
    renderComponent();
    
    const loginBtn = screen.getByRole('button', { name: /Iniciar sesión/i });
    expect(loginBtn).toBeDisabled();
  });

  it('debe alertar sobre correo inválido al perder el foco (onBlur)', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'correo_incorrecto' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/formato del correo institucional/i)).toBeInTheDocument();
  });

  it('debe habilitar el botón cuando el correo y contraseña ingresados son formalmente válidos', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginBtn = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'admin@pnp.gob.pe' } });
    fireEvent.change(passwordInput, { target: { value: 'TesisUTP2026*' } });
    
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(loginBtn).toBeEnabled();
    });
  });
});
