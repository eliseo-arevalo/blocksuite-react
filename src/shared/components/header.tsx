import { Icon } from '@shared/components/icon';
import { useTheme } from '@shared/contexts/theme-context';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Icon name={isSidebarOpen ? 'close' : 'menu'} size={20} />
        </button>
        <div className="breadcrumbs">
          <Icon name="home" size={16} />
          <span>Documents</span>
        </div>
      </div>
      
      <div className="header-center">
        <h1>BlockSuite Editor</h1>
      </div>
      
      <div className="header-right">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
        </button>
      </div>
    </header>
  );
};
