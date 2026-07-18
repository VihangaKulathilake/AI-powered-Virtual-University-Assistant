import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import UploadPanel from '../../components/upload/UploadPanel';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Chat: React.FC = () => {
  const { messages, typing, loading, sendMessage } = useChat();
  const [showUploads, setShowUploads] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    setError(null);
    try {
      await sendMessage(content);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while sending your request to the university assistant. Please check configurations.');
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)] relative overflow-hidden">
      {/* Chat Thread Panel */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm h-full">
        {/* Chat Window Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
            <span className="text-xs font-semibold text-slate-400 select-none">AI Agent Active</span>
          </div>
          
          <button
            onClick={() => setShowUploads(!showUploads)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-450 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-750 rounded-lg cursor-pointer transition-colors"
          >
            {showUploads ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Lecture Files</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Show Lecture Files</span>
              </>
            )}
          </button>
        </div>

        {/* Message Log with support for quick prompts and errors */}
        <ChatWindow 
          messages={messages} 
          typing={typing} 
          loading={loading}
          error={error}
          onQuickQuery={handleSendMessage}
        />

        {/* Send Inputs */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onAttachFile={() => setShowUploads(true)}
          disabled={typing || loading}
        />
      </div>

      {/* RAG Knowledge Base Sidebar Panel */}
      <div
        className={cn(
          'w-80 h-full flex-shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden',
          showUploads ? 'block translate-x-0' : 'hidden translate-x-full'
        )}
      >
        <UploadPanel />
      </div>
    </div>
  );
};

export default Chat;
