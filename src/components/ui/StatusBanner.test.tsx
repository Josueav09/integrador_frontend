import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { StatusBanner } from './StatusBanner'

describe('StatusBanner', () => {
  it('muestra mensajes de error con role alert', () => {
    render(<StatusBanner type="error" message="Error de prueba" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Error de prueba')
  })

  it('permite cerrar el mensaje', () => {
    const onDismiss = vi.fn()
    render(<StatusBanner type="success" message="OK" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByLabelText('Cerrar mensaje'))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
