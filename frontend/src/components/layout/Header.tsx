import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview';
      case '/chat':
        return 'AI Chat Assistant';
      case '/dashboard':
        return 'Academic Dashboard';
      case '/settings':
        return 'System Settings';
      default:
        return 'Assistant';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 -ml-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-100 leading-tight m-0 select-none">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right-aligned Header Operations */}
      <div className="flex items-center gap-4">
        {/* Quick status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LLM Service Connected</span>
        </div>

        {/* Notifications Button */}
        <button
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-violet-500" />
        </button>

        {/* Profile Dropdown Trigger */}
        <button
          className="flex items-center gap-2 p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg cursor-pointer"
          title="Profile"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
