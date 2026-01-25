import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Info,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Trash2,
  X,
  XCircle,
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
  X: X,
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

  // Toast icons
  CheckCircle2: CheckCircle2,
  XCircle: XCircle,
  AlertTriangle: AlertTriangle,
  Info: Info,
} as const;

export type IconName = keyof typeof icons;
