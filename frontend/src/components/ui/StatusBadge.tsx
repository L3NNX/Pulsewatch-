import React from 'react';
import { cn } from '@/lib/utils';

export type MonitorStatus = 'UP' | 'DOWN' | 'PENDING' | 'PAUSED';

interface StatusBadgeProps {
  status?: MonitorStatus;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status = 'UP', label, className, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    UP: {
      defaultLabel: 'OPERATIONAL',
      dotColor: 'bg-[#27c93f]',
      border: 'border-green-500/20',
      bg: 'bg-green-500/10 text-green-700',
    },
    DOWN: {
      defaultLabel: 'OUTAGE',
      dotColor: 'bg-red-500',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10 text-red-600 font-bold',
    },
    PENDING: {
      defaultLabel: 'PROBING',
      dotColor: 'bg-[#ffe17c]',
      border: 'border-[#ffe17c]/50',
      bg: 'bg-[#ffe17c]/20 text-[#171e19]',
    },
    PAUSED: {
      defaultLabel: 'PAUSED',
      dotColor: 'bg-neutral-400',
      border: 'border-neutral-200',
      bg: 'bg-neutral-100 text-neutral-600',
    },
  }[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-satoshi text-xs font-bold uppercase tracking-wider select-none',
        statusConfig.border,
        statusConfig.bg,
        size === 'sm' && 'text-[10px] px-2.5 py-0.5 gap-1.5',
        className
      )}
      role="status"
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', statusConfig.dotColor)} />
      <span>{label || statusConfig.defaultLabel}</span>
    </span>
  );
}

export default StatusBadge;
