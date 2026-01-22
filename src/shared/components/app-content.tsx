import { Layout } from '@shared/components/layout';
import { DocumentEditor } from '@features/document-editor/document-editor';
import { useDocumentManagementLogic } from '@features/document-management/hooks/use-document-management-logic';

export const AppContent = () => {
  const {
    documents,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
  } = useDocumentManagementLogic();

  const onCreateClick = () => {
    const title = prompt('Enter document title:');
    if (title) {
      handleCreateDocument(title);
    }
  };

  return (
    <Layout
      documents={documents}
      activeDocId={activeDoc?.id}
      onDocumentSelect={handleDocumentSelect}
      onCreateDocument={onCreateClick}
    >
      <DocumentEditor />
    </Layout>
  );
};
