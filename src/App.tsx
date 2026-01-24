import { EditorProvider } from '@infrastructure/editor';
import { ThemeProvider } from '@shared/contexts/theme-provider';
import { DocumentUpdateProvider } from '@shared/contexts/document-update-context';
import { ModalProvider } from '@shared/providers/modal-provider';
import { EditorWidthProvider } from '@shared/contexts/editor-width-context';
import { BrowserCompatibilityChecker } from '@shared/components/browser-compatibility-checker';
import { AppContent } from '@shared/components/app-content';

function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <DocumentUpdateProvider>
          <EditorWidthProvider>
            <ModalProvider>
              <BrowserCompatibilityChecker />
              <AppContent />
            </ModalProvider>
          </EditorWidthProvider>
        </DocumentUpdateProvider>
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
