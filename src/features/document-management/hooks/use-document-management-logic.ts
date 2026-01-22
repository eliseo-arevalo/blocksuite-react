import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useDocuments } from './use-documents';
import { createDocument, deleteDocument, renameDocument } from '../services/document-service';

export const useDocumentManagementLogic = () => {
  const { editor, collection } = useEditorContext();
  const documents = useDocuments();

  const handleDocumentSelect = (doc: Doc) => {
    editor.doc = doc;
  };

  const handleCreateDocument = (title: string) => {
    if (title && title.trim()) {
      const newDoc = createDocument(collection, title.trim());
      editor.doc = newDoc;
      return newDoc;
    }
    return null;
  };

  const handleDeleteDocument = (docId: string) => {
    if (documents.length <= 1) {
      return { success: false, error: 'Cannot delete the last document' };
    }
    
    if (editor.doc?.id === docId) {
      const nextDoc = documents.find(d => d.id !== docId);
      if (nextDoc) editor.doc = nextDoc;
    }
    
    deleteDocument(collection, docId);
    return { success: true };
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    renameDocument(collection, docId, newTitle);
  };

  return {
    documents,
    activeDoc: editor.doc,
    handleDocumentSelect,
    handleCreateDocument,
    handleDeleteDocument,
    handleRenameDocument,
  };
};
