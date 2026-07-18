import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();

  const navigation = [
    { name: 'Home Overview', to: '/', icon: Home },
    { name: 'AI Chat Assistant', to: '/chat', icon: MessageSquare },
    { name: 'Dashboard Analytics', to: '/dashboard', icon: LayoutDashboard },
    { name: 'System Settings', to: '/settings', icon: Settings },
  ];

  // Build initials dynamically
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar navigation draw */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-900 border-r border-slate-800/80 transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80 bg-slate-900/50">
          <Link to="/" className="flex items-center gap-2.5 text-indigo-400 hover:text-indigo-300 transition-colors font-bold text-lg" onClick={onClose}>
            <GraduationCap className="w-7 h-7 text-indigo-500" />
            <span className="text-slate-100 tracking-wide font-sans select-none">UniAssist AI</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 lg:hidden cursor-pointer"
            aria-label="Close sidebar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Nav Links */}
        <div className="px-4 py-4 border-b border-slate-850">
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
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors border duration-150',
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-450 border-indigo-500/20'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-transparent'
                    )
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Recent Conversation Threads History list */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">Chat History</span>
            <button
              onClick={() => {
                createNewSession();
                onClose();
              }}
              className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Start a New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 flex-1">
            {sessions.map((session) => {
              const sessionId = session.id || (session as any)._id;
              return (
                <div
                  key={sessionId}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors border duration-150',
                    activeSessionId === sessionId
                      ? 'bg-slate-850 text-slate-100 border-slate-750'
                      : 'text-slate-450 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
                  )}
                >
                  <Link
                    to="/chat"
                    onClick={() => {
                      setActiveSessionId(sessionId);
                      onClose();
                    }}
                    className="flex-1 text-left truncate font-medium mr-2"
                  >
                    {session.title}
                  </Link>
                  <button
                    onClick={() => deleteSession(sessionId)}
                    type="button"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-750/50 rounded transition-all duration-150 cursor-pointer"
                    title="Remove conversation record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Identity Info status */}
        {user && (
          <div className="p-4 border-t border-slate-855 bg-slate-900/50 select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-indigo-650 flex items-center justify-center font-bold text-slate-100 text-sm border border-indigo-500/20">
                  {initials}
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-250 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
