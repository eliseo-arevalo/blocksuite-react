import { Doc } from '@blocksuite/store';
import { DocumentListItem } from './document-list-item';

interface DocumentListProps {
  documents: Doc[];
  activeDoc: Doc | null;
  onDocumentSelect: (doc: Doc) => void;
}

export const DocumentList = ({ documents, activeDoc, onDocumentSelect }: DocumentListProps) => {
  return (
    <div className="doc-list">
      {documents.map(doc => (
        <DocumentListItem
          key={doc.id}
          doc={doc}
          isActive={activeDoc === doc}
          onClick={() => onDocumentSelect(doc)}
        />
      ))}
    </div>
  );
};
