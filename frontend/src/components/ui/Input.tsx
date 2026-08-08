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
      <div className="w-full space-y-1.5 font-satoshi">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[#171e19] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-[#171e19]/20 bg-white px-4 py-2 text-sm font-satoshi text-[#171e19] placeholder:text-[#171e19]/40 transition-colors shadow-xs',
            'focus-visible:outline-none focus-visible:border-[#171e19] focus-visible:ring-1 focus-visible:ring-[#171e19]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:border-red-500 text-red-600',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#171e19]/60 font-medium mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
