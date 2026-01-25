import { ToastContainer } from '@shared/components/toast-container';
import { useToast } from '@shared/hooks/use-toast';
import { ToastOptions } from '@shared/models/toast.types';
import { createContext, ReactNode, useContext } from 'react';

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, success, error, warning, info, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}
