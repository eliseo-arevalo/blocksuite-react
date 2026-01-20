import { DocCollection } from '@blocksuite/store';

export const createDocument = (collection: DocCollection, title?: string) => {
  const doc = collection.createDoc();
  doc.load(() => {
    const pageBlockId = doc.addBlock('affine:page', {});
    doc.addBlock('affine:surface', {}, pageBlockId);
    const noteId = doc.addBlock('affine:note', {}, pageBlockId);
    doc.addBlock('affine:paragraph', {}, noteId);
  });
  
  if (title) {
    collection.setDocMeta(doc.id, { title });
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
};

export const deleteDocument = (collection: DocCollection, docId: string) => {
  collection.removeDoc(docId);
};

export const renameDocument = (collection: DocCollection, docId: string, newTitle: string) => {
  collection.setDocMeta(docId, { title: newTitle });
};
