import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';

// Lazily/Directly import page components
import Home from '../pages/Home/Home';
import Chat from '../pages/Chat/Chat';
import Dashboard from '../pages/Dashboard/Dashboard';
import Settings from '../pages/Settings/Settings';
import NotFound from '../pages/NotFound/NotFound';
import UploadPanel from '../components/upload/UploadPanel';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route wrapper inside Auth verification layer */}
      <Route element={<ProtectedLayout />}>
        {/* Main Application Layout Frame */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<div className="h-full bg-slate-900 border border-slate-800/80 rounded-xl p-6 shadow-sm"><UploadPanel /></div>} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback Error 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
