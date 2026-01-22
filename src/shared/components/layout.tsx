import { ReactNode, useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface LayoutProps {
  children: ReactNode;
  documents: any[];
  activeDocId?: string;
  onDocumentSelect: (doc: any) => void;
  onCreateDocument: () => void;
}

export const Layout = ({ 
  children, 
  documents, 
  activeDocId, 
  onDocumentSelect,
  onCreateDocument 
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
      />
      
      <div className="layout-body">
        <Sidebar
          isOpen={isSidebarOpen}
          documents={documents}
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
