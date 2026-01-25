import { DocumentEditor } from '@features/document-editor/document-editor';
import { useDocumentManagementLogic } from '@features/document-management/hooks/use-document-management-logic';
import { Layout } from '@shared/components/layout';

export const AppContent = () => {
  const {
    documents,
    documentMap,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
    handleRenameDocument,
    handleMoveDocument,
  } = useDocumentManagementLogic();

  const onCreateClick = (title?: string, parentId?: string) => {
    const documentTitle = title || 'New Page';
    return handleCreateDocument(documentTitle, parentId);
  };

  return (
    <Layout
      documents={documents}
      documentMap={documentMap}
      activeDocId={activeDoc?.id}
      onDocumentSelect={handleDocumentSelect}
      onCreateDocument={onCreateClick}
      onRenameDocument={handleRenameDocument}
      onDocumentMove={handleMoveDocument}
    >
      <DocumentEditor />
    </Layout>
  );
};
