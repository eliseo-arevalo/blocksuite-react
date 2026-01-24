import { useEffect, useRef } from 'react';
import { useEditorContext } from '@infrastructure/editor';

export const EditorCanvas = () => {
  const { editor } = useEditorContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && editor) {
      containerRef.current.appendChild(editor);
    }
  }, []);

  return <div className="editor-canvas" ref={containerRef} />;
};
