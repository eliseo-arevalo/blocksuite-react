import { EditorProvider } from '@infrastructure/editor';
import { ThemeProvider } from '@shared/contexts/theme-provider';
import { AppContent } from '@shared/components/app-content';

function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <AppContent />
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
