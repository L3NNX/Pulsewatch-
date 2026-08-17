'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  MousePointer2,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export function AbstractUIMockup() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-[#171e19]/10 bg-white shadow-2xl overflow-hidden select-none">
      {/* Header: gray traffic light buttons (red, yellow, green) and centered mockup title */}
      <div className="h-11 bg-[#f8f9fa] border-b border-[#171e19]/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-xs font-satoshi font-medium text-[#171e19]/60 flex items-center gap-2">
          <span>pulsewatch.app/monitors/production-api</span>
          <span className="px-2 py-0.5 rounded-full bg-[#ffe17c] text-[#171e19] font-bold text-[10px]">
            LIVE 99.99%
          </span>
        </div>
        <div className="w-12" /> {/* Balance spacer */}
      </div>

      {/* Body: 3-column Grid (Sidebar, Main Canvas, Properties Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
        {/* 1. Sidebar (3 cols) */}
        <div className="md:col-span-3 border-r border-[#171e19]/10 p-4 bg-[#f8f9fa] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-anton tracking-wider text-[#171e19]/40 uppercase">
              MONITORED CLUSTERS
            </div>
            <div className="space-y-1.5 font-satoshi text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#171e19]/10 shadow-xs flex items-center justify-between">
                <span className="font-bold text-[#171e19]">Production API</span>
                <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
              </div>
              <div className="p-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center justify-between text-[#171e19]/70">
                <span>Auth Cluster</span>
                <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
              </div>
              <div className="p-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center justify-between text-[#171e19]/70">
                <span>Stripe Webhooks</span>
                <span className="h-2 w-2 rounded-full bg-[#ffe17c]" />
              </div>
              <div className="p-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center justify-between text-[#171e19]/70">
                <span>Database Replica</span>
                <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#171e19]/10 font-satoshi text-[11px] text-[#171e19]/60 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-[#171e19]" />
            <span>SSRF Guard: Active</span>
          </div>
        </div>

        {/* 2. Main Canvas (6 cols) */}
        <div className="md:col-span-6 p-6 lg:p-8 bg-white flex flex-col items-center justify-center relative overflow-hidden bg-grid-pattern">
          {/* Centered White Card with subtle shadows */}
          <div className="w-full max-w-md bg-white rounded-xl border border-[#171e19]/10 p-6 shadow-xl space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#ffe17c] flex items-center justify-center font-anton text-sm text-[#171e19]">
                  API
                </div>
                <div>
                  <h4 className="font-anton text-lg tracking-normal text-[#171e19] uppercase leading-tight">
                    GLOBAL API HEALTH
                  </h4>
                  <p className="font-satoshi text-xs text-[#171e19]/60">Target: https://api.brand.com/v1</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171e19] text-[#ffe17c] text-xs font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
                UP
              </span>
            </div>

            {/* Sparkline & Latency metrics */}
            <div className="space-y-2 pt-2 border-t border-[#171e19]/10">
              <div className="flex items-baseline justify-between">
                <span className="font-satoshi text-xs font-medium text-[#171e19]/60">Latency p95</span>
                <span className="font-anton text-2xl text-[#171e19]">32ms</span>
              </div>
              {/* Micro-bars graph */}
              <div className="flex items-end gap-1 h-10 w-full pt-2">
                {[40, 60, 30, 80, 50, 45, 90, 70, 35, 40, 65, 85, 30, 95, 40, 55, 75, 40, 35, 90].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-[#171e19] hover:bg-[#ffe17c] rounded-t-xs transition-colors"
                      style={{ height: `${val}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* AI Summary snippet */}
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#171e19]/10 flex items-start gap-2.5 text-xs font-satoshi text-[#171e19]">
              <Sparkles className="h-4 w-4 text-[#ffe17c] shrink-0 fill-[#ffe17c] mt-0.5" />
              <p className="leading-snug">
                <span className="font-bold">AI Postmortem:</span> Zero flapping incidents over last 3,420 checks.
              </p>
            </div>
          </div>

          {/* Floating cursor icon with user name label */}
          <div className="absolute bottom-12 right-12 z-20 flex items-center gap-1.5 pointer-events-none animate-pulse">
            <MousePointer2 className="h-4 w-4 text-[#171e19] fill-[#ffe17c]" />
            <div className="px-2.5 py-1 rounded-full bg-[#171e19] text-white font-satoshi text-[11px] font-bold shadow-md">
              Gaurav (Lead SRE)
            </div>
          </div>
        </div>

        {/* 3. Properties Panel (3 cols) */}
        <div className="md:col-span-3 border-l border-[#171e19]/10 p-5 bg-[#f8f9fa] space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#171e19]/10">
            <Sliders className="h-4 w-4 text-[#171e19]" />
            <span className="font-anton text-xs text-[#171e19] uppercase tracking-wider">
              PROPERTIES INSPECTOR
            </span>
          </div>

          {/* Font-display titles */}
          <div className="space-y-1.5">
            <label className="font-satoshi text-xs font-bold text-[#171e19]/70 block">
              Display Typography
            </label>
            <div className="p-2 rounded-md bg-white border border-[#171e19]/10 font-anton text-sm text-[#171e19]">
              ANTON DISPLAY CONDENSED
            </div>
          </div>

          {/* Mini alignment icons */}
          <div className="space-y-1.5">
            <label className="font-satoshi text-xs font-bold text-[#171e19]/70 block">
              Alignment Matrix
            </label>
            <div className="flex items-center gap-1 p-1 rounded-md bg-white border border-[#171e19]/10">
              <button className="flex-1 py-1.5 rounded flex items-center justify-center bg-[#ffe17c] text-[#171e19]">
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center hover:bg-neutral-100 text-[#171e19]/70">
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center hover:bg-neutral-100 text-[#171e19]/70">
                <AlignRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Hex color swatch (#FFE17C) */}
          <div className="space-y-1.5">
            <label className="font-satoshi text-xs font-bold text-[#171e19]/70 block">
              Primary Accent Hex
            </label>
            <div className="p-2.5 rounded-md bg-white border border-[#171e19]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded border border-[#171e19]/20 bg-[#ffe17c]" />
                <span className="font-mono text-xs font-bold text-[#171e19]">#FFE17C</span>
              </div>
              <span className="text-[10px] font-satoshi text-[#171e19]/50 uppercase font-bold">
                Golden
              </span>
            </div>
          </div>

          {/* Probe Interval Spec */}
          <div className="pt-4 border-t border-[#171e19]/10 space-y-1 font-satoshi text-xs text-[#171e19]/60">
            <div className="flex justify-between">
              <span>Probe Interval:</span>
              <span className="font-bold text-[#171e19]">60s</span>
            </div>
            <div className="flex justify-between">
              <span>Threshold Latch:</span>
              <span className="font-bold text-[#171e19]">3 Strikes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AbstractUIMockup;

