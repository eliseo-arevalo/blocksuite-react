import { useState, useEffect } from 'react';
import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useDocuments } from './use-documents';
import { createDocument, deleteDocument, renameDocument } from '../services/document-service';

export const useDocumentManagementLogic = () => {
  const { editor, collection } = useEditorContext();
  const { documents, documentMap, forceUpdate } = useDocuments();
  const [activeDoc, setActiveDoc] = useState<Doc | null>(editor.doc);

  // Sync activeDoc with editor.doc changes
  useEffect(() => {
    setActiveDoc(editor.doc);
  }, [editor.doc]);

  // Navigate to document when a link is clicked in the editor
  useEffect(() => {
    const disposable = editor.slots.docLinkClicked.on(({ docId }) => {
      const targetDoc = collection.getDoc(docId);
      if (targetDoc) {
        editor.doc = targetDoc;
        setActiveDoc(targetDoc);
      }
    });
    return () => disposable.dispose();
  }, [editor, collection]);

  const handleDocumentSelect = (doc: Doc) => {
    editor.doc = doc;
    setActiveDoc(doc);
  };

  const handleCreateDocument = (title: string, parentId?: string) => {
    if (title && title.trim()) {
      const newDoc = createDocument(collection, title.trim(), parentId);
      editor.doc = newDoc;
      setActiveDoc(newDoc);
      return newDoc;
    }
    return null;
  };

  const handleDeleteDocument = (docId: string) => {
    if (documents.length <= 1) {
      return { success: false, error: 'Cannot delete the last document' };
    }
    
    if (activeDoc?.id === docId) {
      const nextDoc = documents.find(d => d.id !== docId);
      if (nextDoc) {
        editor.doc = nextDoc;
        setActiveDoc(nextDoc);
      }
    }
    
    deleteDocument(collection, docId);
    return { success: true };
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    renameDocument(collection, docId, newTitle);
    forceUpdate();
  };

  return {
    documents,
    documentMap,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
    handleDeleteDocument,
    handleRenameDocument,
  };
};
