import { EditorProvider } from '@infrastructure/editor';
import { DocumentManagement } from '@features/document-management/document-management';
import { DocumentEditor } from '@features/document-editor/document-editor';
import './index.css';

function App() {
  return (
    <EditorProvider>
      <div className="app">
        <DocumentManagement />
        <div className="main-content">
          <DocumentEditor />
        </div>
      </div>
    </EditorProvider>
  );
}

export default App;
