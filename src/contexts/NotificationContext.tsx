import React, { createContext, useContext, useState, useCallback } from 'react';
import { StatusBanner, type BannerVariant } from '../components/ui/StatusBanner';
import { parseApiError } from '../utils/apiError';

export interface ToastNotification {
  id: string;
  variant: BannerVariant;
  message: string;
}

interface NotificationContextProps {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyApiError: (error: unknown, fallbackMessage?: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((variant: BannerVariant, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, variant, message }]);

    // Timer de auto-cierre (8s para error, 5s para success/info)
    const delay = variant === 'error' ? 8000 : 5000;
    setTimeout(() => {
      removeNotification(id);
    }, delay);
  }, [removeNotification]);

  const notifySuccess = useCallback((message: string) => {
    addNotification('success', message);
  }, [addNotification]);

  const notifyError = useCallback((message: string) => {
    addNotification('error', message);
  }, [addNotification]);

  const notifyInfo = useCallback((message: string) => {
    addNotification('info', message);
  }, [addNotification]);

  const notifyApiError = useCallback((error: unknown, fallbackMessage?: string) => {
    const parsed = parseApiError(error, fallbackMessage);
    addNotification('error', parsed.message);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyInfo, notifyApiError }}>
      {children}
      <div className="notification-host" data-testid="notification-host">
        {notifications.map(n => (
          <StatusBanner
            key={n.id}
            variant={n.variant}
            message={n.message}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
}
