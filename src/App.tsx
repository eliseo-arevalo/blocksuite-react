import { EditorProvider } from '@infrastructure/editor';
import { ThemeProvider } from '@shared/contexts/theme-provider';
import { DocumentUpdateProvider } from '@shared/contexts/document-update-context';
import { AppContent } from '@shared/components/app-content';

function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <DocumentUpdateProvider>
          <AppContent />
        </DocumentUpdateProvider>
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
