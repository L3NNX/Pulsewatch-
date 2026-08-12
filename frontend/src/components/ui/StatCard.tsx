import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NumberTicker } from './number-ticker';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
  prefix = '',
  suffix = '',
  decimalPlaces = 0,
}: StatCardProps) {
  const isNumeric = typeof value === 'number';

  const dotColor = {
    default: 'bg-[#ffe17c]',
    success: 'bg-[#27c93f]',
    danger: 'bg-red-500',
    warning: 'bg-[#ffe17c]',
  }[variant];

  return (
    <div
      className={cn(
        'rounded-2xl border border-[#171e19]/10 bg-white p-6 brutalist-card select-none',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#171e19]/10 mb-3">
        <span className="font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/60">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', dotColor)} />
          <Icon className="h-4 w-4 text-[#171e19]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          {isNumeric ? (
            <NumberTicker
              value={value as number}
              prefix={prefix}
              suffix={suffix}
              decimalPlaces={decimalPlaces}
              className="font-anton text-4xl lg:text-5xl text-[#171e19] leading-none tracking-normal"
            />
          ) : (
            <span className="font-anton text-4xl lg:text-5xl text-[#171e19] leading-none tracking-normal">
              {value}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="mt-2 pt-2 border-t border-[#171e19]/5 font-satoshi text-xs text-[#171e19]/60 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default StatCard;
