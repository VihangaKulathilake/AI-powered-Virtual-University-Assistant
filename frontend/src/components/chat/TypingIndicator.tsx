import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-slate-800/50 rounded-2xl rounded-tl-none border border-slate-700/50 max-w-xs">
      <span className="text-xs text-slate-400 font-medium">Assistant is thinking</span>
      <div className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
