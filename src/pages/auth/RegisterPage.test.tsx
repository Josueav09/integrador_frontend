import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPage } from './RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../../contexts/NotificationContext';
import '@testing-library/jest-dom';

describe('RegisterPage Component', () => {
  const renderComponent = () => {
    return render(
      <NotificationProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </NotificationProvider>
    );
  };

  it('debe mostrar errores de contraseña menor a 6 caracteres al perder el foco (onBlur)', async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText('Contraseña');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('debe deshabilitar el botón de crear cuenta al inicio si los campos están vacíos', () => {
    renderComponent();
    
    const submitBtn = screen.getByRole('button', { name: /Crear cuenta/i });
    expect(submitBtn).toBeDisabled();
  });
});
