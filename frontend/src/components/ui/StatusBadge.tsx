import React from 'react';
import { cn } from '@/lib/utils';

export type MonitorStatus = 'UP' | 'DOWN' | 'PENDING' | 'PAUSED';

interface StatusBadgeProps {
  status: MonitorStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = {
    UP: {
      label: 'OPERATIONAL',
      dotClass: 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]',
      containerClasses: 'bg-[rgba(0,255,136,0.08)] text-[#00ff88] border-[rgba(0,255,136,0.3)]',
    },
    DOWN: {
      label: 'OUTAGE',
      dotClass: 'bg-[#ff3030] shadow-[0_0_8px_#ff3030] animate-pulse',
      containerClasses: 'bg-[rgba(255,48,48,0.1)] text-[#ff3030] border-[rgba(255,48,48,0.4)]',
    },
    PENDING: {
      label: 'PROBING',
      dotClass: 'bg-[#ffa000] shadow-[0_0_8px_#ffa000] animate-ping',
      containerClasses: 'bg-[rgba(255,160,0,0.1)] text-[#ffa000] border-[rgba(255,160,0,0.3)]',
    },
    PAUSED: {
      label: 'SUSPENDED',
      dotClass: 'bg-zinc-500',
      containerClasses: 'bg-zinc-900/60 text-zinc-400 border-zinc-800',
    },
  }[status] || {
    label: 'UNKNOWN',
    dotClass: 'bg-zinc-500',
    containerClasses: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-[11px] px-2.5 py-1 gap-2',
    lg: 'text-xs px-3.5 py-1.5 gap-2.5',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold tracking-wider uppercase border rounded-sm select-none',
        config.containerClasses,
        sizeClasses,
        className
      )}
      role="status"
    >
      <span className={cn('h-2 w-2 rounded-full shrink-0', config.dotClass)} />
      <span>{config.label}</span>
    </span>
  );
}
