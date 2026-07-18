import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import AppRoutes from './routes';
import './styles/theme.css'; // Load custom style helpers

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
