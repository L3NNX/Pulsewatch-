'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Edit3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, Monitor } from '@/lib/api';

const editSchema = z.object({
  name: z.string().min(1, 'Monitor name is required').max(100),
  url: z.string().url('Must be a valid URL starting with http:// or https://'),
  method: z.enum(['GET', 'HEAD']),
  intervalSeconds: z.coerce.number().min(60, 'Minimum interval is 60s'),
  timeoutMs: z.coerce.number().min(1000).max(30000),
  expectedStatusMin: z.coerce.number().min(100).max(599),
  expectedStatusMax: z.coerce.number().min(100).max(599),
});

type FormValues = z.infer<typeof editSchema>;

interface EditMonitorModalProps {
  isOpen: boolean;
  monitor: Monitor | null;
  onClose: () => void;
  onSuccess: (updated: Monitor) => void;
}

export function EditMonitorModal({ isOpen, monitor, onClose, onSuccess }: EditMonitorModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (monitor) {
      reset({
        name: monitor.name,
        url: monitor.url,
        method: monitor.method,
        intervalSeconds: monitor.intervalSeconds,
        timeoutMs: monitor.timeoutMs,
        expectedStatusMin: monitor.expectedStatusMin,
        expectedStatusMax: monitor.expectedStatusMax,
      });
    }
  }, [monitor, reset]);

  if (!isOpen || !monitor) return null;

  const onSubmit = async (values: FormValues) => {
    try {
      setServerError(null);
      const res = await api.updateMonitor(monitor.id, values);
      onSuccess(res.monitor);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to update monitor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171e19]/60 backdrop-blur-sm font-satoshi">
      <div
        className="w-full max-w-lg rounded-2xl border border-[#171e19]/10 bg-white p-7 text-[#171e19] shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#171e19]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ffe17c] flex items-center justify-center text-[#171e19]">
              <Edit3 className="h-4 w-4" />
            </div>
            <h2 id="edit-modal-title" className="font-anton text-2xl uppercase tracking-normal text-[#171e19]">
              EDIT MONITOR CONFIG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#171e19]/40 hover:text-[#171e19] transition-colors p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-50 p-3 text-xs font-medium text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Service / Endpoint Identifier"
            placeholder="e.g. Production API Gateway"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 space-y-1.5">
              <label htmlFor="edit-method-select" className="block text-xs font-bold text-[#171e19] uppercase tracking-wider">
                Method
              </label>
              <select
                id="edit-method-select"
                {...register('method')}
                className="flex h-11 w-full rounded-lg border border-[#171e19]/20 bg-white px-3 py-2 text-sm font-bold text-[#171e19] focus:outline-none focus:border-[#171e19]"
              >
                <option value="GET">GET</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <div className="col-span-3">
              <Input
                label="Target Endpoint URL"
                placeholder="https://api.example.com/health"
                error={errors.url?.message}
                {...register('url')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Interval (Seconds)"
              type="number"
              helperText="Minimum 60s"
              error={errors.intervalSeconds?.message}
              {...register('intervalSeconds')}
            />

            <Input
              label="Timeout (Milliseconds)"
              type="number"
              helperText="1,000ms - 30,000ms"
              error={errors.timeoutMs?.message}
              {...register('timeoutMs')}
            />
          </div>

          <div className="rounded-xl border border-[#171e19]/10 bg-[#f8f9fa] p-4 space-y-2">
            <span className="text-xs font-bold text-[#171e19] uppercase tracking-wider block">
              Expected Status Range
            </span>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="200"
                error={errors.expectedStatusMin?.message}
                {...register('expectedStatusMin')}
              />
              <span className="text-xs text-[#171e19]/50 font-bold uppercase">TO</span>
              <Input
                type="number"
                placeholder="399"
                error={errors.expectedStatusMax?.message}
                {...register('expectedStatusMax')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#171e19]/10">
            <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              <Save className="h-4 w-4 mr-1.5" />
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMonitorModal;
