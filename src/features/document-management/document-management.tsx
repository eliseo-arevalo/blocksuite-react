import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useDocuments } from './hooks/use-documents';
import { DocumentList } from './components/document-list';
import { createDocument, deleteDocument, renameDocument } from './services/document-service';

export const DocumentManagement = () => {
  const { editor, collection } = useEditorContext();
  const documents = useDocuments();

  const handleDocumentSelect = (doc: Doc) => {
    editor.doc = doc;
  };

  const handleCreateDocument = () => {
    const title = prompt('Enter document title:');
    if (title && title.trim()) {
      const newDoc = createDocument(collection, title.trim());
      editor.doc = newDoc;
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (documents.length <= 1) {
      alert('Cannot delete the last document');
      return;
    }
    
    if (editor.doc?.id === docId) {
      const nextDoc = documents.find(d => d.id !== docId);
      if (nextDoc) editor.doc = nextDoc;
    }
    
    deleteDocument(collection, docId);
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    renameDocument(collection, docId, newTitle);
  };

  return (
    <div className="document-management">
      <div className="header">
        <span>All Docs</span>
        <button onClick={handleCreateDocument} className="create-btn">+</button>
      </div>
      <DocumentList
        documents={documents}
        activeDoc={editor.doc}
        onDocumentSelect={handleDocumentSelect}
        onDocumentDelete={handleDeleteDocument}
        onDocumentRename={handleRenameDocument}
      />
    </div>
  );
};
