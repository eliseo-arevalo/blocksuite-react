import { EditorProvider } from '@infrastructure/editor';
import { AppContent } from '@shared/components/app-content';
import { BrowserCompatibilityChecker } from '@shared/components/browser-compatibility-checker';
import { DocumentUpdateProvider } from '@shared/contexts/document-update-context';
import { EditorConfigProvider } from '@shared/contexts/editor-config-context';
import { ThemeProvider } from '@shared/contexts/theme-provider';
import { ModalProvider } from '@shared/providers/modal-provider';
import { ToastProvider } from '@shared/providers/toast-provider';

function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <DocumentUpdateProvider>
          <EditorConfigProvider>
            <ModalProvider>
              <ToastProvider>
                <BrowserCompatibilityChecker />
                <AppContent />
              </ToastProvider>
            </ModalProvider>
          </EditorConfigProvider>
        </DocumentUpdateProvider>
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
