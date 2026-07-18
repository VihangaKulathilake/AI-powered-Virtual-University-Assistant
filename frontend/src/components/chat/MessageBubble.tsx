import React from 'react';
import { type Message } from '../../types';
import { FileText, GraduationCap } from 'lucide-react';
import { formatTime, cn } from '../../utils/helpers';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="px-3 py-1 text-xs font-medium text-slate-500 bg-slate-800/40 rounded-full border border-slate-850">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 my-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Sender Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-md select-none">
            JD
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-violet-400 shadow-md select-none">
            <GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
        )}
      </div>

      {/* Bubble Content */}
      <div className={cn('flex flex-col max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm',
            isUser
              ? 'bg-violet-600 border-violet-500 text-white rounded-tr-none'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-100 rounded-tl-none'
          )}
        >
          {message.content}

          {/* Render Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5 w-full">
              {message.attachments.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors border',
                    isUser
                      ? 'bg-violet-750 border-violet-500 hover:bg-violet-800 text-white'
                      : 'bg-slate-900/50 border-slate-750 hover:bg-slate-900 text-slate-300'
                  )}
                >
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span className="truncate flex-1">{file.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Message Meta (Timestamp) */}
        <span className="mt-1.5 text-[10px] font-medium text-slate-500 tracking-wider">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
// Helper placeholder style inside tailwind config for custom styles
