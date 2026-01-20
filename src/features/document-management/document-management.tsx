import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { useDocuments } from './hooks/use-documents';
import { DocumentList } from './components/document-list';

export const DocumentManagement = () => {
  const { editor } = useEditorContext();
  const documents = useDocuments();

  const handleDocumentSelect = (doc: Doc) => {
    editor.doc = doc;
  };

  return (
    <div className="document-management">
      <div className="header">All Docs</div>
      <DocumentList
        documents={documents}
        activeDoc={editor.doc}
        onDocumentSelect={handleDocumentSelect}
      />
    </div>
  );
};
