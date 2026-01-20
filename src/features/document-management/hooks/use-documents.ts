import { useEffect, useState } from 'react';
import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';

export const useDocuments = () => {
  const { collection, editor } = useEditorContext();
  const [documents, setDocuments] = useState<Doc[]>([]);

  useEffect(() => {
    const updateDocuments = () => {
      const docs = [...collection.docs.values()].map(blocks => blocks.getDoc());
      setDocuments(docs);
    };

    updateDocuments();

    const disposables = [
      collection.slots.docUpdated.on(updateDocuments),
      editor.slots.docLinkClicked.on(updateDocuments),
    ];

    return () => disposables.forEach(d => d.dispose());
  }, [collection, editor]);

  return documents;
};
