import { useModalContext } from '@shared/providers/modal-provider';
import { DocumentList } from './components/document-list';
import { useDocumentManagementLogic } from './hooks/use-document-management-logic';

export const DocumentManagement = () => {
  const {
    documents,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
    handleDeleteDocument,
    handleRenameDocument,
  } = useDocumentManagementLogic();

  const { alert } = useModalContext();

  const onCreateClick = () => {
    handleCreateDocument('New Page');
  };

  const onDeleteClick = async (docId: string) => {
    const result = handleDeleteDocument(docId);
    if (!result.success && result.error) {
      await alert(result.error);
    }
  };

  return (
    <div className="document-management">
      <div className="header">
        <span>All Docs</span>
        <button onClick={onCreateClick} className="create-btn">
          +
        </button>
      </div>
      <DocumentList
        documents={documents}
        activeDoc={activeDoc}
        onDocumentSelect={handleDocumentSelect}
        onDocumentDelete={onDeleteClick}
        onDocumentRename={handleRenameDocument}
      />
    </div>
  );
};
