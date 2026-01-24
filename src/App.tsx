import { EditorProvider } from '@infrastructure/editor';
import { ThemeProvider } from '@shared/contexts/theme-provider';
import { DocumentUpdateProvider } from '@shared/contexts/document-update-context';
import { ModalProvider } from '@shared/providers/modal-provider';
import { EditorConfigProvider } from '@shared/contexts/editor-config-context';
import { BrowserCompatibilityChecker } from '@shared/components/browser-compatibility-checker';
import { AppContent } from '@shared/components/app-content';

function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <DocumentUpdateProvider>
          <EditorConfigProvider>
            <ModalProvider>
              <BrowserCompatibilityChecker />
              <AppContent />
            </ModalProvider>
          </EditorConfigProvider>
        </DocumentUpdateProvider>
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
