import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#171e19]/15 bg-[#f8f9fa] py-14 px-6 text-center select-none">
      <div className="rounded-2xl border border-[#171e19]/10 bg-white p-4 text-[#171e19] shadow-xs">
        <Icon className="h-8 w-8 stroke-[1.5]" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-anton text-2xl text-[#171e19] uppercase tracking-normal">{title}</h3>
      <p className="mt-2 max-w-sm font-satoshi text-sm text-[#171e19]/70 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button size="md" variant="primary" onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#171e19]/5 rounded-xl ${className || ''}`}
      aria-hidden="true"
    />
  );
}

export default EmptyState;
