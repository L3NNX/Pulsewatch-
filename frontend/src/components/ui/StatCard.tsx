import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const signalIndicator = {
    default: 'text-[rgba(0,255,136,0.6)]',
    success: 'text-[#00ff88]',
    danger: 'text-[#ff3030]',
    warning: 'text-[#ffa000]',
  }[variant];

  const valueColor = {
    default: 'text-[#e0f0e8]',
    success: 'text-[#00ff88]',
    danger: 'text-[#ff3030]',
    warning: 'text-[#ffa000]',
  }[variant];

  return (
    <div
      className={cn(
        'relative border border-[rgba(0,255,136,0.16)] bg-[rgba(10,18,26,0.85)] p-4 transition-all hover:border-[rgba(0,255,136,0.35)] hover:shadow-[0_0_15px_rgba(0,255,136,0.06)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.08)] pb-2 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(224,240,232,0.45)]">
          // {title}
        </span>
        <Icon className={cn('h-4 w-4', signalIndicator)} aria-hidden="true" />
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'font-["Barlow_Condensed",sans-serif] text-3xl font-extrabold tracking-tight',
            valueColor
          )}
        >
          {value}
        </span>
        {subtitle && (
          <span className="font-mono text-[11px] text-[rgba(224,240,232,0.45)] tracking-wide">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
