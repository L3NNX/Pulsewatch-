'use client';

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number;
  startValue?: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  decimalPlaces = 0,
  className,
  suffix = '',
  prefix = '',
  ...props
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    startValue.toFixed(decimalPlaces)
  );
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Ease-out mechanical curve (Newsprint aesthetic: fast initial ramp)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current =
          direction === 'down'
            ? value + (startValue - value) * (1 - easeOut)
            : startValue + (value - startValue) * easeOut;

        setDisplayValue(
          Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(current.toFixed(decimalPlaces)))
        );

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, startValue, direction, delay, decimalPlaces]);

  return (
    <span
      ref={elementRef}
      className={cn(
        'inline-block tabular-nums font-mono font-bold tracking-tight text-[#111111]',
        className
      )}
      {...props}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default NumberTicker;

