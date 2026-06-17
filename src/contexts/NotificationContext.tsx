import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { StatusBanner } from '../components/ui/StatusBanner'
import { getApiErrorMessage } from '../utils/apiError'

export type NotificationType = 'error' | 'info' | 'success'

type NotificationItem = {
  id: string
  type: NotificationType
  message: string
}

type NotificationContextValue = {
  notify: (type: NotificationType, message: string, durationMs?: number) => void
  notifyError: (message: string) => void
  notifySuccess: (message: string) => void
  notifyInfo: (message: string) => void
  notifyApiError: (error: unknown, fallback?: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const DEFAULT_DURATION: Record<NotificationType, number> = {
  error: 8000,
  info: 5000,
  success: 5000,
}

function NotificationHost({
  items,
  onDismiss,
}: {
  items: NotificationItem[]
  onDismiss: (id: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="notification-host" aria-live="polite" data-testid="notification-host">
      {items.map((item) => (
        <StatusBanner
          key={item.id}
          type={item.type}
          message={item.message}
          onDismiss={() => onDismiss(item.id)}
        />
      ))}
    </div>
  )
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const notify = useCallback(
    (type: NotificationType, message: string, durationMs?: number) => {
      const id = crypto.randomUUID()
      setItems((prev) => [...prev, { id, type, message }])
      const duration = durationMs ?? DEFAULT_DURATION[type]
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const notifyError = useCallback((message: string) => notify('error', message), [notify])
  const notifySuccess = useCallback((message: string) => notify('success', message), [notify])
  const notifyInfo = useCallback((message: string) => notify('info', message), [notify])

  const notifyApiError = useCallback(
    (error: unknown, fallback = 'Ocurrió un error inesperado') => {
      notifyError(getApiErrorMessage(error, fallback))
    },
    [notifyError],
  )

  const value = useMemo(
    () => ({ notify, notifyError, notifySuccess, notifyInfo, notifyApiError }),
    [notify, notifyError, notifySuccess, notifyInfo, notifyApiError],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationHost items={items} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
