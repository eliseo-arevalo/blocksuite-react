import { Doc } from '@blocksuite/store';

interface DocumentListItemProps {
  doc: Doc;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

export const DocumentListItem = ({ doc, isActive, onClick, onDelete, onRename }: DocumentListItemProps) => {
  const handleRename = () => {
    const newTitle = prompt('Enter new title:', doc.meta?.title || 'Untitled');
    if (newTitle && newTitle.trim()) {
      onRename(newTitle.trim());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${doc.meta?.title || 'Untitled'}"?`)) {
      onDelete();
    }
  };

  return (
    <div className={`doc-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="doc-title">{doc.meta?.title || 'Untitled'}</span>
      <div className="doc-actions">
        <button onClick={(e) => { e.stopPropagation(); handleRename(); }}>✏️</button>
        <button onClick={handleDelete}>🗑️</button>
      </div>
    </div>
  );
};
