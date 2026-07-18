import React from 'react';

interface AiAvatarProps {
  /** 'sm' = next to assistant messages, 'md' = typing indicator, 'lg' = chat header */
  size?: 'sm' | 'md' | 'lg';
  /** When true, show bouncing "thinking" overlay */
  isTyping?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { outer: 36, inner: 28, indicator: 8 },
  md: { outer: 44, inner: 36, indicator: 10 },
  lg: { outer: 56, inner: 46, indicator: 12 },
};

/**
 * Premium 3D-style Cartoon Character Avatar for the University Assistant.
 * Features:
 * - Rounded headshot of the character guide.
 * - Breathing/floating keyframe animation to make her feel alive.
 * - Double pulsing glowing rings around the avatar.
 * - Overlaid status dot (green when active, pulsing indigo when typing).
 */
const AiAvatar: React.FC<AiAvatarProps> = ({
  size = 'sm',
  isTyping = false,
  className = '',
}) => {
  const dim = sizeMap[size];

  return (
    <>
      {/* Embedded CSS animations scoped to this avatar */}
      <style>{`
        @keyframes avatar-float {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        @keyframes avatar-ring-pulse {
          0%   { transform: scale(0.95); opacity: 0.5; }
          50%  { transform: scale(1.18); opacity: 0.15; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes avatar-thinking-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50%      { transform: scale(1.05); filter: brightness(1.15) drop-shadow(0 0 4px #818cf8); }
        }
        @keyframes mini-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-3px); opacity: 1; }
        }
        
        .avatar-breathing {
          animation: avatar-float 3.5s ease-in-out infinite;
        }
        .avatar-pulse-1 {
          animation: avatar-ring-pulse 2.2s ease-in-out infinite;
        }
        .avatar-pulse-2 {
          animation: avatar-ring-pulse 2.2s ease-in-out 0.8s infinite;
        }
        .avatar-thinking-active {
          animation: avatar-thinking-pulse 1.8s ease-in-out infinite;
        }
        
        .mini-bounce-1 { animation: mini-dot-bounce 1.2s ease-in-out 0s infinite; }
        .mini-bounce-2 { animation: mini-dot-bounce 1.2s ease-in-out 0.2s infinite; }
        .mini-bounce-3 { animation: mini-dot-bounce 1.2s ease-in-out 0.4s infinite; }
      `}</style>

      <div
        className={`relative flex-shrink-0 flex items-center justify-center select-none ${className}`}
        style={{ width: dim.outer, height: dim.outer }}
      >
        {/* Ring Glow 2 */}
        <div
          className="avatar-pulse-2 absolute rounded-full"
          style={{
            width: dim.outer,
            height: dim.outer,
            background: 'radial-gradient(circle, #22c55e15 0%, transparent 70%)',
            border: `1px solid ${isTyping ? '#818cf825' : '#22c55e25'}`,
          }}
        />

        {/* Ring Glow 1 */}
        <div
          className="avatar-pulse-1 absolute rounded-full"
          style={{
            width: dim.inner + 6,
            height: dim.inner + 6,
            background: `radial-gradient(circle, ${isTyping ? '#6366f120' : '#10b98120'} 0%, transparent 70%)`,
            border: `1px solid ${isTyping ? '#6366f135' : '#10b98135'}`,
          }}
        />

        {/* Core Image container */}
        <div
          className={`avatar-breathing relative rounded-full overflow-hidden border shadow-md flex items-center justify-center ${
            isTyping ? 'avatar-thinking-active border-indigo-500' : 'border-slate-800'
          }`}
          style={{
            width: dim.inner,
            height: dim.inner,
            background: '#0f172a',
          }}
        >
          {/* Avatar Face Asset */}
          <img
            src="/assets/avatar.png"
            className="w-full h-full object-cover rounded-full"
            alt="UniAssist Character Guide"
            onError={(e) => {
              // Fallback placeholder in case asset fails to load
              e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Uni';
            }}
          />

          {/* Typing Overlay Mask */}
          {isTyping && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px] flex items-center justify-center gap-0.5">
              <span className="mini-bounce-1 block w-1 h-1 rounded-full bg-indigo-300" />
              <span className="mini-bounce-2 block w-1 h-1 rounded-full bg-violet-300" />
              <span className="mini-bounce-3 block w-1 h-1 rounded-full bg-sky-300" />
            </div>
          )}
        </div>

        {/* Active Status Badge Overlay */}
        <div
          className={`absolute bottom-0 right-0 rounded-full border border-slate-950 shadow-sm ${
            isTyping ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'
          }`}
          style={{
            width: dim.indicator,
            height: dim.indicator,
          }}
        />
      </div>
    </>
  );
};

export default AiAvatar;
