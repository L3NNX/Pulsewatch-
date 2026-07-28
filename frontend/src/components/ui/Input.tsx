import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-mono">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-semibold text-[rgba(224,240,232,0.6)] uppercase tracking-wider">
            // {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-9 w-full border bg-[rgba(6,11,16,0.8)] px-3 py-1.5 text-xs text-[#e0f0e8] placeholder:text-[rgba(224,240,232,0.3)] transition-all focus-visible:outline-none focus-visible:border-[#00ff88] focus-visible:shadow-[0_0_10px_rgba(0,255,136,0.2)] disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[#ff3030] focus-visible:border-[#ff3030] focus-visible:shadow-[0_0_10px_rgba(255,48,48,0.2)]'
              : 'border-[rgba(0,255,136,0.18)] hover:border-[rgba(0,255,136,0.35)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] text-[#ff3030] font-semibold tracking-wide">{error}</p>}
        {!error && helperText && <p className="text-[10px] text-[rgba(224,240,232,0.4)] tracking-wide">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
