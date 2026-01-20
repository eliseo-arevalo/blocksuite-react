import React, { useMemo } from 'react';
import { createEditorInstance } from './editor-factory';
import { EditorContext } from './editor-context';

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * FIX: Create editor instance only once using useMemo
   * Issue: Re-creating editor on every render causes state loss
   * Solution: Memoize editor instance to maintain stable reference
   */
  const editorInstance = useMemo(() => createEditorInstance(), []);

  return (
    <EditorContext.Provider value={editorInstance}>
      {children}
    </EditorContext.Provider>
  );
};
