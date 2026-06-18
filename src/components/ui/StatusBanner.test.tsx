import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBanner } from './StatusBanner';
import '@testing-library/jest-dom';

describe('StatusBanner Component', () => {
  it('no debe renderizar nada si el mensaje está vacío', () => {
    const { container } = render(<StatusBanner variant="info" message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('debe mostrar el mensaje y tener rol alert si es de tipo error', () => {
    render(<StatusBanner variant="error" message="Ha ocurrido un error crítico" />);
    
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText('Ha ocurrido un error crítico')).toBeInTheDocument();
    expect(banner).toHaveClass('status-banner--error');
  });

  it('debe disparar la función onClose al hacer clic en cerrar', () => {
    const handleClose = vi.fn();
    render(<StatusBanner variant="success" message="Exito" onClose={handleClose} />);
    
    const closeBtn = screen.getByRole('button', { name: /Cerrar/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
