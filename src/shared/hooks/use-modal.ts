import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  defaultValue?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState | null>(null);

  const alert = (message: string, title = 'Aviso') => {
    return new Promise<void>((resolve) => {
      setModal({
        isOpen: true,
        type: 'alert',
        title,
        message,
        onConfirm: () => {
          setModal(null);
          resolve();
        },
      });
    });
  };

  const confirm = (message: string, title = 'Confirmar') => {
    return new Promise<boolean>((resolve) => {
      setModal({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        },
      });
    });
  };

  const prompt = (message: string, defaultValue = '', title = 'Ingrese valor') => {
    return new Promise<string | null>((resolve) => {
      setModal({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        defaultValue,
        onConfirm: (value) => {
          setModal(null);
          resolve(value || null);
        },
        onCancel: () => {
          setModal(null);
          resolve(null);
        },
      });
    });
  };

  return { modal, alert, confirm, prompt };
}
