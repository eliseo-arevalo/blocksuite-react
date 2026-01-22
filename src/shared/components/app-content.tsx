import { Layout } from '@shared/components/layout';
import { DocumentEditor } from '@features/document-editor/document-editor';
import { useDocumentManagementLogic } from '@features/document-management/hooks/use-document-management-logic';

export const AppContent = () => {
  const {
    documents,
    activeDoc,
    handleDocumentSelect,
    handleCreateDocument,
    handleRenameDocument,
  } = useDocumentManagementLogic();

  const onCreateClick = (title?: string, parentId?: string) => {
    if (title) {
      handleCreateDocument(title, parentId);
    } else {
      const newTitle = prompt('Enter document title:');
      if (newTitle) {
        handleCreateDocument(newTitle, parentId);
      }
    }
  };

  return (
    <Layout
      documents={documents}
      activeDocId={activeDoc?.id}
      onDocumentSelect={handleDocumentSelect}
      onCreateDocument={onCreateClick}
      onRenameDocument={handleRenameDocument}
    >
      <DocumentEditor />
    </Layout>
  );
};
