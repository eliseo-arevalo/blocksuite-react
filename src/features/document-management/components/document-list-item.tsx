import { Doc } from '@blocksuite/store';

interface DocumentListItemProps {
  doc: Doc;
  isActive: boolean;
  onClick: () => void;
}

export const DocumentListItem = ({ doc, isActive, onClick }: DocumentListItemProps) => {
  return (
    <div
      className={`doc-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {doc.meta?.title || 'Untitled'}
    </div>
  );
};
