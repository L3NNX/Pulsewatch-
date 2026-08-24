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
    <div className="min-h-screen flex items-center justify-center p-6 bg-grid-pattern text-[#171e19] font-satoshi relative">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-anton text-4xl uppercase tracking-normal text-[#171e19]">
              PULSEWATCH<span className="text-[#ffe17c]">.</span>
            </span>
          </Link>
          <div className="text-xs font-satoshi font-bold text-[#171e19]/60 uppercase tracking-widest">
            OPERATOR SIGN IN
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#171e19]/10 bg-white p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#171e19]/10 pb-4 flex items-center justify-between">
            <span className="text-xs font-anton uppercase text-[#171e19] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#171e19]" />
              AUTHENTICATE IDENTITY
            </span>
            <span className="text-[10px] font-satoshi font-bold text-[#171e19]/50 uppercase tracking-widest">
              SECURE TLS
            </span>
          </div>

          {serverError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-50 p-3 text-xs font-medium text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
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
              label="ACCESS SECRET / PASSWORD"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isSubmitting}>
              SIGN IN TO CONSOLE →
            </Button>
          </form>

          {/* Quick Demo Fill button */}
          <div className="pt-4 border-t border-[#171e19]/10">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#171e19]/20 bg-[#f8f9fa] text-xs font-satoshi text-[#171e19] hover:bg-[#ffe17c] transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <Key className="h-4 w-4" />
              AUTO-FILL DEMO CREDENTIALS
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center font-satoshi text-xs text-[#171e19]/70 font-medium">
          Need an account?{' '}
          <Link href="/register" className="text-[#171e19] font-bold underline hover:text-black">
            Register Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}
