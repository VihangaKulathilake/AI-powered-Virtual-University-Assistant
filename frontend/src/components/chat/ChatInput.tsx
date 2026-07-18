import React, { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;
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
      className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="flex items-end gap-2 bg-slate-800 border border-slate-700 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 rounded-xl px-3 py-2 transition-all">
        {/* Attach File Button */}
        {onAttachFile ? (
          <button
            type="button"
            onClick={onAttachFile}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        ) : null}

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your coursework or upload slides..."
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-32 min-h-[40px] resize-none border-0 bg-transparent py-2.5 px-1 text-sm text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none scrollbar-thin outline-none"
        />

        {/* Send Action Buttons */}
        <div className="flex items-center gap-1.5 self-center sm:self-end">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || disabled}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-lg"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
