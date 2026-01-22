import { useEffect, useState, useCallback } from 'react';
import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';

export const useDocuments = () => {
  const { collection, editor } = useEditorContext();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const updateDocuments = useCallback(() => {
    const docs = [...collection.docs.values()].map(blocks => blocks.getDoc());
    setDocuments(docs);
  }, [collection, updateTrigger]);

  useEffect(() => {
    updateDocuments();

    const disposables = [
      collection.slots.docUpdated.on(updateDocuments),
      editor.slots.docLinkClicked.on(updateDocuments),
    ];

    return () => disposables.forEach(d => d.dispose());
  }, [collection, editor, updateDocuments]);

  // Expose forceUpdate for external use
  (window as any).__forceDocumentsUpdate = forceUpdate;

  return documents;
};
