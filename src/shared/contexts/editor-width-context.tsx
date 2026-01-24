import { createContext, useContext, useState, ReactNode } from 'react';

export type EditorWidthMode = 'page' | 'full';

interface EditorWidthContextType {
  widthMode: EditorWidthMode;
  toggleWidthMode: () => void;
  isFullWidth: boolean;
}

const EditorWidthContext = createContext<EditorWidthContextType | undefined>(undefined);

export const EditorWidthProvider = ({ children }: { children: ReactNode }) => {
  const [widthMode, setWidthMode] = useState<EditorWidthMode>('page');

  const toggleWidthMode = () => {
    setWidthMode(prev => prev === 'page' ? 'full' : 'page');
  };

  return (
    <EditorWidthContext.Provider value={{
      widthMode,
      toggleWidthMode,
      isFullWidth: widthMode === 'full'
    }}>
      {children}
    </EditorWidthContext.Provider>
  );
};

export const useEditorWidth = () => {
  const context = useContext(EditorWidthContext);
  if (!context) {
    throw new Error('useEditorWidth must be used within EditorWidthProvider');
  }
  return context;
};
