import { Doc } from '@blocksuite/store';
import { DocumentListItem } from './document-list-item';

interface DocumentListProps {
  documents: Doc[];
  activeDoc: Doc | null;
  onDocumentSelect: (doc: Doc) => void;
  onDocumentDelete: (docId: string) => void;
  onDocumentRename: (docId: string, newTitle: string) => void;
}

export const DocumentList = ({ 
  documents, 
  activeDoc, 
  onDocumentSelect,
  onDocumentDelete,
  onDocumentRename
}: DocumentListProps) => {
  return (
    <div className="doc-list">
      {documents.map(doc => (
        <DocumentListItem
          key={doc.id}
          doc={doc}
          isActive={activeDoc === doc}
          onClick={() => onDocumentSelect(doc)}
          onDelete={() => onDocumentDelete(doc.id)}
          onRename={(newTitle) => onDocumentRename(doc.id, newTitle)}
        />
      ))}
    </div>
  );
};
