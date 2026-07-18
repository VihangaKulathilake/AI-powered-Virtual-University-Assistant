import React from 'react';

interface AiAvatarProps {
  /** 'sm' = next to assistant messages, 'md' = typing indicator, 'lg' = chat header */
  size?: 'sm' | 'md' | 'lg';
  /** When true, show bouncing "thinking" dots instead of the idle brain orb */
  isTyping?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { outer: 32, inner: 24, icon: 14 },
  md: { outer: 40, inner: 30, icon: 17 },
  lg: { outer: 52, inner: 40, icon: 22 },
};

/**
 * Animated AI avatar orb for the University of Kelaniya AI assistant.
 * Idle: pulsing glowing rings + brain/circuit icon.
 * Typing: bouncing dot indicator inside the orb.
 */
const AiAvatar: React.FC<AiAvatarProps> = ({
  size = 'sm',
  isTyping = false,
  className = '',
}) => {
  const dim = sizeMap[size];

  return (
    <>
      {/* Embedded CSS keyframe animations – scoped to this component */}
      <style>{`
        @keyframes ai-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.55; }
          50%  { transform: scale(1.22); opacity: 0.2; }
          100% { transform: scale(1);   opacity: 0.55; }
        }
        @keyframes ai-pulse-ring-2 {
          0%   { transform: scale(1);   opacity: 0.3; }
          50%  { transform: scale(1.38); opacity: 0.07; }
          100% { transform: scale(1);   opacity: 0.3; }
        }
        @keyframes ai-orb-glow {
          0%   { filter: drop-shadow(0 0 4px #818cf8) drop-shadow(0 0 10px #6366f1aa); }
          50%  { filter: drop-shadow(0 0 8px #a78bfa) drop-shadow(0 0 20px #818cf8bb); }
          100% { filter: drop-shadow(0 0 4px #818cf8) drop-shadow(0 0 10px #6366f1aa); }
        }
        @keyframes ai-icon-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ai-dot-bounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
          40%            { transform: translateY(-4px); opacity: 1;   }
        }
        @keyframes ai-color-shift {
          0%   { stop-color: #818cf8; }
          33%  { stop-color: #a78bfa; }
          66%  { stop-color: #60a5fa; }
          100% { stop-color: #818cf8; }
        }
        .ai-pulse-ring-1  { animation: ai-pulse-ring   2.4s ease-in-out infinite; }
        .ai-pulse-ring-2  { animation: ai-pulse-ring-2 2.4s ease-in-out 0.6s infinite; }
        .ai-orb-glow      { animation: ai-orb-glow     2.8s ease-in-out infinite; }
        .ai-icon-rotate   { animation: ai-icon-spin    18s linear infinite; }
        .ai-dot-1 { animation: ai-dot-bounce 1.4s ease-in-out 0s   infinite; }
        .ai-dot-2 { animation: ai-dot-bounce 1.4s ease-in-out 0.2s infinite; }
        .ai-dot-3 { animation: ai-dot-bounce 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      <div
        className={`relative flex-shrink-0 flex items-center justify-center ${className}`}
        style={{ width: dim.outer, height: dim.outer }}
        aria-label="UniAssist AI"
        role="img"
      >
        {/* Outer pulsing glow ring 2 (furthest) */}
        <div
          className="ai-pulse-ring-2 absolute rounded-full"
          style={{
            width: dim.outer,
            height: dim.outer,
            background: 'radial-gradient(circle, #818cf820 0%, transparent 70%)',
            border: '1px solid #818cf830',
          }}
        />

        {/* Outer pulsing glow ring 1 */}
        <div
          className="ai-pulse-ring-1 absolute rounded-full"
          style={{
            width: dim.inner + 6,
            height: dim.inner + 6,
            background: 'radial-gradient(circle, #6366f130 0%, transparent 70%)',
            border: '1px solid #6366f150',
          }}
        />

        {/* Core orb */}
        <div
          className="ai-orb-glow relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: dim.inner,
            height: dim.inner,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)',
            border: '1px solid #6366f170',
          }}
        >
          {/* Inner gradient shimmer layer */}
          <div
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 35% 30%, #818cf840 0%, transparent 65%)',
            }}
          />

          {/* Content: idle brain icon OR typing dots */}
          {isTyping ? (
            /* Thinking dots */
            <div className="relative z-10 flex items-center gap-0.5">
              <span
                className="ai-dot-1 block rounded-full bg-indigo-300"
                style={{ width: 4, height: 4 }}
              />
              <span
                className="ai-dot-2 block rounded-full bg-violet-300"
                style={{ width: 4, height: 4 }}
              />
              <span
                className="ai-dot-3 block rounded-full bg-sky-300"
                style={{ width: 4, height: 4 }}
              />
            </div>
          ) : (
            /* Brain / circuit icon SVG */
            <svg
              className="ai-icon-rotate relative z-10"
              width={dim.icon}
              height={dim.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#a5b4fc" />
                  <stop offset="50%"  stopColor="#c4b5fd" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              {/* Brain-circuit hybrid path */}
              <path
                d="M12 2C9.8 2 8 3.8 8 6c0 .6.1 1.1.3 1.6C6.4 8.1 5 9.9 5 12c0 1.5.6 2.8 1.6 3.8C6.2 16.4 6 17.2 6 18c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4 0-.8-.2-1.6-.6-2.2C18.4 14.8 19 13.5 19 12c0-2.1-1.4-3.9-3.3-4.4.2-.5.3-1 .3-1.6 0-2.2-1.8-4-4-4z"
                stroke="url(#ai-grad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
              {/* Circuit nodes */}
              <circle cx="12" cy="9"  r="1.2" fill="#a5b4fc" opacity="0.9" />
              <circle cx="9"  cy="13" r="0.9" fill="#c4b5fd" opacity="0.8" />
              <circle cx="15" cy="13" r="0.9" fill="#93c5fd" opacity="0.8" />
              <circle cx="12" cy="17" r="1.0" fill="#a5b4fc" opacity="0.75" />
              {/* Connection lines */}
              <line x1="12" y1="9"  x2="9"  y2="13" stroke="#a5b4fc" strokeWidth="0.7" opacity="0.6" />
              <line x1="12" y1="9"  x2="15" y2="13" stroke="#a5b4fc" strokeWidth="0.7" opacity="0.6" />
              <line x1="9"  y1="13" x2="12" y2="17" stroke="#c4b5fd" strokeWidth="0.7" opacity="0.6" />
              <line x1="15" y1="13" x2="12" y2="17" stroke="#93c5fd" strokeWidth="0.7" opacity="0.6" />
            </svg>
          )}
        </div>
      </div>
    </>
  );
};

export default AiAvatar;
