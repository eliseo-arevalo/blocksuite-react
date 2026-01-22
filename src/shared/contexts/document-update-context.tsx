import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DocumentUpdateContextType {
  forceUpdate: () => void;
}

const DocumentUpdateContext = createContext<DocumentUpdateContextType | null>(null);

export const DocumentUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [, setTrigger] = useState(0);
  
  const forceUpdate = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  return (
    <DocumentUpdateContext.Provider value={{ forceUpdate }}>
      {children}
    </DocumentUpdateContext.Provider>
  );
};

export const useDocumentUpdate = () => {
  const context = useContext(DocumentUpdateContext);
  if (!context) {
    throw new Error('useDocumentUpdate must be used within DocumentUpdateProvider');
  }
  return context;
};
