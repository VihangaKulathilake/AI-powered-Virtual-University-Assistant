import React, { useState, useRef, type FormEvent, type KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onAttachFile?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onAttachFile,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;

  // Auto-resize textarea height as content expands
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [content]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > maxLength || disabled) return;
    onSendMessage(content);
    setContent('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-slate-800 bg-slate-950/60 backdrop-blur-sm space-y-2"
    >
      <div className="flex items-end gap-2 bg-slate-900 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl px-3.5 py-2.5 transition-all">
        {/* Attach File Button */}
        {onAttachFile ? (
          <button
            type="button"
            onClick={onAttachFile}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            title="Attach Course Document"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        ) : null}

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about coursework, assignments, or slides..."
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-32 min-h-[24px] resize-none border-0 bg-transparent py-1.5 px-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-0 focus:outline-none scrollbar-thin outline-none"
        />

        {/* Send Action Button */}
        <div className="flex items-center gap-2 self-center sm:self-end flex-shrink-0">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || content.length > maxLength || disabled}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500"
            title="Send query"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Meta Character Counter */}
      <div className="flex justify-between items-center px-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider select-none">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={content.length >= maxLength ? 'text-amber-500' : ''}>
          {content.length} / {maxLength} characters
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
