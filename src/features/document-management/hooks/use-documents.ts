import { useEffect, useState, useCallback } from 'react';
import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';

export const useDocuments = () => {
  const { collection, editor } = useEditorContext();
  const [documents, setDocuments] = useState<Doc[]>([]);

  const updateDocuments = useCallback(() => {
    const docs = [...collection.docs.values()].map(blocks => blocks.getDoc());
    setDocuments(prevDocs => {
      // Only update if documents actually changed
      if (prevDocs.length !== docs.length || 
          prevDocs.some((doc, i) => doc.id !== docs[i]?.id)) {
        return docs;
      }
      return prevDocs;
    });
  }, [collection]);

  useEffect(() => {
    updateDocuments();

    const disposables = [
      collection.slots.docUpdated.on(updateDocuments),
      editor.slots.docLinkClicked.on(updateDocuments),
    ];

    return () => disposables.forEach(d => d.dispose());
  }, [collection, editor, updateDocuments]);

  return documents;
};
