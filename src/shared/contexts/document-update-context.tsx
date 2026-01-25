import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface DocumentUpdateContextType {
  forceUpdate: () => void;
  updateTrigger: number;
}

const DocumentUpdateContext = createContext<DocumentUpdateContextType | null>(null);

export const DocumentUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [updateTrigger, setTrigger] = useState(0);

  const forceUpdate = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  return (
    <DocumentUpdateContext.Provider value={{ forceUpdate, updateTrigger }}>
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
