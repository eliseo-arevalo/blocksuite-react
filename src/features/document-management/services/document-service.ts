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
  
  return doc;
};

export const deleteDocument = (collection: DocCollection, docId: string) => {
  collection.removeDoc(docId);
};

export const renameDocument = (collection: DocCollection, docId: string, newTitle: string) => {
  collection.setDocMeta(docId, { title: newTitle });
};
