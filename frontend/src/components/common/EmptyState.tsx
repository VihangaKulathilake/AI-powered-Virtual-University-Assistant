import React, { type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-slate-900 border border-dashed border-slate-700 rounded-xl max-w-md mx-auto my-6',
        className
      )}
    >
      {icon ? (
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-slate-800 text-violet-400">
          {icon}
        </div>
      ) : (
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-slate-800 text-violet-400">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mb-6 text-sm text-slate-400 leading-relaxed">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
