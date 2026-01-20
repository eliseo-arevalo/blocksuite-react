import React from 'react';
import { createEditorInstance } from './editor-factory';
import { EditorContext } from './editor-context';

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { editor, collection } = createEditorInstance();

  return (
    <EditorContext.Provider value={{ editor, collection }}>
      {children}
    </EditorContext.Provider>
  );
};
