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

  // 2. Fetch monitors with 30s polling
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
      setDeletingMonitor(null);
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
  });

  const handleManualCheck = async (id: string) => {
    try {
      setProbingId(id);
      await api.checkMonitor(id);
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
    } catch (err) {
      console.error('Manual probe failed:', err);
    } finally {
      setProbingId(null);
    }
  };

  // Metrics summary
  const totalMonitors = monitors.length;
  const operationalCount = monitors.filter((m) => m.status === 'UP').length;
  const downCount = monitors.filter((m) => m.status === 'DOWN').length;
  const pausedCount = monitors.filter((m) => m.status === 'PAUSED').length;

  // Filter monitors
  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#060b10] flex items-center justify-center font-mono">
        <div className="flex items-center gap-2.5 text-[#00ff88] text-xs">
          <RefreshCw className="h-4 w-4 animate-spin text-[#00ff88]" />
          <span className="tracking-widest">// INITIALIZING NOC TELEMETRY ENGINE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060b10] text-[#e0f0e8] font-mono selection:bg-[#00ff88]/20 selection:text-[#00ff88] relative">
      <Navbar user={user} />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 z-10">
        {/* Header & Main Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(0,255,136,0.16)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#00ff88] mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
              <span>[ RADAR ACTIVE ] TELEMETRY MATRIX</span>
            </div>
            <h1 className="font-['Barlow_Condensed',sans-serif] font-black text-3xl uppercase tracking-tight text-white flex items-center gap-3">
              SERVICE HEALTH & TELEMETRY
              {isRefetching && (
                <span className="text-[11px] font-mono text-[#00ff88] flex items-center gap-1.5 font-normal tracking-wider">
                  <RefreshCw className="h-3 w-3 animate-spin text-[#00ff88]" />
                  POLLING...
                </span>
              )}
            </h1>
            <p className="text-xs text-[rgba(224,240,232,0.45)] mt-0.5 tracking-wider">
              PROBES SCHEDULED EVERY 60s–300s • KERNEL RETENTION 30 DAYS
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
              SYNC
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              ADD MONITOR
            </Button>
          </div>
        </div>

        {/* Industrial Metric Rack */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="TOTAL ENDPOINTS"
            value={totalMonitors}
            subtitle="/ 10 FREE LIMIT"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="OPERATIONAL CONSENSUS"
            value={operationalCount}
            subtitle={totalMonitors > 0 ? `${Math.round((operationalCount / totalMonitors) * 100)}% ACTIVE` : '—'}
            icon={CheckCircle2}
            variant={operationalCount > 0 ? 'success' : 'default'}
          />
          <StatCard
            title="ACTIVE OUTAGES"
            value={downCount}
            subtitle={downCount > 0 ? 'ATTENTION REQUIRED' : 'ALL SYSTEMS NOMINAL'}
            icon={AlertOctagon}
            variant={downCount > 0 ? 'danger' : 'default'}
          />
          <StatCard
            title="SUSPENDED PROBES"
            value={pausedCount}
            subtitle="MANUALLY PAUSED"
            icon={PauseCircle}
            variant="default"
          />
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[rgba(0,255,136,0.5)]" />
            <input
              type="text"
              placeholder="// Search endpoint name or target URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[rgba(0,255,136,0.18)] bg-[rgba(10,18,26,0.85)] pl-9 pr-3 py-2 text-xs text-[#e0f0e8] placeholder:text-[rgba(224,240,232,0.3)] transition-all focus-visible:outline-none focus-visible:border-[#00ff88] focus-visible:shadow-[0_0_10px_rgba(0,255,136,0.2)]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 border border-[rgba(0,255,136,0.18)] bg-[rgba(10,18,26,0.85)]">
            {(['ALL', 'UP', 'DOWN', 'PAUSED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-[#00ff88] text-[#060b10] font-bold shadow-[0_0_8px_rgba(0,255,136,0.4)]'
                    : 'text-[rgba(224,240,232,0.5)] hover:text-[#00ff88]'
                }`}
              >
                [{status}]
              </button>
            ))}
          </div>
        </div>

        {/* Monitors Console Table */}
        <div className="border border-[rgba(0,255,136,0.18)] bg-[rgba(10,18,26,0.9)] shadow-[0_0_20px_rgba(0,255,136,0.03)]">
          {isMonitorsLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredMonitors.length === 0 ? (
            <div className="p-12 text-center">
              <EmptyState
                icon={Activity}
                title={monitors.length === 0 ? 'NO MONITORED ENDPOINTS ACTIVE' : 'NO MATCHING TELEMETRY RECORDS'}
                description={
                  monitors.length === 0
                    ? 'Deploy your first HTTP/HTTPS probe endpoint to initialize automated telemetry and instant incident alerting.'
                    : 'Adjust query filters or clear the search criteria to inspect other active endpoints.'
                }
                actionLabel={monitors.length === 0 ? '+ ADD FIRST ENDPOINT' : undefined}
                onAction={monitors.length === 0 ? () => setIsCreateModalOpen(true) : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(0,255,136,0.16)] bg-[rgba(6,11,16,0.95)] text-[rgba(0,255,136,0.7)] uppercase tracking-[0.16em] text-[10px]">
                    <th className="py-3 px-5">// TARGET SERVICE</th>
                    <th className="py-3 px-5">// STATUS</th>
                    <th className="py-3 px-5">// 24H CONSENSUS</th>
                    <th className="py-3 px-5">// LATENCY</th>
                    <th className="py-3 px-5">// LAST PROBE</th>
                    <th className="py-3 px-5 text-right">// COMMANDS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,255,136,0.08)] text-[11px]">
                  {filteredMonitors.map((m) => (
                    <tr
                      key={m.id}
                      className="group hover:bg-[rgba(0,255,136,0.04)] transition-colors"
                    >
                      {/* Name & Target */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col">
                          <span className="font-['Barlow_Condensed',sans-serif] font-bold text-base tracking-wider uppercase text-white group-hover:text-[#00ff88] transition-colors">
                            {m.name}
                          </span>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-[rgba(224,240,232,0.45)] hover:text-[#00ff88] transition-colors"
                          >
                            <span className="px-1.5 py-0.2 bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)] text-[#00ff88] text-[9px] font-bold">
                              {m.method}
                            </span>
                            <span className="truncate max-w-sm font-mono">{m.url}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                          </a>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-5">
                        <StatusBadge status={m.status} size="sm" />
                      </td>

                      {/* 24h Uptime */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          <span
                            className={`font-bold tabular-nums ${
                              (m.uptime24h ?? 100) >= 99
                                ? 'text-[#00ff88]'
                                : (m.uptime24h ?? 100) >= 95
                                ? 'text-[#ffa000]'
                                : 'text-[#ff3030]'
                            }`}
                          >
                            {(m.uptime24h ?? 100).toFixed(1)}%
                          </span>
                          <div className="h-1.5 w-24 bg-[#060b10] border border-[rgba(0,255,136,0.15)] overflow-hidden">
                            <div
                              className={`h-full ${
                                (m.uptime24h ?? 100) >= 99
                                  ? 'bg-[#00ff88] shadow-[0_0_6px_#00ff88]'
                                  : (m.uptime24h ?? 100) >= 95
                                  ? 'bg-[#ffa000] shadow-[0_0_6px_#ffa000]'
                                  : 'bg-[#ff3030] shadow-[0_0_6px_#ff3030]'
                              }`}
                              style={{ width: `${m.uptime24h ?? 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Avg Response Time */}
                      <td className="py-3.5 px-5 tabular-nums">
                        {m.avgResponseTimeMs ? (
                          <span
                            className={`font-semibold ${
                              m.avgResponseTimeMs < 200
                                ? 'text-[#00ff88]'
                                : m.avgResponseTimeMs < 800
                                ? 'text-[#ffa000]'
                                : 'text-[#ff3030]'
                            }`}
                          >
                            {m.avgResponseTimeMs}ms
                          </span>
                        ) : (
                          <span className="text-[rgba(224,240,232,0.3)]">—</span>
                        )}
                      </td>

                      {/* Last Checked */}
                      <td className="py-3.5 px-5 text-[rgba(224,240,232,0.5)]">
                        {m.lastCheckedAt ? formatTimeAgo(m.lastCheckedAt) : 'JUST NOW'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Manual Probe Now button */}
                          <button
                            onClick={() => handleManualCheck(m.id)}
                            disabled={probingId === m.id}
                            className="p-1.5 border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.06)] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#060b10] transition-all disabled:opacity-40"
                            title="Execute immediate probe"
                            aria-label="Probe now"
                          >
                            <Zap className={`h-3.5 w-3.5 ${probingId === m.id ? 'animate-bounce text-[#ffa000]' : ''}`} />
                          </button>

                          {/* Pause / Resume */}
                          {m.status === 'PAUSED' ? (
                            <button
                              onClick={() => resumeMutation.mutate(m.id)}
                              disabled={resumeMutation.isPending}
                              className="p-1.5 border border-[rgba(0,255,136,0.2)] text-[#00ff88] hover:bg-[rgba(0,255,136,0.15)] transition-colors"
                              title="Resume monitor"
                              aria-label="Resume monitor"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseMutation.mutate(m.id)}
                              disabled={pauseMutation.isPending}
                              className="p-1.5 border border-[rgba(224,240,232,0.15)] text-[rgba(224,240,232,0.5)] hover:text-[#ffa000] hover:border-[#ffa000] hover:bg-[rgba(255,160,0,0.1)] transition-colors"
                              title="Pause monitor"
                              aria-label="Pause monitor"
                            >
                              <PauseCircle className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => setEditingMonitor(m)}
                            className="p-1.5 border border-[rgba(224,240,232,0.15)] text-[rgba(224,240,232,0.5)] hover:text-[#00ff88] hover:border-[#00ff88] hover:bg-[rgba(0,255,136,0.1)] transition-colors"
                            title="Edit monitor config"
                            aria-label="Edit monitor"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingMonitor(m)}
                            className="p-1.5 border border-[rgba(224,240,232,0.15)] text-[rgba(224,240,232,0.5)] hover:text-[#ff3030] hover:border-[#ff3030] hover:bg-[rgba(255,48,48,0.1)] transition-colors"
                            title="Delete monitor"
                            aria-label="Delete monitor"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
          title="// CONFIRM ENDPOINT TERMINATION"
          description={`Are you sure you want to permanently delete "${deletingMonitor.name}"? All historical check logs and incident history will be erased immediately.`}
          confirmLabel="TERMINATE ENDPOINT"
          variant="danger"
          onClose={() => setDeletingMonitor(null)}
          onConfirm={() => deleteMutation.mutate(deletingMonitor.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
