import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useToastContext } from '@shared/providers/toast-provider';
import { useEffect, useState } from 'react';
import { moveDocument } from '../services/document-move-service';
import { createDocument, deleteDocument, renameDocument } from '../services/document-service';
import { useDocuments } from './use-documents';

export const useDocumentManagementLogic = () => {
  const { editor, collection } = useEditorContext();
  const { documents, documentMap, forceUpdate } = useDocuments();
  const toast = useToastContext();
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
      if (!newDoc) {
        toast.error('Cannot create: maximum nesting depth (4 levels) reached');
        return null;
      }
      editor.doc = newDoc;
      setActiveDoc(newDoc);
      toast.success(`Document "${title.trim()}" created successfully`);
      return newDoc;
    }
    return null;
  };

  const handleDeleteDocument = (docId: string) => {
    if (documents.length <= 1) {
      toast.error('Cannot delete the last document');
      return { success: false, error: 'Cannot delete the last document' };
    }

    const docTitle = documentMap.get(docId)?.title || 'Document';

    if (activeDoc?.id === docId) {
      const nextDoc = documents.find((d) => d.id !== docId);
      if (nextDoc) {
        editor.doc = nextDoc;
        setActiveDoc(nextDoc);
      }
    }

    deleteDocument(collection, docId);
    toast.success(`"${docTitle}" deleted successfully`);
    return { success: true };
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    renameDocument(collection, docId, newTitle);
    forceUpdate();
    toast.info(`Document renamed to "${newTitle}"`);
  };

  const handleMoveDocument = (docId: string, newParentId: string | null) => {
    const success = moveDocument(collection, docId, newParentId);

    if (success) {
      forceUpdate();

      const docTitle = documentMap.get(docId)?.title || 'Document';
      if (newParentId) {
        const parentTitle = documentMap.get(newParentId)?.title || 'Document';
        toast.success(`"${docTitle}" moved into "${parentTitle}"`);
      } else {
        toast.success(`"${docTitle}" moved to root`);
      }
    } else {
      toast.error('Cannot move: maximum nesting depth (4 levels) or circular reference');
    }
  };

  return {
    documents,
    documentMap,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
    handleDeleteDocument,
    handleRenameDocument,
    handleMoveDocument,
  };
};
