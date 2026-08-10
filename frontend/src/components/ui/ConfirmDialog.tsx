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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171e19]/60 backdrop-blur-sm font-satoshi">
      <div
        className="w-full max-w-md rounded-2xl border border-[#171e19]/10 bg-white p-7 text-[#171e19] shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start gap-4">
          {isDanger && (
            <div className="p-2.5 rounded-xl border border-red-500/20 bg-red-50 text-red-500 shrink-0">
              <AlertTriangle className="h-6 w-6 stroke-[2]" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1">
            <h3 id="dialog-title" className="font-anton text-2xl text-[#171e19] uppercase tracking-normal">
              {title}
            </h3>
            <p className="mt-2 text-sm font-satoshi text-[#171e19]/70 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#171e19]/40 hover:text-[#171e19] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#171e19]/10">
          <Button variant="ghost" size="md" onClick={handleDismiss} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="md"
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

export default ConfirmDialog;
