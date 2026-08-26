import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicStatusPage({ params }: PageProps) {
  const { slug } = await params;

  const demoMonitors = [
    { name: 'Production API Gateway (US-East)', uptime: '99.99%', status: 'UP' as const, latency: '38ms' },
    { name: 'Authentication Service & Session Store', uptime: '100.0%', status: 'UP' as const, latency: '45ms' },
    { name: 'Customer Facing Web Application', uptime: '99.95%', status: 'UP' as const, latency: '62ms' },
    { name: 'Background Queue & Dispatch Workers', uptime: '100.0%', status: 'UP' as const, latency: '12ms' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#171e19] flex flex-col justify-between font-satoshi selection:bg-[#ffe17c] selection:text-[#171e19]">
      {/* Top Bar */}
      <header className="border-b border-[#171e19]/10 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <span className="font-anton text-2xl uppercase text-[#171e19]">
              {slug}<span className="text-[#ffe17c]">.</span>STATUS
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-satoshi font-bold text-[#171e19]/60 hover:text-[#171e19] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            POWERED BY PULSEWATCH
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12 space-y-10">
        {/* Overall Status Banner */}
        <div className="rounded-2xl border border-[#171e19]/10 bg-[#f8f9fa] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#27c93f]/10 border border-[#27c93f]/20 flex items-center justify-center text-[#27c93f] shrink-0">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" />
            </div>
            <div>
              <h1 className="font-anton text-3xl uppercase tracking-normal text-[#171e19]">
                ALL SYSTEMS OPERATIONAL
              </h1>
              <p className="font-satoshi text-sm text-[#171e19]/70 mt-1">
                Probes synchronized across distributed checkpoints. Zero active incidents reported.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-xs uppercase tracking-wider self-start sm:self-center">
            <span className="h-2 w-2 rounded-full bg-[#27c93f] animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Monitored Services */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#171e19]/10">
            <h2 className="font-anton text-2xl uppercase text-[#171e19]">
              SERVICE AVAILABILITY &bull; PAST 90 DAYS
            </h2>
            <span className="font-satoshi text-xs font-bold text-[#171e19]/50 uppercase">
              4 MONITORS
            </span>
          </div>

          <div className="rounded-2xl border border-[#171e19]/10 bg-white divide-y divide-[#171e19]/5 shadow-sm overflow-hidden">
            {demoMonitors.map((svc) => (
              <div key={svc.name} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors">
                <div>
                  <span className="font-anton text-lg uppercase text-[#171e19] block">
                    {svc.name}
                  </span>
                  <p className="text-xs text-[#171e19]/60 font-medium mt-1">
                    Current Latency: <span className="font-bold text-[#171e19]">{svc.latency}</span>
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Visual 90-day mock bar */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-6 w-1.5 rounded-full bg-[#27c93f] hover:scale-y-125 transition-transform"
                        title="100% operational"
                      />
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="font-anton text-xl text-[#171e19]">
                      {svc.uptime}
                    </span>
                    <p className="font-satoshi text-[10px] text-[#171e19]/50 uppercase font-bold">90D Consensus</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#171e19]/10">
            <h2 className="font-anton text-2xl uppercase text-[#171e19]">
              INCIDENT HISTORY
            </h2>
          </div>

          <div className="rounded-2xl border border-[#171e19]/10 bg-[#f8f9fa] p-8 text-center text-sm font-satoshi text-[#171e19]/60 font-medium">
            No outages or service degradation recorded over the last 90 days.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#171e19]/10 py-8 bg-[#f8f9fa] text-center font-satoshi text-xs text-[#171e19]/60">
        <p>&copy; 2026 PulseWatch Inc. All systems monitored continuously.</p>
      </footer>
    </div>
  );
}
