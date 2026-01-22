import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Home,
  Search,
  Settings,
  MoreHorizontal,
} from 'lucide-react';

export const icons = {
  // Document actions
  document: FileText,
  add: Plus,
  delete: Trash2,
  edit: Edit3,
  
  // Navigation
  menu: Menu,
  close: X,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  
  // Theme
  sun: Sun,
  moon: Moon,
  
  // Folders
  folder: Folder,
  folderOpen: FolderOpen,
  
  // General
  home: Home,
  search: Search,
  settings: Settings,
  more: MoreHorizontal,
} as const;

export type IconName = keyof typeof icons;
