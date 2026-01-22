import { ReactNode, useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface LayoutProps {
  children: ReactNode;
  documents: any[];
  documentMap: Map<string, any>;
  activeDocId?: string;
  onDocumentSelect: (doc: any) => void;
  onCreateDocument: (title?: string, parentId?: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
}

export const Layout = ({ 
  children, 
  documents, 
  documentMap,
  activeDocId, 
  onDocumentSelect,
  onCreateDocument,
  onRenameDocument 
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout">
      <Header 
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        documents={documents}
        activeDocId={activeDocId}
        onDocumentSelect={onDocumentSelect}
        onRenameDocument={onRenameDocument}
      />
      
      <div className="layout-body">
        <Sidebar
          isOpen={isSidebarOpen}
          documents={documents}
          documentMap={documentMap}
          activeDocId={activeDocId}
          onDocumentSelect={onDocumentSelect}
          onCreateDocument={onCreateDocument}
        />
        
        <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
