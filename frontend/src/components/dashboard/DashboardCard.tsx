import React, { type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200',
        className
      )}
    >
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl font-bold text-slate-100 block select-all">
          {value}
        </span>
        {description || trend ? (
          <div className="flex items-center gap-1.5 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-medium',
                  trend.type === 'positive' && 'text-emerald-400',
                  trend.type === 'negative' && 'text-red-400',
                  trend.type === 'neutral' && 'text-slate-400'
                )}
              >
                {trend.value}
              </span>
            )}
            {description && <span className="text-slate-500">{description}</span>}
          </div>
        ) : null}
      </div>

      {/* Reusable Icon display */}
      <div className="flex items-center justify-center p-3 rounded-lg bg-slate-800 text-violet-400 group-hover:text-violet-300 border border-slate-750 transition-colors">
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
// Standard exports
