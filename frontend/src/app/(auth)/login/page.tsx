'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setServerError(null);
      await api.login(values);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || 'Authentication rejected. Verify credentials.');
    }
  };

  const handleDemoFill = () => {
    setValue('email', 'demo@pulsewatch.dev');
    setValue('password', 'demo123456');
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
            // NOC CONSOLE ACCESS GATEWAY
          </div>
        </div>

        {/* Console Chassis Box */}
        <div className="border border-[rgba(0,255,136,0.22)] bg-[rgba(10,18,26,0.9)] p-6 space-y-5 shadow-[0_0_30px_rgba(0,255,136,0.06)]">
          <div className="border-b border-[rgba(0,255,136,0.12)] pb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00ff88] tracking-wider uppercase flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              AUTHENTICATE IDENTITY
            </span>
            <span className="text-[9px] text-[rgba(224,240,232,0.4)] tracking-widest uppercase">
              TLS 1.3
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
              label="OPERATOR EMAIL"
              type="email"
              placeholder="operator@organization.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="ACCESS KEY / PASSWORD"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
              AUTHENTICATE & ENTER →
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Fill button */}
          <div className="pt-2 border-t border-[rgba(0,255,136,0.1)]">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-1.5 px-3 border border-dashed border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.04)] text-[11px] text-[#00ff88] hover:bg-[rgba(0,255,136,0.1)] transition-all flex items-center justify-center gap-2"
            >
              <Key className="h-3 w-3" />
              AUTO-FILL DEMO CREDENTIALS
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-[rgba(224,240,232,0.5)]">
          Need an operator terminal?{' '}
          <Link href="/register" className="text-[#00ff88] hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

// Accessibility: form inputs have aria-labels matching visual labels
