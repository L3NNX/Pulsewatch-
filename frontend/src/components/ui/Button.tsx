import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
  style,
  ...props
}: ButtonProps) {
  const isChamfered = variant === 'primary' || variant === 'danger';

  const variantStyles = {
    primary:
      'bg-[#00ff88] text-[#060b10] font-["Barlow_Condensed",sans-serif] font-bold uppercase tracking-[0.14em] hover:shadow-[0_0_16px_rgba(0,255,136,0.5)] active:translate-y-[1px] transition-all',
    secondary:
      'bg-[rgba(10,18,26,0.85)] text-[#e0f0e8] font-mono text-xs uppercase tracking-wider border border-[rgba(0,255,136,0.25)] hover:border-[#00ff88] hover:text-[#00ff88] hover:bg-[rgba(0,255,136,0.06)] active:translate-y-[1px] transition-all',
    outline:
      'border border-[rgba(0,255,136,0.2)] bg-transparent text-[rgba(224,240,232,0.8)] font-mono text-xs uppercase tracking-wider hover:border-[#00ff88] hover:text-[#00ff88] active:translate-y-[1px] transition-all',
    danger:
      'bg-[#ff3030] text-[#060b10] font-["Barlow_Condensed",sans-serif] font-bold uppercase tracking-[0.14em] hover:shadow-[0_0_16px_rgba(255,48,48,0.5)] active:translate-y-[1px] transition-all',
    ghost:
      'bg-transparent text-[rgba(224,240,232,0.55)] font-mono text-xs uppercase tracking-wider hover:text-[#00ff88] hover:bg-[rgba(0,255,136,0.06)] transition-all',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  }[size];

  const chamferStyle = isChamfered
    ? {
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        ...style,
      }
    : style;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff88] disabled:opacity-40 disabled:pointer-events-none select-none',
        variantStyles,
        sizeStyles,
        className
      )}
      style={chamferStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />}
      {children}
    </button>
  );
}
