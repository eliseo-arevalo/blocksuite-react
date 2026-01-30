import { FontFamily, useEditorConfig } from '@shared/contexts/editor-config-context';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const fontOptions: { value: FontFamily; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
];

export const EditorSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { widthMode, fontFamily, toggleWidthMode, setFontFamily } = useEditorConfig();

  return (
    <div className="editor-settings">
      <button className="editor-settings-trigger" onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="editor-settings-menu">
          <button onClick={toggleWidthMode}>
            {widthMode === 'page' ? 'Ancho completo' : 'Ancho de página'}
          </button>

          <div className="editor-settings-section">
            <span className="editor-settings-label">Fuente</span>
            {fontOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFontFamily(option.value)}
                className={fontFamily === option.value ? 'active' : ''}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
