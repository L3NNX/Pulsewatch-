import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Radio } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicStatusPage({ params }: PageProps) {
  const { slug } = await params;

  const demoMonitors = [
    { name: 'API Gateway (US-East)', uptime: '99.99%', status: 'UP', latency: '38ms' },
    { name: 'Authentication Service', uptime: '100.0%', status: 'UP', latency: '45ms' },
    { name: 'Public Web Application', uptime: '99.95%', status: 'UP', latency: '62ms' },
    { name: 'Background Queue Cluster', uptime: '100.0%', status: 'UP', latency: '12ms' },
  ];

  return (
    <div className="min-h-screen bg-[#060b10] text-[#e0f0e8] flex flex-col justify-between font-mono relative overflow-hidden">
      {/* Scanlines & Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50 z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.22) 2px, rgba(0, 0, 0, 0.22) 4px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 136, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Bar */}
      <header className="border-b border-[rgba(0,255,136,0.16)] bg-[#060b10]/95 backdrop-blur-md relative z-10">
        <div className="mx-auto flex h-13 max-w-4xl items-center justify-between px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff88] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
            </span>
            <span className="font-['Barlow_Condensed',sans-serif] font-black text-lg tracking-[0.16em] text-[#00ff88] uppercase">
              {slug} // PUBLIC STATUS CONSOLE
            </span>
          </div>
          <Link
            href="/"
            className="text-[11px] text-[rgba(224,240,232,0.5)] hover:text-[#00ff88] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            POWERED BY PULSEWATCH
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 space-y-8 relative z-10">
        {/* Overall Status Banner */}
        <div className="border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.06)] p-5 flex items-center justify-between shadow-[0_0_20px_rgba(0,255,136,0.08)]">
          <div className="flex items-center gap-3.5">
            <div className="p-2 border border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.1)] text-[#00ff88]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-['Barlow_Condensed',sans-serif] font-black text-xl uppercase tracking-wider text-white">
                ALL SYSTEMS OPERATIONAL
              </h1>
              <p className="text-xs text-[rgba(224,240,232,0.55)] mt-0.5 tracking-wider">
                DISTRIBUTED PROBES SYNCHRONIZED • ZERO ACTIVE INCIDENTS
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-[#00ff88] font-bold tracking-widest uppercase">
            <span className="h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse" />
            LIVE NOC
          </span>
        </div>

        {/* Monitored Services */}
        <div className="space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[rgba(0,255,136,0.7)] font-semibold">
            // SERVICE AVAILABILITY (PAST 90 DAYS)
          </h2>

          <div className="border border-[rgba(0,255,136,0.18)] bg-[rgba(10,18,26,0.9)] divide-y divide-[rgba(0,255,136,0.08)] overflow-hidden text-xs">
            {demoMonitors.map((svc) => (
              <div key={svc.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[rgba(0,255,136,0.03)] transition-colors">
                <div>
                  <span className="font-['Barlow_Condensed',sans-serif] font-bold text-base text-white tracking-wide uppercase">
                    {svc.name}
                  </span>
                  <p className="text-[11px] text-[rgba(224,240,232,0.45)] mt-0.5 tabular-nums">
                    CURRENT LATENCY: <span className="text-[#00ff88] font-semibold">{svc.latency}</span>
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  {/* Visual 90-day mock bar */}
                  <div className="hidden sm:flex items-center gap-0.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-5 w-1 bg-[#00ff88] shadow-[0_0_2px_#00ff88] hover:scale-y-125 transition-transform"
                        title="100% operational"
                      />
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#00ff88] tabular-nums font-['Barlow_Condensed',sans-serif]">
                      {svc.uptime}
                    </span>
                    <p className="text-[10px] text-[rgba(224,240,232,0.4)]">90D</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents Section */}
        <div className="space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[rgba(0,255,136,0.7)] font-semibold">
            // INCIDENT AUDIT LOG
          </h2>

          <div className="border border-[rgba(0,255,136,0.16)] bg-[rgba(10,18,26,0.7)] p-6 text-center text-xs text-[rgba(224,240,232,0.5)]">
            NO OUTAGES OR SEVERITY-1 INCIDENTS RECORDED IN THE PAST 90 DAYS.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,255,136,0.16)] py-5 bg-[#060b10] text-center text-[11px] text-[rgba(224,240,232,0.4)] uppercase tracking-wider relative z-10">
        <p>PULSEWATCH NOC TELEMETRY PLATFORM</p>
      </footer>
    </div>
  );
}
