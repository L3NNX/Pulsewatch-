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
            OPERATOR INITIALIZATION
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#171e19]/10 bg-white p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#171e19]/10 pb-4 flex items-center justify-between">
            <span className="text-xs font-anton uppercase text-[#171e19] flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[#171e19]" />
              CREATE FREE OPERATOR ACCOUNT
            </span>
            <span className="text-[10px] font-satoshi font-bold text-[#171e19]/50 uppercase tracking-widest">
              FREE FOREVER
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
              label="OPERATOR / TEAM ALIAS"
              placeholder="e.g. Gaurav Debnath"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="WORK EMAIL"
              type="email"
              placeholder="operator@organization.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="CREATE PASSWORD"
              type="password"
              placeholder="Minimum 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isSubmitting}>
              INITIALIZE ACCOUNT →
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center font-satoshi text-xs text-[#171e19]/70 font-medium">
          Already registered?{' '}
          <Link href="/login" className="text-[#171e19] font-bold underline hover:text-black">
            Sign In Here →
          </Link>
        </div>
      </div>
    </div>
  );
}
