import React, { useState, useRef, type FormEvent, type KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';

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
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const maxLength = 1000;

  // Auto-resize textarea height as content expands
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [content]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;             // Stay active during pauses
      rec.interimResults = false;        // Only process finalized words
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        let accumulatedText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            accumulatedText += event.results[i][0].transcript;
          }
        }
        
        if (accumulatedText.trim()) {
          setContent((prev) => {
            const trimmedPrev = prev.trim();
            const separator = trimmedPrev && !trimmedPrev.endsWith(' ') ? ' ' : '';
            return trimmedPrev + separator + accumulatedText.trim();
          });
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            alert('Microphone permission denied. Please click the camera/microphone icon in the left of your browser address bar to allow mic access.');
            break;
          case 'audio-capture':
            alert('No microphone was found. Please plug in a microphone or select one in your system audio settings.');
            break;
          case 'network':
            alert('Google Speech Recognition network connection failed.\n\nIf you are using Brave Browser, Brave disables Google speech services by default. To fix this:\n1. Go to Brave Settings (brave://settings)\n2. Navigate to "Languages"\n3. Enable "Use Google services for screen reader and speech recognition"\n\nOtherwise, please use Google Chrome or Microsoft Edge where speech services work out-of-the-box!');
            break;
          case 'no-speech':
            // Do not disturb the user if no speech was detected in a session
            break;
          default:
            console.warn(`Speech recognition stopped: ${event.error}`);
        }
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please try using Google Chrome or Microsoft Edge!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

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
          placeholder={isListening ? "Listening... Speak now..." : "Ask a question about coursework, assignments, or slides..."}
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-32 min-h-[24px] resize-none border-0 bg-transparent py-1.5 px-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-0 focus:outline-none scrollbar-thin outline-none"
        />

        {/* Voice Input & Send Action Buttons */}
        <div className="flex items-center gap-2 self-center sm:self-end flex-shrink-0">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer",
              isListening
                ? "bg-red-500/20 border-red-500/30 text-red-400 animate-pulse"
                : "bg-slate-800 hover:bg-slate-750 border-slate-750 text-slate-400 hover:text-slate-200"
            )}
            title={isListening ? "Listening... Click to stop" : "Speak your query (Voice Input)"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

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
