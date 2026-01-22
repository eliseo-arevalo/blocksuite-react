export interface EditorState {
  isReady: boolean;
  hasUnsavedChanges: boolean;
  currentMode: 'edit' | 'preview';
}

export interface EditorActions {
  onSave: () => void;
  onModeChange: (mode: 'edit' | 'preview') => void;
}
