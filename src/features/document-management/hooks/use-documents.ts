import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useDocumentUpdate } from '@shared/contexts/document-update-context';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useDocuments = () => {
  const { collection } = useEditorContext();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const { forceUpdate } = useDocumentUpdate();

  const updateDocuments = useCallback(() => {
    const docs = [...collection.docs.values()].map((blocks) => blocks.getDoc());
    setDocuments(docs);
  }, [collection]);

  useEffect(() => {
    updateDocuments();

    const disposables = [collection.slots.docUpdated.on(updateDocuments)];

    return () => disposables.forEach((d) => d.dispose());
  }, [collection, updateDocuments]);

  // Create document map for O(1) lookups
  const documentMap = useMemo(() => new Map(documents.map((doc) => [doc.id, doc])), [documents]);

  return { documents, documentMap, forceUpdate };
};
