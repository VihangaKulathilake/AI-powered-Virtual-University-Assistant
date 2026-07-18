import React, { useState, useRef, type FormEvent, type KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, X, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';

interface ChatInputProps {
  onSendMessage: (content: string, image?: { data: string; mimeType: string }) => void;
  onAttachFile?: (file: File) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onAttachFile,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ data: string; mimeType: string; name: string; preview: string } | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<{ name: string; size: number } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if image file (multimodal query payload)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        setAttachedImage({
          data: base64Data,
          mimeType: file.type,
          name: file.name,
          preview: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    } 
    // Check if document (TXT, PDF, DOCX) to feed to RAG database
    else {
      const allowedExts = ['.pdf', '.txt', '.docx'];
      const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        alert('Unsupported file type. Please upload a PDF, TXT, DOCX document, or any Image file.');
        return;
      }

      setAttachedDoc({
        name: file.name,
        size: file.size,
      });

      if (onAttachFile) {
        onAttachFile(file); // Trigger pipeline upload immediately in background
      }
    }

    // Reset input value so same file can be re-selected if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachedImage = () => {
    if (attachedImage) {
      URL.revokeObjectURL(attachedImage.preview);
      setAttachedImage(null);
    }
  };

  const removeAttachedDoc = () => {
    setAttachedDoc(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage && !attachedDoc) return;
    if (content.length > maxLength || disabled) return;

    onSendMessage(
      content,
      attachedImage ? { data: attachedImage.data, mimeType: attachedImage.mimeType } : undefined
    );

    // Reset inputs
    setContent('');
    removeAttachedImage();
    removeAttachedDoc();
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
      className="p-4 border-t border-slate-800 bg-slate-950/60 backdrop-blur-sm space-y-3"
    >
      {/* File & Image Preview Box */}
      {(attachedImage || attachedDoc) && (
        <div className="flex flex-wrap gap-3 px-1 select-none animate-fadeIn">
          {/* Image Thumbnail Preview */}
          {attachedImage && (
            <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-indigo-500/30 bg-slate-900 shadow-md">
              <img src={attachedImage.preview} alt="Attached Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeAttachedImage}
                className="absolute top-1 right-1 p-1 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-lg cursor-pointer transition-all"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Document File Card Preview */}
          {attachedDoc && (
            <div className="relative flex items-center gap-3 pl-3 pr-8 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 shadow-md text-xs">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 pr-4">
                <span className="font-semibold text-slate-200 truncate max-w-[150px]">{attachedDoc.name}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Vectorizing to database...</span>
              </div>
              <button
                type="button"
                onClick={removeAttachedDoc}
                className="absolute top-1/2 -translate-y-1/2 right-2.5 p-1 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all"
                title="Cancel document"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.txt,.docx,image/*"
        className="hidden"
      />

      <div className="flex items-end gap-2 bg-slate-900 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl px-3.5 py-2.5 transition-all">
        {/* Attach File/Image Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          title="Attach Document or Image"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now..." : "Ask a question, upload lecture documents, or drop a screenshot..."}
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
            disabled={(!content.trim() && !attachedImage && !attachedDoc) || content.length > maxLength || disabled}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500"
            title="Send query"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Meta Character Counter */}
      <div className="flex justify-between items-center px-1 text-[10px] text-slate-550 font-semibold uppercase tracking-wider select-none">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={content.length >= maxLength ? 'text-amber-500' : ''}>
          {content.length} / {maxLength} characters
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
