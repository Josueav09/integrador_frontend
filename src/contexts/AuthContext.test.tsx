import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import { AUTH_STORAGE_KEY } from '../api/session'
import { apiClient } from '../api/client'

vi.mock('../api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(apiClient.post).mockReset()
  })

  it('login guarda la sesión en localStorage', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { access_token: 'token-abc', rol_id: 1 },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('admin@pnp.gob.pe', 'clave123')
    })

    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}')
    expect(stored.access_token).toBe('token-abc')
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.rolId).toBe(1)
  })

  it('logout limpia la sesión', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { access_token: 'token-abc', rol_id: 2 },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('analista@pnp.gob.pe', 'clave123')
    })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('propaga mensaje de error del backend', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { data: { detail: 'Credenciales inválidas' } },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await expect(
      act(async () => {
        await result.current.login('admin@pnp.gob.pe', 'mala')
      }),
    ).rejects.toThrow('Credenciales inválidas')
  })
})
