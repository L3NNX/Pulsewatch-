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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 py-12 px-6 text-center">
      <div className="rounded-lg bg-zinc-900 p-3 text-zinc-400 border border-zinc-800">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-3.5 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-zinc-400 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button size="sm" onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-850/60 ${className || ''}`}
      aria-hidden="true"
    />
  );
}
