import { useMemo, useState, useRef, useEffect } from 'react';
import { Doc } from '@blocksuite/store';
import { Icon } from '@shared/components/icon';
import { useTheme } from '@shared/contexts/theme-context';
import { useEditorContext } from '@infrastructure/editor';
import { ExtendedDocMeta } from '@shared/models/document.types';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  documents: Doc[];
  activeDocId?: string;
  onDocumentSelect: (doc: Doc) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
}

export const Header = ({ 
  onToggleSidebar, 
  isSidebarOpen,
  documents,
  activeDocId,
  onDocumentSelect,
  onRenameDocument
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { collection } = useEditorContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const breadcrumbPath = useMemo(() => {
    if (!activeDocId) return [];

    const path: Array<{ id: string; title: string; doc: any }> = [];
    let currentId: string | null = activeDocId;

    while (currentId) {
      const doc = documents.find(d => d.id === currentId);
      if (!doc) break;

      const meta = collection.meta.getDocMeta(currentId) as ExtendedDocMeta;
      path.unshift({
        id: currentId,
        title: meta?.title || `Document ${currentId.slice(0, 8)}`,
        doc
      });

      currentId = meta?.parentId || null;
    }

    return path;
  }, [activeDocId, documents, collection]);

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.title);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameDocument(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Icon name={isSidebarOpen ? 'close' : 'menu'} size={20} />
        </button>
      </div>
      
      <div className="header-center">
        <div className="header-breadcrumb">
          <Icon name="home" size={14} />
          {breadcrumbPath.map((item, index) => {
            const isLast = index === breadcrumbPath.length - 1;
            const isEditing = editingId === item.id;
            
            return (
              <div key={item.id} className="header-breadcrumb-item">
                <Icon name="chevronRight" size={12} />
                {isEditing ? (
                  <input
                    ref={inputRef}
                    className="header-breadcrumb-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                ) : (
                  <button
                    className="header-breadcrumb-link"
                    onClick={() => onDocumentSelect(item.doc)}
                  >
                    {item.title}
                  </button>
                )}
                {isLast && !isEditing && (
                  <button
                    className="header-edit-btn"
                    onClick={() => startEditing(item)}
                    title="Edit name"
                  >
                    <Icon name="edit" size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
        </button>
      </div>
    </header>
  );
};
