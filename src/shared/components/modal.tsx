import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  defaultValue?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

export function Modal({ isOpen, type, title, message, defaultValue, onConfirm, onCancel }: ModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue || '');

  useEffect(() => {
    setInputValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.(type === 'prompt' ? inputValue : undefined);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        
        {type === 'prompt' && (
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
        )}
        
        <div className="modal-buttons">
          {type !== 'alert' && (
            <button onClick={onCancel}>Cancelar</button>
          )}
          <button onClick={handleConfirm} autoFocus={type !== 'prompt'}>
            {type === 'confirm' ? 'Confirmar' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}
