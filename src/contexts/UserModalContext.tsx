import { createContext, useContext, useState, type ReactNode } from 'react'

type UserModalContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const UserModalContext = createContext<UserModalContextValue | null>(null)

export function UserModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <UserModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </UserModalContext.Provider>
  )
}

export function useUserModal() {
  const ctx = useContext(UserModalContext)
  if (!ctx) throw new Error('useUserModal must be used within UserModalProvider')
  return ctx
}
