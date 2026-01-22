import { Doc } from '@blocksuite/store';

export interface DocumentItem {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentManagementState {
  documents: Doc[];
  activeDocument: Doc | null;
  isLoading: boolean;
}

export interface DocumentActions {
  onDocumentSelect: (doc: Doc) => void;
  onDocumentDelete: (docId: string) => void;
  onDocumentRename: (docId: string, newTitle: string) => void;
  onDocumentCreate: () => void;
}
