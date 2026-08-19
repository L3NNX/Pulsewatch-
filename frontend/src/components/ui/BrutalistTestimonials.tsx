import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewItem {
  name: string;
  role: string;
  quote: string;
  avatarText?: string;
}

export function BrutalistTestimonials() {
  const reviews: ReviewItem[] = [
    {
      name: 'SARAH CONNOR',
      role: 'Staff DevOps Lead, HyperScale',
      quote:
        'PulseWatch replaced our $400/month Statuspage + Pingdom setup in a single morning. The 3-strike threshold stopped all false 3 AM paging alerts.',
      avatarText: 'SC',
    },
    {
      name: 'DEVIN LIANG',
      role: 'Founder & Solo Indie Hacker',
      quote:
        'The automated AI postmortems alone are worth gold. When our payment webhook proxy died, it drafted the incident explanation in 2.1 seconds.',
      avatarText: 'DL',
    },
    {
      name: 'MARCUS VANCE',
      role: 'Head of Reliability, FinRelay',
      quote:
        'Zero-leak public status pages were non-negotiable for our compliance audits. PulseWatch gives us pure enterprise hygiene on free-tier speed.',
      avatarText: 'MV',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto px-6 lg:px-8">
      {reviews.map((rev, idx) => {
        const isCenter = idx === 1;

        return (
          <div
            key={idx}
            className={cn(
              'p-8 rounded-2xl brutalist-card flex flex-col justify-between transition-all duration-300',
              isCenter
                ? 'bg-[#171e19] text-white lg:-translate-y-4 shadow-2xl border-2 border-[#ffe17c]/40'
                : 'bg-white text-[#171e19] border border-[#171e19]/10 shadow-md'
            )}
          >
            <div>
              {/* 5 star icons in #ffe17c */}
              <div className="flex items-center gap-1.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#ffe17c] text-[#ffe17c]"
                  />
                ))}
              </div>

              {/* Satoshi-medium body text (lg) */}
              <p
                className={cn(
                  'font-satoshi font-medium text-lg lg:text-xl leading-relaxed mb-8',
                  isCenter ? 'text-white' : 'text-[#171e19]'
                )}
              >
                "{rev.quote}"
              </p>
            </div>

            {/* Avatar footer: 12x12 (48px) with grayscale filters and 'Anton' uppercase names */}
            <div
              className={cn(
                'pt-6 border-t flex items-center gap-4',
                isCenter ? 'border-white/10' : 'border-[#171e19]/10'
              )}
            >
              <div
                className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center font-anton text-base shrink-0 filter grayscale shadow-xs',
                  isCenter ? 'bg-[#ffe17c] text-[#171e19]' : 'bg-[#171e19] text-white'
                )}
              >
                {rev.avatarText}
              </div>
              <div>
                <h4
                  className={cn(
                    'font-anton text-lg tracking-normal uppercase leading-tight',
                    isCenter ? 'text-white' : 'text-[#171e19]'
                  )}
                >
                  {rev.name}
                </h4>
                <p
                  className={cn(
                    'font-satoshi text-xs font-medium mt-0.5',
                    isCenter ? 'text-[#b7c6c2]' : 'text-[#171e19]/60'
                  )}
                >
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BrutalistTestimonials;

