import { Maximize2, Minimize2 } from 'lucide-react';
import { useEditorWidth } from '@shared/contexts/editor-width-context';

export const WidthToggle = () => {
  const { widthMode, toggleWidthMode } = useEditorWidth();

  return (
    <button
      className="width-toggle"
      onClick={toggleWidthMode}
      title={widthMode === 'page' ? 'Ancho completo' : 'Ancho de página'}
    >
      {widthMode === 'page' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
    </button>
  );
};
