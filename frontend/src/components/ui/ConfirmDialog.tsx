import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  isDestructive = false,
  variant,
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleDismiss = onCancel || onClose || (() => {});
  const isDanger = isDestructive || variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div
        className="w-full max-w-sm overflow-hidden border border-[rgba(255,48,48,0.4)] bg-[#0a121a] p-5 shadow-[0_0_25px_rgba(255,48,48,0.2)] text-[#e0f0e8]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start gap-3">
          {isDanger && (
            <div className="p-2 border border-[#ff3030]/50 bg-[#ff3030]/10 text-[#ff3030]">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1">
            <h3 id="dialog-title" className="font-['Barlow_Condensed',sans-serif] font-bold text-lg text-white uppercase tracking-wider">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-[rgba(224,240,232,0.6)] leading-relaxed font-mono">
              {description}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[rgba(224,240,232,0.4)] hover:text-[#00ff88] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[rgba(0,255,136,0.16)]">
          <Button variant="secondary" size="sm" onClick={handleDismiss} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
