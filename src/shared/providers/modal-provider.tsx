import { createContext, useContext, ReactNode } from 'react';
import { useModal } from '@shared/hooks/use-modal';
import { Modal } from '@shared/components/modal';

interface ModalContextType {
  alert: (message: string, title?: string) => Promise<void>;
  confirm: (message: string, title?: string) => Promise<boolean>;
  prompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const { modal, alert, confirm, prompt } = useModal();

  return (
    <ModalContext.Provider value={{ alert, confirm, prompt }}>
      {children}
      {modal && <Modal {...modal} />}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
}
