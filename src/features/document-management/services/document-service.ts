import { Doc, DocCollection, type Text } from '@blocksuite/store';
import { isValidDocId, sanitizeTitle } from '@shared/utils/validation';

const MAX_DEPTH = 4;

const syncTitleToEditor = (doc: Doc, newTitle: string) => {
  try {
    const rootBlock = doc.root as unknown as { title?: Text } | null;
    if (rootBlock?.title) {
      rootBlock.title.clear();
      rootBlock.title.insert(newTitle, 0);
    }
  } catch (error) {
    console.error('Failed to sync title to editor:', error);
  }
};

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

export const createDocument = (collection: DocCollection, title?: string, parentId?: string) => {
  try {
    // Validate parentId if provided
    if (parentId !== undefined && !isValidDocId(parentId)) {
      console.error('Invalid parent ID provided');
      return null;
    }

    // Check if parent exists
    if (parentId && !collection.getDoc(parentId)) {
      console.error('Parent document does not exist');
      return null;
    }

    // Check depth limit if creating as child
    if (parentId) {
      const parentDepth = getDepth(collection, parentId);
      if (parentDepth >= MAX_DEPTH) {
        console.error('Maximum nesting depth reached');
        return null;
      }
    }

    // Sanitize title if provided
    const sanitizedTitle = title ? sanitizeTitle(title) : null;

    const doc = collection.createDoc();
    doc.load(() => {
      const pageBlockId = doc.addBlock('affine:page', {});
      doc.addBlock('affine:surface', {}, pageBlockId);
      const noteId = doc.addBlock('affine:note', {}, pageBlockId);
      doc.addBlock('affine:paragraph', {}, noteId);
    });

    const meta: Record<string, unknown> = {};
    if (sanitizedTitle) {
      meta.title = sanitizedTitle;
      syncTitleToEditor(doc, sanitizedTitle);
    }
    if (parentId) {
      meta.parentId = parentId;
    }

    if (Object.keys(meta).length > 0) {
      collection.setDocMeta(doc.id, meta);
    }

    /**
     * FIX: Prevent editor crash when deleting all content (Ctrl+A → Delete)
     * BlockSuite v0.15 bug: deleting all paragraphs breaks the DOM structure
     * Solution: Auto-recreate an empty paragraph to maintain valid document state
     */
    doc.slots.blockUpdated.on(({ type }) => {
      if (type === 'delete') {
        const page = doc.getBlockByFlavour('affine:page')[0];
        if (page) {
          const notes = doc.getBlockByFlavour('affine:note');
          if (notes.length > 0) {
            const note = notes[0];
            const paragraphs = doc.getBlockByFlavour('affine:paragraph');
            if (paragraphs.length === 0) {
              doc.addBlock('affine:paragraph', {}, note.id);
            }
          }
        }
      }
    });

    return doc;
  } catch (error) {
    console.error('Failed to create document:', error);
    return null;
  }
};

export const deleteDocument = (collection: DocCollection, docId: string) => {
  try {
    // Validate docId
    if (!isValidDocId(docId)) {
      console.error('Invalid document ID provided');
      return false;
    }

    // Check if document exists
    const doc = collection.getDoc(docId);
    if (!doc) {
      console.error('Document does not exist');
      return false;
    }

    collection.removeDoc(docId);
    return true;
  } catch (error) {
    console.error('Failed to delete document:', error);
    return false;
  }
};

export const renameDocument = (collection: DocCollection, docId: string, newTitle: string) => {
  try {
    // Validate docId
    if (!isValidDocId(docId)) {
      console.error('Invalid document ID provided');
      return false;
    }

    // Sanitize title
    const sanitizedTitle = sanitizeTitle(newTitle);
    if (!sanitizedTitle) {
      console.error('Invalid title provided');
      return false;
    }

    // Check if document exists
    const doc = collection.getDoc(docId);
    if (!doc) {
      console.error('Document does not exist');
      return false;
    }

    const existingMeta = collection.meta.getDocMeta(docId) || {};
    collection.setDocMeta(docId, { ...existingMeta, title: sanitizedTitle });
    syncTitleToEditor(doc, sanitizedTitle);
    return true;
  } catch (error) {
    console.error('Failed to rename document:', error);
    return false;
  }
};
