import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { 
  MessageSquare, 
  Home, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Trash2, 
  GraduationCap, 
  X 
} from 'lucide-react';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { sessions, activeSessionId, setActiveSessionId, createNewSession, deleteSession } = useChat();

  const navigation = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'Chat Assistant', to: '/chat', icon: MessageSquare },
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 text-violet-400 font-bold text-lg" onClick={onClose}>
            <GraduationCap className="w-8 h-8 text-violet-500" />
            <span className="text-slate-100 tracking-wide font-outfit">UniAssist AI</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Navigation Links */}
        <div className="px-4 py-4 border-b border-slate-800">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                      isActive
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Conversation Sessions list */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Chats</span>
            <button
              onClick={() => {
                createNewSession();
                onClose();
              }}
              className="p-1 text-slate-400 hover:text-violet-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 flex-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors border duration-150',
                  activeSessionId === session.id
                    ? 'bg-slate-800/80 text-slate-100 border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
                )}
              >
                <button
                  onClick={() => {
                    setActiveSessionId(session.id);
                    onClose();
                  }}
                  className="flex-1 text-left truncate font-medium cursor-pointer"
                >
                  {session.title}
                </button>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded transition-opacity transition-colors cursor-pointer"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer User Profile Status */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center font-bold text-slate-100 text-sm">
                JD
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">john.doe@university.edu</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
