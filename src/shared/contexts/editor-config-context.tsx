import { createContext, useContext, useState, ReactNode } from 'react';

export type FontFamily = 'system' | 'serif' | 'mono';

interface EditorConfigContextType {
  widthMode: 'page' | 'full';
  fontFamily: FontFamily;
  toggleWidthMode: () => void;
  setFontFamily: (font: FontFamily) => void;
}

const EditorConfigContext = createContext<EditorConfigContextType | undefined>(undefined);

export const EditorConfigProvider = ({ children }: { children: ReactNode }) => {
  const [widthMode, setWidthMode] = useState<'page' | 'full'>('page');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');

  const toggleWidthMode = () => {
    setWidthMode(prev => prev === 'page' ? 'full' : 'page');
  };

  return (
    <EditorConfigContext.Provider value={{
      widthMode,
      fontFamily,
      toggleWidthMode,
      setFontFamily
    }}>
      {children}
    </EditorConfigContext.Provider>
  );
};

export const useEditorConfig = () => {
  const context = useContext(EditorConfigContext);
  if (!context) {
    throw new Error('useEditorConfig must be used within EditorConfigProvider');
  }
  return context;
};
