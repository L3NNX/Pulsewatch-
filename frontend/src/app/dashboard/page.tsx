'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertOctagon,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { api, Monitor } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState, Skeleton } from '@/components/ui/EmptyState';
import { CreateMonitorModal } from '@/components/monitors/CreateMonitorModal';
import { EditMonitorModal } from '@/components/monitors/EditMonitorModal';
import { formatTimeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UP' | 'DOWN' | 'PAUSED'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [deletingMonitor, setDeletingMonitor] = useState<Monitor | null>(null);
  const [probingId, setProbingId] = useState<string | null>(null);

  // 1. Fetch current user session
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.getMe(),
    retry: false,
  });

  const user = userData?.user;

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // 2. Fetch monitors with 15s polling
  const {
    data: monitorsData,
    isLoading: isMonitorsLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['monitors'],
    queryFn: () => api.getMonitors(),
    enabled: !!user,
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: false,
  });

  const monitors = monitorsData?.monitors || [];

  // Mutations
  const pauseMutation = useMutation({
    mutationFn: (id: string) => api.pauseMonitor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitors'] }),
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => api.resumeMonitor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitors'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMonitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
      setDeletingMonitor(null);
    },
  });

  // Manual Check
  const handleManualCheck = async (id: string) => {
    setProbingId(id);
    try {
      await api.checkMonitor(id);
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
    } catch (err) {
      console.error('Manual probe error:', err);
    } finally {
      setTimeout(() => setProbingId(null), 1000);
    }
  };

  // Filter logic
  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Counts
  const totalMonitors = monitors.length;
  const operationalCount = monitors.filter((m) => m.status === 'UP').length;
  const downCount = monitors.filter((m) => m.status === 'DOWN').length;
  const pausedCount = monitors.filter((m) => m.status === 'PAUSED').length;

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-satoshi">
        <div className="rounded-2xl border border-[#171e19]/10 p-8 flex items-center gap-3 text-sm font-bold text-[#171e19] shadow-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-[#ffe17c]" />
          <span>INITIALIZING CONSOLE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171e19] font-satoshi selection:bg-[#ffe17c] selection:text-[#171e19]">
      <Navbar user={user} />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 lg:px-8 pt-28 pb-16 space-y-8">
        {/* Header & Main Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#171e19]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#171e19]/10 font-anton text-xs uppercase text-[#171e19] mb-2">
              <span className="h-2 w-2 rounded-full bg-[#ffe17c]" />
              COMMAND CENTER
            </div>
            <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-normal text-[#171e19] flex items-center gap-4">
              MONITORS & TELEMETRY
              {isRefetching && (
                <span className="text-xs font-satoshi font-semibold text-[#171e19]/60 flex items-center gap-1.5 normal-case tracking-normal">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#ffe17c]" />
                  Refreshing...
                </span>
              )}
            </h1>
            <p className="font-satoshi text-base text-[#171e19]/70 mt-1">
              Live probes scheduled continuously at 60s intervals. 3-strike flap-proofing active.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              ADD MONITOR
            </Button>
          </div>
        </div>

        {/* Statistical Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="TOTAL ENDPOINTS"
            value={totalMonitors}
            subtitle="/ 10 FREE LIMIT"
            icon={Activity}
          />
          <StatCard
            title="OPERATIONAL SERVICES"
            value={operationalCount}
            subtitle={totalMonitors > 0 ? `${Math.round((operationalCount / totalMonitors) * 100)}% HEALTHY` : '—'}
            icon={CheckCircle2}
            variant={operationalCount > 0 ? 'success' : 'default'}
          />
          <StatCard
            title="ACTIVE OUTAGES"
            value={downCount}
            subtitle={downCount > 0 ? 'ATTENTION REQUIRED' : 'ALL NOMINAL'}
            icon={AlertOctagon}
            variant={downCount > 0 ? 'danger' : 'default'}
          />
          <StatCard
            title="PAUSED PROBES"
            value={pausedCount}
            subtitle="MANUALLY SUSPENDED"
            icon={PauseCircle}
          />
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#171e19]/40" />
            <input
              type="text"
              placeholder="Search monitor by name or target URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#171e19]/15 bg-white pl-11 pr-4 py-3 text-sm font-satoshi text-[#171e19] placeholder:text-[#171e19]/40 focus:outline-none focus:border-[#171e19] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f8f9fa] border border-[#171e19]/10">
            {(['ALL', 'UP', 'DOWN', 'PAUSED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-satoshi font-bold rounded-lg transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-[#171e19] text-[#ffe17c] shadow-xs'
                    : 'text-[#171e19]/70 hover:text-[#171e19] hover:bg-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Monitors Console Table */}
        <div className="rounded-2xl border border-[#171e19]/10 bg-white shadow-sm overflow-hidden">
          {isMonitorsLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : filteredMonitors.length === 0 ? (
            <div className="p-16 text-center">
              <EmptyState
                icon={Activity}
                title={monitors.length === 0 ? 'NO MONITORS CONFIGURED YET' : 'NO MATCHING MONITORS'}
                description={
                  monitors.length === 0
                    ? 'Deploy your first HTTP/HTTPS health probe to start automated monitoring with instant multi-channel alerts.'
                    : 'Try clearing your search query or adjust status filters to see other services.'
                }
                actionLabel={monitors.length === 0 ? '+ DEPLOY FIRST MONITOR' : undefined}
                onAction={monitors.length === 0 ? () => setIsCreateModalOpen(true) : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#171e19]/10 bg-[#f8f9fa] text-[#171e19]/60 font-anton uppercase tracking-wider text-xs">
                    <th className="py-4 px-6">SERVICE NAME</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6">24H UPTIME</th>
                    <th className="py-4 px-6">RESPONSE</th>
                    <th className="py-4 px-6">LAST PROBE</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171e19]/5 font-satoshi">
                  {filteredMonitors.map((m) => (
                    <tr
                      key={m.id}
                      className="group hover:bg-[#f8f9fa]/70 transition-colors"
                    >
                      {/* Name & Target */}
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-anton text-lg uppercase text-[#171e19] group-hover:text-[#171e19] transition-colors leading-tight">
                            {m.name}
                          </span>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#171e19]/60 hover:text-[#171e19] transition-colors"
                          >
                            <span className="px-1.5 py-0.5 rounded bg-[#f8f9fa] border border-[#171e19]/10 text-[10px] font-bold text-[#171e19]">
                              {m.method}
                            </span>
                            <span className="truncate max-w-sm font-mono text-xs">{m.url}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-5 px-6">
                        <StatusBadge status={m.status} />
                      </td>

                      {/* 24h Uptime */}
                      <td className="py-5 px-6">
                        <div className="space-y-1.5">
                          <span
                            className={`font-anton text-base tabular-nums ${
                              (m.uptime24h ?? 100) >= 99
                                ? 'text-green-600'
                                : (m.uptime24h ?? 100) >= 95
                                ? 'text-[#171e19]'
                                : 'text-red-500 font-bold'
                            }`}
                          >
                            {(m.uptime24h ?? 100).toFixed(1)}%
                          </span>
                          <div className="h-2 w-28 bg-[#f8f9fa] rounded-full border border-[#171e19]/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                (m.uptime24h ?? 100) >= 99
                                  ? 'bg-[#27c93f]'
                                  : (m.uptime24h ?? 100) >= 95
                                  ? 'bg-[#ffe17c]'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${m.uptime24h ?? 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Avg Response Time */}
                      <td className="py-5 px-6 tabular-nums">
                        {m.avgResponseTimeMs ? (
                          <span
                            className={`font-anton text-base ${
                              m.avgResponseTimeMs < 200
                                ? 'text-green-600'
                                : m.avgResponseTimeMs < 800
                                ? 'text-[#171e19]'
                                : 'text-red-500'
                            }`}
                          >
                            {m.avgResponseTimeMs}ms
                          </span>
                        ) : (
                          <span className="text-[#171e19]/30 font-satoshi">—</span>
                        )}
                      </td>

                      {/* Last Checked */}
                      <td className="py-5 px-6 text-[#171e19]/60 text-xs font-medium">
                        {m.lastCheckedAt ? formatTimeAgo(m.lastCheckedAt) : 'Just now'}
                      </td>

                      {/* Actions */}
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Manual Probe Now button */}
                          <button
                            onClick={() => handleManualCheck(m.id)}
                            disabled={probingId === m.id}
                            className="p-2 rounded-lg border border-[#171e19]/10 bg-white text-[#171e19] hover:bg-[#ffe17c] transition-colors disabled:opacity-40"
                            title="Execute immediate probe"
                          >
                            <Zap className={`h-4 w-4 ${probingId === m.id ? 'animate-bounce text-[#171e19]' : ''}`} />
                          </button>

                          {/* Pause / Resume */}
                          {m.status === 'PAUSED' ? (
                            <button
                              onClick={() => resumeMutation.mutate(m.id)}
                              disabled={resumeMutation.isPending}
                              className="p-2 rounded-lg border border-[#171e19]/10 bg-white text-[#171e19] hover:bg-[#27c93f] hover:text-white transition-colors"
                              title="Resume monitor"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseMutation.mutate(m.id)}
                              disabled={pauseMutation.isPending}
                              className="p-2 rounded-lg border border-[#171e19]/10 bg-white text-[#171e19]/70 hover:text-[#171e19] hover:bg-neutral-100 transition-colors"
                              title="Pause monitor"
                            >
                              <PauseCircle className="h-4 w-4" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => setEditingMonitor(m)}
                            className="p-2 rounded-lg border border-[#171e19]/10 bg-white text-[#171e19]/70 hover:text-[#171e19] hover:bg-neutral-100 transition-colors"
                            title="Edit monitor config"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingMonitor(m)}
                            className="p-2 rounded-lg border border-[#171e19]/10 bg-white text-[#171e19]/70 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                            title="Delete monitor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Monitor Modal */}
      <CreateMonitorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['monitors'] });
        }}
      />

      {/* Edit Monitor Modal */}
      {editingMonitor && (
        <EditMonitorModal
          isOpen={!!editingMonitor}
          monitor={editingMonitor}
          onClose={() => setEditingMonitor(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
            setEditingMonitor(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingMonitor && (
        <ConfirmDialog
          isOpen={!!deletingMonitor}
          title="DELETE MONITORED ENDPOINT"
          description={`Are you sure you want to permanently delete "${deletingMonitor.name}"? All historical check logs and incident records will be erased immediately.`}
          confirmLabel="DELETE NOW"
          variant="danger"
          onClose={() => setDeletingMonitor(null)}
          onConfirm={() => deleteMutation.mutate(deletingMonitor.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
