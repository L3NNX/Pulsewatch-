'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, ArrowRight, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      setServerError(null);
      await api.register(values);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || 'Registration rejected. Please verify input.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#060b10] text-[#e0f0e8] font-mono relative overflow-hidden">
      {/* Scanlines and Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-60 z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.25) 2px, rgba(0, 0, 0, 0.25) 4px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 136, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff88] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
            </span>
            <span className="font-['Barlow_Condensed',sans-serif] font-black text-2xl tracking-[0.16em] text-[#00ff88] uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              PULSEWATCH
            </span>
          </Link>
          <div className="text-[10px] text-[rgba(224,240,232,0.45)] tracking-[0.2em] uppercase">
            // OPERATOR REGISTRATION PROTOCOL
          </div>
        </div>

        {/* Console Chassis Box */}
        <div className="border border-[rgba(0,255,136,0.22)] bg-[rgba(10,18,26,0.9)] p-6 space-y-5 shadow-[0_0_30px_rgba(0,255,136,0.06)]">
          <div className="border-b border-[rgba(0,255,136,0.12)] pb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00ff88] tracking-wider uppercase flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              INITIALIZE NEW OPERATOR
            </span>
            <span className="text-[9px] text-[rgba(224,240,232,0.4)] tracking-widest uppercase">
              TIER: FREE (10 MONITORS)
            </span>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 border border-[#ff3030]/60 bg-[#ff3030]/10 p-2.5 text-xs text-[#ff3030]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#ff3030]" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="OPERATOR NAME"
              placeholder="e.g. Chief SRE"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="DISPATCH EMAIL"
              type="email"
              placeholder="operator@organization.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="MASTER KEY / PASSWORD"
              type="password"
              placeholder="Min 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
              CREATE OPERATOR ACCOUNT →
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-[rgba(224,240,232,0.5)]">
          Already have credentials?{' '}
          <Link href="/login" className="text-[#00ff88] hover:underline font-semibold">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

// Accessibility: password strength indicator planned for v1.2
