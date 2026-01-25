import { DocCollection } from '@blocksuite/store';
import { isValidDocId, isValidParentId } from '@shared/utils/validation';

/**
 * Moves a document to a new parent or to root level
 */
const MAX_DEPTH = 4;

export const moveDocument = (
  collection: DocCollection,
  docId: string,
  newParentId: string | null
) => {
  try {
    // Validate docId
    if (!isValidDocId(docId)) {
      console.error('Invalid document ID provided');
      return false;
    }

    // Validate newParentId
    if (!isValidParentId(newParentId)) {
      console.error('Invalid parent ID provided');
      return false;
    }

    // Check if document exists
    const doc = collection.getDoc(docId);
    if (!doc) {
      console.error('Document does not exist');
      return false;
    }

    // Check if new parent exists (if provided)
    if (newParentId && !collection.getDoc(newParentId)) {
      console.error('Parent document does not exist');
      return false;
    }

    const existingMeta = (collection.meta.getDocMeta(docId) || {}) as Record<string, unknown>;

    // Prevent circular reference
    if (newParentId && isDescendant(collection, newParentId, docId)) {
      console.error('Cannot move document into its own descendant');
      return false;
    }

    // Check depth limit
    if (newParentId) {
      const depth = getDepth(collection, newParentId);
      if (depth >= MAX_DEPTH) {
        console.error('Maximum nesting depth reached');
        return false;
      }
    }

    // Update parent
    if (newParentId) {
      collection.setDocMeta(docId, { ...existingMeta, parentId: newParentId });
    } else {
      collection.setDocMeta(docId, { ...existingMeta, parentId: undefined });
    }

    return true;
  } catch (error) {
    console.error('Failed to move document:', error);
    return false;
  }
};

/**
 * Check if targetId is a descendant of sourceId (prevents circular references)
 */
const isDescendant = (collection: DocCollection, targetId: string, sourceId: string): boolean => {
  let currentId: string | null = targetId;

  while (currentId) {
    if (currentId === sourceId) return true;

    const meta = collection.meta.getDocMeta(currentId) as { parentId?: string } | null;
    currentId = meta?.parentId || null;
  }

  return false;
};

/**
 * Calculate the depth of a document in the hierarchy (root = 0)
 */
const getDepth = (collection: DocCollection, docId: string): number => {
  let depth = 0;
  let currentId: string | null = docId;

  while (currentId) {
    const meta = collection.meta.getDocMeta(currentId) as { parentId?: string } | null;
    currentId = meta?.parentId || null;
    if (currentId) depth++;
  }

  return depth;
};
