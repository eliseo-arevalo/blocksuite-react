import { useEffect, useRef, useState } from 'react';
import { useEditorContext } from '@infrastructure/editor';

export const EditorCanvas = () => {
  const { editor } = useEditorContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !editor || mounted) return;

    const container = containerRef.current;
    container.appendChild(editor);
    setMounted(true);

    return () => {
      // Only cleanup on unmount
      if (container.contains(editor)) {
        container.removeChild(editor);
      }
      setMounted(false);
    };
  }, []); // Empty deps - mount once only

  return <div className="editor-canvas" ref={containerRef} />;
};
