import React, { useRef, useEffect } from 'react';
import { type Message } from '../../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import AiAvatar from './AiAvatar';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import { MessageSquare, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  typing?: boolean;
  loading?: boolean;
  error?: string | null;
  onQuickQuery?: (query: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  typing = false,
  loading = false,
  error = null,
  onQuickQuery,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message updates or typing trigger
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, loading]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 h-full">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-4">
          Retrieving Lecture History...
        </span>
      </div>
    );
  }

  if (messages.length === 0) {
    const samplePrompts = [
      'Summarize database normal forms with examples.',
      'Explain the difference between time complexity O(N) and O(log N).',
      'Show me how to solve a basic integration by parts calculus problem.',
      'Draft a study schedule for my upcoming Operating Systems final.',
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 h-full overflow-y-auto scrollbar-thin">
        <EmptyState
          title="Virtual University Assistant"
          description="Ask me questions about your course materials, syllabi, coding labs, or upload study slides for AI semantic indexing."
          icon={<MessageSquare className="w-6 h-6 text-indigo-400" />}
          className="my-0 border-slate-800 bg-slate-900/20"
        />

        {onQuickQuery && (
          <div className="mt-8 max-w-xl w-full space-y-3.5 px-4 select-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Suggested Academic Prompts</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onQuickQuery(prompt)}
                  type="button"
                  className="flex items-start gap-2.5 px-4 py-3 text-left text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all duration-150 group cursor-pointer shadow-sm"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 flex-shrink-0 mt-0.5" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-1 relative scrollbar-thin">
      {/* Global Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 my-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-300 mb-0.5">System Error Status</p>
            <p className="text-slate-400 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Render bubble rows */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Animated avatar typing indicator */}
      {typing && (
        <div className="flex items-end gap-3 my-4 px-1">
          <AiAvatar size="sm" isTyping={true} />
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm shadow-sm">
            <TypingIndicator />
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest ml-1">UniAssist is thinking...</span>
          </div>
        </div>
      )}

      {/* Anchor for scroll container */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
