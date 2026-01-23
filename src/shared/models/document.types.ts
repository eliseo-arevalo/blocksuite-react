import { Doc } from '@blocksuite/store';

export interface ExtendedDocMeta {
  title?: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentNode {
  id: string;
  doc: Doc;
  meta: ExtendedDocMeta;
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: TreeNode[];
  isExpanded?: boolean;
}

export interface DocumentHierarchy {
  documents: Doc[];
  documentMap: Map<string, Doc>;
  rootNodes: TreeNode[];
}
