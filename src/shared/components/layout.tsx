import { ReactNode, useState } from 'react';
import { Doc } from '@blocksuite/store';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useEditorConfig } from '@shared/contexts/editor-config-context';

interface LayoutProps {
  children: ReactNode;
  documents: Doc[];
  documentMap: Map<string, Doc>;
  activeDocId?: string;
  onDocumentSelect: (doc: Doc) => void;
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
  const { widthMode } = useEditorConfig();

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
        
        <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''} ${widthMode === 'full' ? 'content-full-width' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
