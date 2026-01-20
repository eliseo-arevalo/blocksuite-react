import { AffineEditorContainer } from '@blocksuite/presets';
import { DocCollection } from '@blocksuite/store';

export interface EditorContextValue {
  editor: AffineEditorContainer;
  collection: DocCollection;
}
