import { AffineEditorContainer } from '@blocksuite/presets';
import { Doc, Schema } from '@blocksuite/store';
import { DocCollection } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import '@blocksuite/presets/themes/affine.css';

export function createEditorInstance() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  collection.meta.initialize();

  // Create simple demo document without pre-filled text
  const demoDoc = collection.createDoc({ id: 'demo' });
  demoDoc.load(() => {
    const pageBlockId = demoDoc.addBlock('affine:page', {});
    demoDoc.addBlock('affine:surface', {}, pageBlockId);
    const noteId = demoDoc.addBlock('affine:note', {}, pageBlockId);
    
    // Create a single empty paragraph - BlockSuite will handle text initialization
    demoDoc.addBlock('affine:paragraph', {}, noteId);
  });
  
  collection.setDocMeta(demoDoc.id, { title: '📝 Start Writing Here' });

  const editor = new AffineEditorContainer();
  editor.doc = demoDoc;
  
  /**
   * FIX: Prevent editor crash when deleting all content (Ctrl+A → Delete)
   * BlockSuite v0.15 bug: deleting all paragraphs breaks the DOM structure
   * Solution: Auto-recreate an empty paragraph to maintain valid document state
   */
  const protectDocument = (doc: Doc) => {
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
  };

  // Apply protection to demo document
  protectDocument(demoDoc);
  
  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = collection.getDoc(docId);
    if (target) {
      editor.doc = target as Doc;
    }
  });

  return { editor, collection };
}
