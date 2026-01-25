import { useEditorContext } from '@infrastructure/editor';
import { EditorSettings } from '@shared/components/editor-settings';
import { useEditorConfig } from '@shared/contexts/editor-config-context';
import { useEffect, useRef } from 'react';

export const EditorCanvas = () => {
  const { editor } = useEditorContext();
  const { widthMode, fontFamily } = useEditorConfig();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && editor) {
      containerRef.current.appendChild(editor);
    }
  }, [editor]);

  return (
    <div className="editor-container">
      <EditorSettings />
      <div
        className={`editor-canvas ${widthMode === 'full' ? 'editor-full-width' : 'editor-page-width'} font-${fontFamily}`}
        ref={containerRef}
      />
    </div>
  );
};
