import { AffineEditorContainer } from '@blocksuite/presets';
import { Schema } from '@blocksuite/store';
import { DocCollection } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import '@blocksuite/presets/themes/affine.css';

export function createEditorInstance() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  collection.meta.initialize();

  const demoDoc = collection.createDoc({ id: 'demo' });
  demoDoc.load(() => {
    const pageBlockId = demoDoc.addBlock('affine:page', {});
    demoDoc.addBlock('affine:surface', {}, pageBlockId);
    const noteId = demoDoc.addBlock('affine:note', {}, pageBlockId);
    demoDoc.addBlock('affine:paragraph', {}, noteId);
  });
  
  collection.setDocMeta(demoDoc.id, { title: '📝 Start Writing Here' });

  const editor = new AffineEditorContainer();
  editor.doc = demoDoc;

  return { editor, collection };
}
