import { useEffect, useRef } from 'react';
import { useEditorContext } from '@infrastructure/editor';
import { useEditorWidth } from '@shared/contexts/editor-width-context';

export const EditorCanvas = () => {
  const { editor } = useEditorContext();
  const { widthMode } = useEditorWidth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && editor) {
      containerRef.current.appendChild(editor);
    }
  }, []);

  return (
    <div 
      className={`editor-canvas ${widthMode === 'full' ? 'editor-full-width' : 'editor-page-width'}`} 
      ref={containerRef} 
    />
  );
};
