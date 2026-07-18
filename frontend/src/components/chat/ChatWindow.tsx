import React, { useRef, useEffect } from 'react';
import { type Message } from '../../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from '../common/EmptyState';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  typing?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  typing = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Autoscroll to bottom when message log updates or typing starts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-full">
        <EmptyState
          title="No Messages Yet"
          description="Ask your AI Assistant any questions about lectures, coursework, syllabus guidelines, or write simple code."
          icon={<MessageSquare className="w-6 h-6 text-violet-400" />}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-2 relative scrollbar-thin">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {typing && (
        <div className="flex justify-start my-4">
          <TypingIndicator />
        </div>
      )}

      {/* Anchor for autoscroll */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
// Stylings and exports are properly aligned
