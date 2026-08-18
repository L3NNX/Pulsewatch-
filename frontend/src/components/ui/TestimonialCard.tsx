import React from 'react';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatarText?: string;
  avatarUrl?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  title,
  avatarText,
  avatarUrl,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'border border-[rgba(58,58,56,0.20)] bg-[#F7F7F5] p-6 flex flex-col justify-between rounded-none select-none transition-colors duration-150 hover:border-[#1A3C2B]',
        className
      )}
    >
      <div>
        {/* Top: Quote icon and star ratings */}
        <div className="flex items-center justify-between border-b border-[rgba(58,58,56,0.15)] pb-3 mb-4">
          <Quote className="h-4 w-4 text-[#1A3C2B] fill-[#1A3C2B]/10 stroke-[1.5]" />
          <div className="flex items-center gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 fill-[#F4D35E] text-[#F4D35E]"
              />
            ))}
          </div>
        </div>

        {/* Body: Monospaced text at 12px, line-height 1.6 */}
        <p className="font-mono text-xs leading-[1.6] text-[#3A3A38]/90">
          "{quote}"
        </p>
      </div>

      {/* Bottom: 1px top border with user avatar and name/title in JetBrains Mono */}
      <div className="mt-6 pt-3 border-t border-[rgba(58,58,56,0.15)] flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-9 w-9 rounded-none border border-[rgba(58,58,56,0.20)] blueprint-image object-cover"
          />
        ) : (
          <div className="h-9 w-9 rounded-none border border-[rgba(58,58,56,0.20)] bg-white flex items-center justify-center font-mono text-xs font-bold text-[#1A3C2B]">
            {avatarText || name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="font-mono text-[11px] leading-tight">
          <div className="font-bold text-[#1A3C2B] uppercase tracking-wider">{name}</div>
          <div className="text-[10px] text-[#3A3A38]/60 uppercase tracking-widest mt-0.5">{title}</div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;

