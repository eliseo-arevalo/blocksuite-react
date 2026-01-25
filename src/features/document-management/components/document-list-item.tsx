import { Doc } from '@blocksuite/store';
import { useModalContext } from '@shared/providers/modal-provider';

interface DocumentListItemProps {
  doc: Doc;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

export const DocumentListItem = ({
  doc,
  isActive,
  onClick,
  onDelete,
  onRename,
}: DocumentListItemProps) => {
  const { prompt, confirm } = useModalContext();

  const handleRename = async () => {
    const newTitle = await prompt('Enter new title:', doc.meta?.title || 'Untitled');
    if (newTitle && newTitle.trim()) {
      onRename(newTitle.trim());
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm(`Delete "${doc.meta?.title || 'Untitled'}"?`);
    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className={`doc-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="doc-title">{doc.meta?.title || 'Untitled'}</span>
      <div className="doc-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRename();
          }}
        >
          ✏️
        </button>
        <button onClick={handleDelete}>🗑️</button>
      </div>
    </div>
  );
};
