import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      'bg-[#ffe17c] text-[#171e19] border-2 border-[#171e19] hover:bg-[#ffd850] hover:scale-105 active:scale-95 font-anton uppercase tracking-wide shadow-sm',
    secondary:
      'bg-[#171e19] text-white hover:bg-[#272727] font-satoshi font-bold hover:scale-105 active:scale-95 shadow-sm',
    ghost:
      'bg-transparent text-[#171e19] border border-[#171e19]/15 hover:bg-neutral-100 font-satoshi font-medium',
    outline:
      'bg-transparent text-[#171e19] border-2 border-[#171e19] hover:bg-[#171e19] hover:text-white font-satoshi font-bold',
    danger:
      'bg-red-500 text-white hover:bg-red-600 font-satoshi font-bold shadow-sm',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 h-8 gap-1.5 rounded-md',
    md: 'text-sm px-5 py-2.5 h-11 gap-2 rounded-lg',
    lg: 'text-base px-7 py-3.5 h-13 gap-2.5 rounded-xl',
  }[size];

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles,
        sizeStyles,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {children}
    </button>
  );
}

export default Button;
