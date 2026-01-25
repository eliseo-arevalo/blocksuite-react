import { Toast as ToastType } from '@shared/models/toast.types';
import { useEffect, useState } from 'react';
import { Icon } from './icon';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 3000;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [toast, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'CheckCircle2';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
    }
  };

  const getColorClass = () => {
    switch (toast.type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
    }
  };

  return (
    <div
      className={`toast ${getColorClass()} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">
        <Icon name={getIcon()} size={20} />
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">
        <Icon name="X" size={16} />
      </button>
    </div>
  );
}
