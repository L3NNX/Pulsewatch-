'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Lock,
  Layers,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AbstractUIMockup } from '@/components/ui/AbstractUIMockup';
import { BrutalistTestimonials } from '@/components/ui/BrutalistTestimonials';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function LandingPage() {
  const [heroEmail, setHeroEmail] = useState('');
  const [ctaEmail, setCtaEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail) setHeroSubmitted(true);
  };

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ctaEmail) setCtaSubmitted(true);
  };

  const tickerItems = [
    { service: 'PRODUCTION API', status: '99.99%', latency: '32ms', ok: true },
    { service: 'PAYMENT GATEWAY', status: '100.0%', latency: '45ms', ok: true },
    { service: 'AUTH CLUSTER', status: '99.98%', latency: '18ms', ok: true },
    { service: 'WEBHOOK DISPATCH', status: 'AUTO-RESOLVED', latency: '24ms', ok: true },
    { service: 'CDN ANYCAST', status: '99.99%', latency: '8ms', ok: true },
  ];

  return (
    <div className="min-h-screen bg-white text-[#171e19] font-satoshi selection:bg-[#ffe17c] selection:text-[#171e19] overflow-x-hidden">
      {/* 1. FIXED NAVIGATION */}
      <Navbar />

      <main className="pt-20">
        {/* 2. HERO SECTION */}
        <section className="relative px-6 lg:px-8 pt-20 pb-24 bg-grid-pattern overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge with yellow dot indicator */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#171e19]/10 bg-white/80 backdrop-blur-xs shadow-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffe17c] animate-pulse" />
              <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#171e19]">
                PULSEWATCH 2.0 &bull; LIVE TELEMETRY ENGINE
              </span>
            </div>

            {/* Headline: 'Anton' (text-6xl to 9xl) with a yellow highlight bar behind final word */}
            <h1 className="font-anton text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-normal text-[#171e19] leading-[0.9]">
              KNOW BEFORE YOUR <span className="yellow-highlight">USERS DO.</span>
            </h1>

            {/* Subheadline: 'Satoshi' (text-lg, text-charcoal/70%, max-w-xl) */}
            <p className="font-satoshi text-lg sm:text-xl text-[#171e19]/70 max-w-xl mx-auto leading-relaxed">
              Stop relying on angry customer tweets. PulseWatch executes high-precision queue probes, halts alert flapping, and writes automated AI incident postmortems in 2 seconds.
            </p>

            {/* Waitlist form: side-by-side input and massive 'Anton' button */}
            <div className="max-w-lg mx-auto pt-2">
              {heroSubmitted ? (
                <div className="p-4 rounded-xl bg-[#ffe17c] text-[#171e19] font-satoshi font-bold text-center border-2 border-[#171e19]">
                  🎉 Welcome to the frontline. Redirecting to instant registration...
                  <Link href="/register" className="block text-sm underline mt-1">
                    Click here to initialize your account →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="email"
                    placeholder="Enter your work email..."
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-4 rounded-lg border border-[#171e19]/20 bg-white text-base font-satoshi text-[#171e19] placeholder:text-[#171e19]/40 focus:outline-none focus:border-[#171e19] shadow-xs"
                  />
                  <button
                    type="submit"
                    className="font-anton text-xl uppercase tracking-wider px-8 py-4 bg-[#ffe17c] text-[#171e19] rounded-lg border-2 border-[#171e19] hover:bg-[#ffd850] hover:scale-105 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                  >
                    DEPLOY FREE →
                  </button>
                </form>
              )}
              <div className="mt-3 flex items-center justify-center gap-6 text-xs text-[#171e19]/60 font-medium">
                <span>✓ 10 Monitored Endpoints</span>
                <span>✓ 60-Second Checks</span>
                <span>✓ No Credit Card Needed</span>
              </div>
            </div>

            {/* Abstract UI Mockup */}
            <div className="pt-12">
              <AbstractUIMockup />
            </div>
          </div>
        </section>

        {/* 3. MARQUEE TELEMETRY TICKER */}
        <section className="border-y border-[#171e19]/10 bg-[#171e19] text-white py-3.5 overflow-hidden">
          <Marquee className="py-0 font-satoshi text-xs font-semibold" pauseOnHover={true} repeat={3}>
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-8 border-r border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#ffe17c]" />
                <span className="font-anton text-sm tracking-wide text-white uppercase">{item.service}</span>
                <span className="text-[#ffe17c] font-mono">{item.status}</span>
                <span className="text-[#b7c6c2] font-mono">({item.latency})</span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* 4. PROBLEM-SOLUTION CONTRAST SECTION */}
        <section id="problem-solution" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Half (Problem): bg-#charcoal, text-white, 'THE OLD WAY' in Anton with muted sage text and red X icons */}
            <div className="bg-[#171e19] text-white p-12 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="space-y-8 max-w-xl">
                <div className="inline-block px-3.5 py-1 rounded-full bg-red-500/20 text-red-400 font-anton text-xs uppercase tracking-widest">
                  THE BROKEN REALITY
                </div>

                <h2 className="font-anton text-5xl sm:text-6xl lg:text-7xl text-white uppercase leading-[0.9]">
                  THE OLD WAY<span className="text-red-500">.</span>
                </h2>

                <p className="font-satoshi text-base sm:text-lg text-[#b7c6c2] leading-relaxed">
                  Legacy monitoring tools page you at 3:12 AM for a single dropped packet, clutter your channels with unreadable stack traces, and charge thousands of dollars for basic status pages.
                </p>

                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-white">
                        FALSE-POSITIVE ALERT STORMS
                      </h4>
                      <p className="font-satoshi text-sm text-[#b7c6c2] mt-0.5">
                        Flapping network routes wake up engineers for temporary blips instead of confirmed outages.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-white">
                        CRYPTIC JARGON STACK TRACES
                      </h4>
                      <p className="font-satoshi text-sm text-[#b7c6c2] mt-0.5">
                        Support teams scramble trying to decode raw curl timeouts while customers complain publicly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-white">
                        $400/MONTH STATUSPAGE EXTORTION
                      </h4>
                      <p className="font-satoshi text-sm text-[#b7c6c2] mt-0.5">
                        Simple public communication pages locked behind extortionate enterprise pricing tiers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Half (Solution): bg-#272727 with yellow accent border, 'THE FLUX WAY' in Anton with yellow check-circle icons and crisp white text */}
            <div className="bg-[#272727] text-white p-12 lg:p-20 flex flex-col justify-between border-t-4 lg:border-t-0 border-[#ffe17c]">
              <div className="space-y-8 max-w-xl">
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#ffe17c]/20 text-[#ffe17c] font-anton text-xs uppercase tracking-widest border border-[#ffe17c]/30">
                  THE NEW STANDARD
                </div>

                <h2 className="font-anton text-5xl sm:text-6xl lg:text-7xl text-white uppercase leading-[0.9]">
                  THE PULSEWATCH WAY<span className="text-[#ffe17c]">.</span>
                </h2>

                <p className="font-satoshi text-base sm:text-lg text-white/80 leading-relaxed">
                  Engineered with mathematical anti-flapping consensus, instant AI incident postmortems, and clean public status pages designed for indie founders and engineering teams.
                </p>

                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#ffe17c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-[#ffe17c]">
                        3-STRIKE STRICT CONSENSUS
                      </h4>
                      <p className="font-satoshi text-sm text-white/80 mt-0.5">
                        Exactly 3 consecutive failures trigger a verified DOWN incident; 2 passes trigger auto-recovery. Zero flapping.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#ffe17c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-[#ffe17c]">
                        PLAIN-ENGLISH AI POSTMORTEMS
                      </h4>
                      <p className="font-satoshi text-sm text-white/80 mt-0.5">
                        AI reads headers, DNS latency, and response codes to write ready-to-share summaries in under 3 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#ffe17c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-anton text-lg tracking-wide uppercase text-[#ffe17c]">
                        FREE UNBRANDED STATUS BROADSHEET
                      </h4>
                      <p className="font-satoshi text-sm text-white/80 mt-0.5">
                        High-traffic public status wireframes with 30-second ISR caching that never leak internal secrets or URLs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BENTO FEATURE GRID */}
        <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#171e19]/10 bg-[#f8f9fa] font-anton text-xs uppercase tracking-widest text-[#171e19]">
              ARCHITECTURAL CAPABILITIES
            </div>
            <h2 className="font-anton text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9] text-[#171e19]">
              EVERY TOOL NEEDED FOR <span className="yellow-highlight">100% UPTIME.</span>
            </h2>
            <p className="font-satoshi text-lg text-[#171e19]/70">
              Built on production-grade Redis schedulers, BullMQ concurrency, and zero-trust security.
            </p>
          </div>

          {/* 3-column Grid with auto-rows (Feature 1 & 4 span 2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 (Spans 2 columns) */}
            <div className="lg:col-span-2 rounded-2xl p-8 lg:p-10 bg-[#f8f9fa] border border-[#171e19]/10 brutalist-card flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-xs uppercase">
                  KERNEL PROBES
                </span>
                <h3 className="font-anton text-3xl sm:text-4xl uppercase text-[#171e19]">
                  SUB-SECOND MULTI-REGION HTTP PROBES
                </h3>
                <p className="font-satoshi text-base text-[#171e19]/70 max-w-lg leading-relaxed">
                  Scheduled outward health checks executing GET and HEAD requests with customizable timeouts (1s to 30s) and status code boundaries.
                </p>
              </div>

              {/* Abstract pulse blocks */}
              <div className="mt-6 pt-6 border-t border-[#171e19]/10 grid grid-cols-3 gap-4 font-satoshi text-xs">
                <div className="p-4 rounded-xl bg-white border border-[#171e19]/10">
                  <div className="text-[#171e19]/60 font-medium">US-East Node</div>
                  <div className="font-anton text-2xl text-[#171e19] mt-1">12ms</div>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Nominal
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#171e19]/10">
                  <div className="text-[#171e19]/60 font-medium">EU-West Node</div>
                  <div className="font-anton text-2xl text-[#171e19] mt-1">18ms</div>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Nominal
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#171e19]/10">
                  <div className="text-[#171e19]/60 font-medium">AP-South Node</div>
                  <div className="font-anton text-2xl text-[#171e19] mt-1">45ms</div>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Nominal
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 (1 col - Dark Contrast) */}
            <div className="rounded-2xl p-8 lg:p-10 bg-[#171e19] text-white border border-white/10 brutalist-card flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#ffe17c] text-[#171e19] font-anton text-xs uppercase">
                  DEFENSE KERNEL
                </span>
                <h3 className="font-anton text-3xl uppercase text-white">
                  SSRF ZERO-TRUST SHIELD
                </h3>
                <p className="font-satoshi text-sm text-[#b7c6c2] leading-relaxed">
                  Resolves target DNS to reject private IP ranges (RFC 1918), localhost, and AWS/GCP cloud metadata.
                </p>
              </div>

              {/* Code snippet in bg-dark */}
              <div className="mt-6 p-4 rounded-xl bg-[#272727] border border-white/10 font-mono text-xs text-[#ffe17c] space-y-1.5">
                <div className="text-white/40">// SSRF Validator Gate</div>
                <div>IF ip IN ['127.0.0.1', '169.254.169.254']</div>
                <div className="text-red-400">&gt;&gt; REJECT_PROBE: PROTOCOL_VIOLATION</div>
              </div>
            </div>

            {/* Feature 3 (1 col) */}
            <div className="rounded-2xl p-8 lg:p-10 bg-[#f8f9fa] border border-[#171e19]/10 brutalist-card flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-xs uppercase">
                  DISPATCH KERNEL
                </span>
                <h3 className="font-anton text-3xl uppercase text-[#171e19]">
                  OMNI-CHANNEL ALERTS
                </h3>
                <p className="font-satoshi text-sm text-[#171e19]/70 leading-relaxed">
                  Deduplicated alerts broadcast across Discord, Slack, email, and generic webhooks with 5 exponential retries.
                </p>
              </div>

              {/* Avatar / Channel Stacks */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-[#171e19]/10 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-[#5865F2] text-white flex items-center justify-center font-anton text-xs border-2 border-white">
                    DC
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#4A154B] text-white flex items-center justify-center font-anton text-xs border-2 border-white">
                    SL
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#171e19] text-[#ffe17c] flex items-center justify-center font-anton text-xs border-2 border-white">
                    WH
                  </div>
                </div>
                <span className="font-anton text-xs text-[#171e19] uppercase">
                  DETERMINISTIC IDEMPOTENCY
                </span>
              </div>
            </div>

            {/* Feature 4 (Spans 2 columns) */}
            <div className="lg:col-span-2 rounded-2xl p-8 lg:p-10 bg-[#f8f9fa] border border-[#171e19]/10 brutalist-card flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-xs uppercase">
                  AI SYNTHESIS
                </span>
                <h3 className="font-anton text-3xl sm:text-4xl uppercase text-[#171e19]">
                  EXECUTIVE POSTMORTEMS IN SECONDS
                </h3>
                <p className="font-satoshi text-base text-[#171e19]/70 max-w-lg leading-relaxed">
                  Autonomous Google Gemini / Groq summaries analyze raw probe telemetry into crisp root-cause briefs ready for immediate client updates.
                </p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-white border border-[#171e19]/10 space-y-2">
                <div className="flex items-center justify-between font-satoshi text-xs font-bold text-[#171e19]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#ffe17c] fill-[#ffe17c]" />
                    AI Incident Synthesis #8402
                  </span>
                  <span className="text-[#171e19]/50 font-mono">TTD: 2.1s</span>
                </div>
                <p className="font-satoshi text-sm text-[#171e19]/80 leading-snug">
                  "Production Gateway returned HTTP 504 due to upstream database connection pool exhaustion. 3 consecutive failed probes triggered Discord alert. Auto-resolved upon service restart."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. HOW IT WORKS (1:2 RATIO LAYOUT) */}
        <section id="how-it-works" className="py-24 bg-[#171e19] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Sticky 'Anton' title (text-7xl to 8xl) */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#ffe17c]/20 text-[#ffe17c] font-anton text-xs uppercase tracking-widest border border-[#ffe17c]/30">
                  EXECUTION PIPELINE
                </div>
                <h2 className="font-anton text-6xl sm:text-7xl lg:text-8xl uppercase leading-[0.9] text-white">
                  HOW IT <span className="text-[#ffe17c]">WORKS.</span>
                </h2>
                <p className="font-satoshi text-base text-[#b7c6c2] leading-relaxed">
                  Engineered from the ground up for zero flapping, row-level locking consistency, and automated recovery.
                </p>
              </div>

              {/* Right Column: Vertical stack of three steps */}
              <div className="lg:col-span-8 space-y-6">
                {/* Step 1 */}
                <div className="group p-8 lg:p-10 rounded-2xl bg-[#272727] border border-white/10 brutalist-card hover:border-[#ffe17c]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <span className="font-anton text-7xl sm:text-8xl leading-none text-[#ffe17c]/20 group-hover:text-[#ffe17c] transition-colors duration-300">
                      01
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white font-satoshi text-xs font-bold uppercase">
                      60-SECOND PROBES
                    </span>
                  </div>
                  <h3 className="font-anton text-3xl uppercase text-white mt-4 mb-2">
                    REDIS BULLMQ SCHEDULER DISPATCH
                  </h3>
                  <p className="font-satoshi text-base text-[#b7c6c2] leading-relaxed">
                    Worker processes wake up every 60 seconds, validate target URLs through our SSRF barrier, and capture TLS handshake, latency, and status response codes.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="group p-8 lg:p-10 rounded-2xl bg-[#272727] border border-white/10 brutalist-card hover:border-[#ffe17c]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <span className="font-anton text-7xl sm:text-8xl leading-none text-[#ffe17c]/20 group-hover:text-[#ffe17c] transition-colors duration-300">
                      02
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white font-satoshi text-xs font-bold uppercase">
                      3-STRIKE CONSENSUS
                    </span>
                  </div>
                  <h3 className="font-anton text-3xl uppercase text-white mt-4 mb-2">
                    ROW-LEVEL STATE MACHINE LATCH
                  </h3>
                  <p className="font-satoshi text-base text-[#b7c6c2] leading-relaxed">
                    Database locks evaluate check records. A single drop does nothing. Exactly 3 consecutive failures open an incident state, eliminating false alarms forever.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="group p-8 lg:p-10 rounded-2xl bg-[#272727] border border-white/10 brutalist-card hover:border-[#ffe17c]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <span className="font-anton text-7xl sm:text-8xl leading-none text-[#ffe17c]/20 group-hover:text-[#ffe17c] transition-colors duration-300">
                      03
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white font-satoshi text-xs font-bold uppercase">
                      INSTANT DISPATCH & AI
                    </span>
                  </div>
                  <h3 className="font-anton text-3xl uppercase text-white mt-4 mb-2">
                    IDEMPOTENT ALERTS & POSTMORTEMS
                  </h3>
                  <p className="font-satoshi text-base text-[#b7c6c2] leading-relaxed">
                    Alerts trigger across Discord, Slack, and webhooks with deterministic job keys. Two subsequent successful checks auto-resolve the issue and synthesize an AI postmortem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. HIGH-CONTRAST TESTIMONIALS */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 px-6">
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#171e19]/10 bg-[#f8f9fa] font-anton text-xs uppercase tracking-widest text-[#171e19]">
              CUSTOMER EXPERIENCES
            </div>
            <h2 className="font-anton text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9] text-[#171e19]">
              TRUSTED BY DEVELOPERS <span className="yellow-highlight">WORLDWIDE.</span>
            </h2>
            <p className="font-satoshi text-lg text-[#171e19]/70">
              Here is what founders and reliability engineers say after migrating to PulseWatch.
            </p>
          </div>

          <BrutalistTestimonials />
        </section>

        {/* 8. FINAL HIGH-IMPACT CTA SECTION (BG-#FFE17C) */}
        <section className="relative py-28 bg-[#ffe17c] text-[#171e19] overflow-hidden">
          {/* Background decorative elements: massive 'Anton' text overlays with 10% opacity */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 overflow-hidden">
            <span className="font-anton text-[18vw] leading-none text-[#171e19] whitespace-nowrap">
              UPTIME NEVER SLEEPS
            </span>
          </div>

          <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-8 z-10">
            <h2 className="font-anton text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.9] text-[#171e19]">
              START MONITORING IN UNDER 60 SECONDS.
            </h2>

            <p className="font-satoshi text-xl sm:text-2xl text-[#171e19]/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of indie founders and engineering teams who sleep through the night knowing PulseWatch is guarding their stack.
            </p>

            {/* Centralized Form with input and button */}
            <div className="max-w-md mx-auto pt-4">
              {ctaSubmitted ? (
                <div className="p-5 rounded-2xl bg-[#171e19] text-[#ffe17c] font-satoshi font-bold text-center shadow-xl">
                  ✓ Dispatch queued! Redirecting you now...
                  <Link href="/register" className="block text-sm text-white underline mt-1">
                    Continue to Dashboard →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleCtaSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-4 rounded-full bg-white text-[#171e19] font-satoshi placeholder:text-[#171e19]/40 border-2 border-[#171e19] focus:outline-none shadow-md"
                  />
                  <button
                    type="submit"
                    className="font-anton text-lg uppercase tracking-wider px-8 py-4 bg-[#171e19] text-white rounded-full hover:bg-[#272727] hover:scale-105 active:scale-95 transition-transform duration-200 shadow-xl cursor-pointer"
                  >
                    DEPLOY NOW →
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 9. BRUTALIST FOOTER */}
      <footer className="bg-[#171e19] text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="space-y-4">
              <span className="font-anton text-3xl uppercase tracking-normal text-white">
                PULSEWATCH<span className="text-[#ffe17c]">.</span>
              </span>
              <p className="font-satoshi text-sm text-[#b7c6c2] leading-relaxed">
                The high-precision uptime platform with mathematical flap-proofing, automated AI postmortems, and public status pages.
              </p>
            </div>

            <div>
              <h4 className="font-anton text-base uppercase text-[#ffe17c] mb-3">PLATFORM</h4>
              <ul className="space-y-2 text-sm text-[#b7c6c2] font-satoshi">
                <li><Link href="/dashboard" className="hover:text-white">Console Dashboard</Link></li>
                <li><Link href="/status/demo" className="hover:text-white">Public Status Broadsheet</Link></li>
                <li><Link href="/login" className="hover:text-white">Operator Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white">Free Registration</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-anton text-base uppercase text-[#ffe17c] mb-3">INFRASTRUCTURE</h4>
              <ul className="space-y-2 text-sm text-[#b7c6c2] font-satoshi">
                <li>Queue: Redis + BullMQ v5</li>
                <li>SSRF Guard: RFC 1918 Enforced</li>
                <li>Database: PostgreSQL / Prisma</li>
                <li>Encryption: AES-256-GCM</li>
              </ul>
            </div>

            <div>
              <h4 className="font-anton text-base uppercase text-[#ffe17c] mb-3">SELF-HOST</h4>
              <p className="font-satoshi text-xs text-[#b7c6c2] mb-3">
                Run the complete monorepo locally with Docker Compose in 60 seconds.
              </p>
              <div className="p-3 rounded-lg bg-[#272727] font-mono text-xs text-[#ffe17c]">
                docker compose up -d
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#b7c6c2] font-satoshi gap-4">
            <div>&copy; 2026 PulseWatch Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Security Overview</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
