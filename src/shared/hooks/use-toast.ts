import { Toast, ToastOptions, ToastType } from '@shared/models/toast.types';
import { useCallback, useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, options?: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration: options?.duration ?? 3000,
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'success', options),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'error', options),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'warning', options),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'info', options),
    [addToast]
  );

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
