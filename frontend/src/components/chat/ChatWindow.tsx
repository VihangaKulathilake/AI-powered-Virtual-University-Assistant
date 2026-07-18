import React, { useRef, useEffect } from 'react';
import { type Message } from '../../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import AiAvatar from './AiAvatar';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

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
        <div className="max-w-2xl w-full flex flex-col md:flex-row items-start gap-6 px-4 py-6 md:py-12">
          {/* Dr. Amelia Lecturer Avatar */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <AiAvatar size="lg" isTyping={false} className="shadow-lg border-2 border-indigo-500/20 rounded-full" />
          </div>

          {/* Speech Bubble Container */}
          <div className="flex-1 space-y-4 w-full">
            {/* The greeting bubble */}
            <div className="relative p-5 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none text-slate-200 text-sm shadow-md leading-relaxed">
              {/* Little speech bubble left arrow decoration on medium screens */}
              <div className="hidden md:block absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-slate-900 border-l-[10px] border-l-transparent" />
              <div className="hidden md:block absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-slate-800 border-l-[10px] border-l-transparent -z-10" />

              <p className="font-bold text-indigo-400 mb-1 text-xs uppercase tracking-wider">Dr. Amelia</p>
              <p className="text-slate-300">
                Hello! I am Dr. Amelia, your senior Software Engineering lecturer. Welcome to your virtual learning assistant. What topic or course materials would you like to study today?
              </p>
            </div>

            {/* Clickable prompt actions */}
            {onQuickQuery && (
              <div className="space-y-2.5">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Choose a topic to begin learning:
                </span>
                
                <div className="flex flex-col gap-2">
                  {samplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => onQuickQuery(prompt)}
                      type="button"
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs font-semibold text-slate-350 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-750 rounded-xl transition-all duration-150 group cursor-pointer shadow-sm"
                    >
                      <span className="truncate pr-4">{prompt}</span>
                      <span className="text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform font-bold text-[14px]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-1 relative scrollbar-thin">
      {/* Render bubble rows */}
      {messages.map((message) => (
        <MessageBubble key={message.id || message._id} message={message} />
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

      {/* Global Error Banner (displayed at bottom above input bar for maximum visibility) */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 my-4 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-300 mb-0.5">System Error Status</p>
            <p className="text-slate-400 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Anchor for scroll container */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
