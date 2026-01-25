import { Toast as ToastType } from '@shared/models/toast.types';
import { Toast } from './toast';

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
