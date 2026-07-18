import React, { useState } from 'react';
import { type Message } from '../../types';
import { FileText, Copy, Check } from 'lucide-react';
import { formatTime, cn, parseMarkdown } from '../../utils/helpers';
import AiAvatar from './AiAvatar';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user' || message.role === 'user';
  const isSystem = message.sender === 'system' || message.role === 'system';

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3.5">
        <span className="px-3.5 py-1.5 text-[10px] font-semibold text-slate-500 bg-slate-900/60 rounded-full border border-slate-850 tracking-wider uppercase">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-4 my-6 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Sender Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md select-none border border-indigo-500/30">
            JD
          </div>
        ) : (
          <AiAvatar size="sm" isTyping={false} />
        )}
      </div>

      {/* Bubble Content Area */}
      <div className={cn('flex flex-col max-w-[75%] sm:max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-5 py-4 rounded-2xl border text-sm leading-relaxed shadow-sm relative',
            isUser
              ? 'bg-indigo-650 border-indigo-550 text-slate-100 rounded-tr-none'
              : 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none'
          )}
        >
          {/* Render Markdown parsed tags */}
          <div className="space-y-1">
            {parseMarkdown(message.content)}
          </div>

          {/* Render Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 w-full">
              {message.attachments.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all duration-150 border',
                    isUser
                      ? 'bg-indigo-700/60 border-indigo-500/20 hover:bg-indigo-750 text-indigo-200'
                      : 'bg-slate-950 border-slate-850 hover:bg-slate-950/80 text-slate-350 hover:text-slate-200'
                  )}
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="truncate flex-1 font-mono">{file.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Message Meta & Action Buttons */}
        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
            {formatTime(message.timestamp || message.createdAt || '')}
          </span>
          {!isSystem && (
            <button
              onClick={handleCopyMessage}
              type="button"
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              title="Copy message content"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
