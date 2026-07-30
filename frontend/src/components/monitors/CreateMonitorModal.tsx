'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, AlertTriangle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, Monitor } from '@/lib/api';

const createSchema = z.object({
  name: z.string().min(1, 'Monitor name is required').max(100),
  url: z.string().url('Must be a valid URL starting with http:// or https://'),
  method: z.enum(['GET', 'HEAD']),
  intervalSeconds: z.coerce.number().min(60, 'Minimum interval is 60 seconds (1 minute)'),
  timeoutMs: z.coerce.number().min(1000, 'Min 1s').max(30000, 'Max 30s'),
  expectedStatusMin: z.coerce.number().min(100).max(599),
  expectedStatusMax: z.coerce.number().min(100).max(599),
});

type FormValues = z.infer<typeof createSchema>;

interface CreateMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (monitor: Monitor) => void;
}

export function CreateMonitorModal({ isOpen, onClose, onSuccess }: CreateMonitorModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      url: 'https://',
      method: 'GET',
      intervalSeconds: 300,
      timeoutMs: 10000,
      expectedStatusMin: 200,
      expectedStatusMax: 399,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (values: FormValues) => {
    try {
      setServerError(null);
      const res = await api.createMonitor(values);
      reset();
      onSuccess(res.monitor);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to create monitor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div
        className="w-full max-w-md overflow-hidden border border-[rgba(0,255,136,0.3)] bg-[#0a121a] shadow-[0_0_30px_rgba(0,255,136,0.15)] text-[#e0f0e8]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.16)] px-5 py-3.5 bg-[#060b10]">
          <div className="flex items-center gap-2.5">
            <Radio className="h-4 w-4 text-[#00ff88]" />
            <h2 id="modal-title" className="font-['Barlow_Condensed',sans-serif] font-bold text-lg text-white uppercase tracking-wider">
              // ADD MONITORED ENDPOINT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(224,240,232,0.5)] hover:text-[#00ff88] transition-colors p-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 border border-[#ff3030]/60 bg-[#ff3030]/10 p-2.5 text-xs text-[#ff3030]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#ff3030]" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Service Name"
            placeholder="e.g. Production API Gateway"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-4 gap-2.5">
            <div className="col-span-1 space-y-1.5 font-mono">
              <label htmlFor="method-select" className="block text-[11px] font-semibold text-[rgba(224,240,232,0.6)] uppercase tracking-wider">
                // Method
              </label>
              <select
                id="method-select"
                {...register('method')}
                className="flex h-9 w-full border border-[rgba(0,255,136,0.18)] bg-[rgba(6,11,16,0.8)] px-2 py-1 text-xs text-[#00ff88] font-mono focus-visible:outline-none focus-visible:border-[#00ff88]"
              >
                <option value="GET">GET</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <div className="col-span-3">
              <Input
                label="Endpoint URL"
                placeholder="https://api.example.com/health"
                error={errors.url?.message}
                {...register('url')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Interval (sec)"
              type="number"
              helperText="Min 60s"
              error={errors.intervalSeconds?.message}
              {...register('intervalSeconds')}
            />

            <Input
              label="Timeout (ms)"
              type="number"
              helperText="Default 10,000ms"
              error={errors.timeoutMs?.message}
              {...register('timeoutMs')}
            />
          </div>

          <div className="border border-[rgba(0,255,136,0.16)] bg-[#060b10] p-3 space-y-2">
            <span className="text-[10px] font-semibold text-[rgba(0,255,136,0.8)] uppercase tracking-wider block">
              // Expected Status Range
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="200"
                error={errors.expectedStatusMin?.message}
                {...register('expectedStatusMin')}
              />
              <span className="text-xs text-[rgba(224,240,232,0.4)] font-mono">to</span>
              <Input
                type="number"
                placeholder="399"
                error={errors.expectedStatusMax?.message}
                {...register('expectedStatusMax')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[rgba(0,255,136,0.16)]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              DEPLOY & PROBE NOW →
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
