'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// NOC War Room Console — Mission-Critical Operations Center
// Typography: Barlow Condensed (Display) & Share Tech Mono (Terminal/Monospace)
// Palette: Phosphor Green (#00ff88), Deep Void (#060b10), Warning Amber (#ffa000), Critical Red (#ff3030)
// Textures: CRT Scanlines, Phosphor glow, Hardware bezels, 48px grid

export default function LandingPage() {
  const [utcTime, setUtcTime] = useState<string>('00:00:00 UTC');
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(
        now.toUTCString().split(' ')[4] + ' UTC'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const zones = [
    { name: 'Production API', status: 'ok', uptime: '99.98%', latency: '32ms', code: '200 OK', region: 'us-east-1', checks: 1440 },
    { name: 'Auth Service', status: 'ok', uptime: '100.0%', latency: '18ms', code: '200 OK', region: 'eu-west-1', checks: 1440 },
    { name: 'Payment Gateway', status: 'warn', uptime: '98.12%', latency: '1,240ms', code: '503 SLOW', region: 'us-central-1', checks: 1412 },
    { name: 'CDN Edge', status: 'ok', uptime: '99.99%', latency: '8ms', code: '200 OK', region: 'global-anycast', checks: 1440 },
    { name: 'Webhook Relay', status: 'crit', uptime: 'DOWN', latency: 'TIMEOUT', code: 'ECONNREFUSED', region: 'ap-southeast-1', checks: 1390 },
    { name: 'Database RO', status: 'ok', uptime: '99.94%', latency: '12ms', code: '200 OK', region: 'us-east-1', checks: 1438 },
    { name: 'Search Cluster', status: 'ok', uptime: '99.88%', latency: '45ms', code: '200 OK', region: 'eu-central-1', checks: 1436 },
  ];

  const pipeline = [
    {
      step: '01',
      title: 'BULLMQ DISPATCHER',
      desc: 'Distributed queue with Redis-backed schedulers executing probes at strict intervals (60s to 3600s).',
      badge: 'REDIS ENGINE',
    },
    {
      step: '02',
      title: 'SSRF-ISOLATED PROBE',
      desc: 'Each probe resolves DNS, validates against RFC 1918 / loopback / cloud metadata IP ranges, then executes with redirect guards.',
      badge: 'ZERO TRUST',
    },
    {
      step: '03',
      title: 'CONSENSUS MATRIX',
      desc: 'Row-level database locks prevent race conditions. 3 consecutive failures to trigger DOWN; 2 consecutive successes to resolve.',
      badge: 'FLAP-PROOF',
    },
    {
      step: '04',
      title: 'OMNI-CHANNEL ALERT',
      desc: 'Deterministic job IDs prevent duplicate alerts. Dispatches across Discord, Slack, custom Webhooks, and SMTP with 5 exponential retries.',
      badge: 'IDEMPOTENT',
    },
  ];

  const capabilities = [
    {
      tag: 'KERNEL / PROBES',
      title: 'Sub-Second Precision Probes',
      desc: 'Lightweight HTTP/HTTPS executors recording TLS handshake timing, DNS latency, HTTP status codes, and payload fingerprints.',
      specs: ['Interval: 60s - 3600s', 'Timeout: 1s - 30s', 'Method: GET / HEAD', 'Payload Limit: 1MB'],
    },
    {
      tag: 'SAFETY / SSRF',
      title: 'Kernel-Level SSRF Hardening',
      desc: 'Rejects requests to 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, and AWS/GCP metadata addresses 169.254.169.254.',
      specs: ['DNS Rebinding Defense', 'IPv4 & IPv6 Mapping Check', 'Scheme Allowlist (HTTP/S)', 'Strict Private CIDR Filter'],
    },
    {
      tag: 'AI / TELEMETRY',
      title: 'Autonomous Incident Postmortems',
      desc: 'On incident resolution, an AI analyzer ingests failed response codes, trace latencies, and creates plain-English root cause summaries.',
      specs: ['Provider: Gemini / Groq', 'Deterministic Fallback Engine', 'Sanitized Error Sanitizer', '10/day Cap per Tenant'],
    },
    {
      tag: 'CHANNELS / CRYPTO',
      title: 'AES-256-GCM Encrypted Webhooks',
      desc: 'Webhook tokens, Discord endpoints, and SMTP credentials encrypted at rest with hardware-accelerated AES-256-GCM.',
      specs: ['Hardware AES-256-GCM', '96-bit Random IV per record', 'Auth Tag Verification', 'Zero Plaintext in Logs'],
    },
    {
      tag: 'PUBLIC / EDGES',
      title: 'Zero-Auth Public Status Pages',
      desc: 'Ultra-fast public status pages at /status/:slug. 90-day uptime bars, incident timelines, zero sensitive configuration leakage.',
      specs: ['30s ISR Edge Cache', 'Zero Auth Required', 'Real-time System Banner', 'Multi-Monitor Aggregation'],
    },
    {
      tag: 'RELIABILITY / STATE',
      title: 'Row-Lock Anti-Flap Machine',
      desc: 'Guarantees incident consistency during rapid network blips using PostgreSQL SELECT FOR UPDATE row locking across concurrent workers.',
      specs: ['3 Failures = Incident OPEN', '2 Successes = Incident RESOLVED', 'Unique OPEN Lock', 'Batch Retention Cleaner'],
    },
  ];

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('docker compose up -d');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div className="noc-root">
      {/* Google Fonts: Barlow Condensed & Share Tech Mono */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,900;1,700&family=Share+Tech+Mono&display=swap');

        :root {
          --noc-bg: #060b10;
          --noc-bg-surface: #0a121a;
          --noc-bg-surface-2: #0f1c29;
          --noc-green: #00ff88;
          --noc-green-dim: rgba(0, 255, 136, 0.15);
          --noc-green-glow: rgba(0, 255, 136, 0.4);
          --noc-green-text: rgba(0, 255, 136, 0.7);
          --noc-amber: #ffa000;
          --noc-amber-dim: rgba(255, 160, 0, 0.15);
          --noc-red: #ff3030;
          --noc-red-dim: rgba(255, 48, 48, 0.15);
          --noc-border: rgba(0, 255, 136, 0.16);
          --noc-border-subtle: rgba(0, 255, 136, 0.08);
          --noc-text-bright: #e0f0e8;
          --noc-text-muted: rgba(224, 240, 232, 0.55);
          --noc-text-faint: rgba(224, 240, 232, 0.35);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .noc-root {
          background-color: var(--noc-bg);
          color: var(--noc-text-bright);
          font-family: 'Share Tech Mono', monospace;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          line-height: 1.5;
        }

        /* Scanlines Overlay */
        .noc-scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.22) 2px,
            rgba(0, 0, 0, 0.22) 4px
          );
          opacity: 0.85;
        }

        /* 48px NOC Grid */
        .noc-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image:
            linear-gradient(rgba(0, 255, 136, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.035) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* CRT Vignette */
        .noc-vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(4, 7, 11, 0.85) 100%);
        }

        /* Top Hardware Status Bar */
        .noc-status-bar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 48px;
          background: rgba(6, 11, 16, 0.94);
          border-bottom: 1px solid var(--noc-border);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .noc-brand-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .noc-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 19px;
          letter-spacing: 0.18em;
          color: var(--noc-green);
          text-shadow: 0 0 12px var(--noc-green-glow);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .noc-logo-radar {
          width: 14px;
          height: 14px;
          border: 1px solid var(--noc-green);
          border-radius: 50%;
          position: relative;
          display: inline-block;
        }

        .noc-logo-radar::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: var(--noc-green);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 6px var(--noc-green);
        }

        .noc-divider {
          color: rgba(0, 255, 136, 0.25);
          user-select: none;
        }

        .noc-status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--noc-green);
          font-weight: 600;
        }

        .noc-pulse-dot {
          width: 7px;
          height: 7px;
          background: var(--noc-green);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--noc-green);
          animation: noc-blink 2s infinite ease-in-out;
        }

        @keyframes noc-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }

        .noc-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .noc-btn-login {
          color: var(--noc-text-muted);
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.12em;
          padding: 6px 14px;
          transition: all 0.2s;
        }

        .noc-btn-login:hover {
          color: var(--noc-green);
        }

        .noc-btn-bezel-sm {
          background: var(--noc-green);
          color: #060b10;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 8px 18px;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .noc-btn-bezel-sm:hover {
          box-shadow: 0 0 16px var(--noc-green-glow);
          transform: translateY(-1px);
        }

        /* 3-Column Mission Control Hero */
        .noc-hero-section {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 310px 1fr 320px;
          min-height: calc(100vh - 48px);
          border-bottom: 1px solid var(--noc-border);
        }

        /* Left Column: Zone Panel */
        .noc-zone-panel {
          border-right: 1px solid var(--noc-border);
          background: rgba(10, 18, 26, 0.7);
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .noc-panel-header {
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--noc-green-text);
          text-transform: uppercase;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--noc-border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .noc-zone-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .noc-zone-item {
          padding: 12px 14px;
          border: 1px solid transparent;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(6, 11, 16, 0.4);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .noc-zone-item:hover, .noc-zone-item.selected {
          border-color: var(--noc-green);
          background: rgba(0, 255, 136, 0.05);
          box-shadow: inset 0 0 12px rgba(0, 255, 136, 0.04);
        }

        .noc-zone-item.warn {
          border-color: rgba(255, 160, 0, 0.25);
        }
        .noc-zone-item.crit {
          border-color: rgba(255, 48, 48, 0.35);
          background: rgba(255, 48, 48, 0.06);
        }

        .noc-zone-row-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .noc-zone-name-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 600;
          color: var(--noc-text-bright);
        }

        .noc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .noc-dot.ok {
          background: var(--noc-green);
          box-shadow: 0 0 8px var(--noc-green);
        }

        .noc-dot.warn {
          background: var(--noc-amber);
          box-shadow: 0 0 8px var(--noc-amber);
        }

        .noc-dot.crit {
          background: var(--noc-red);
          box-shadow: 0 0 8px var(--noc-red);
          animation: noc-crit-pulse 0.8s infinite;
        }

        @keyframes noc-crit-pulse {
          0%, 100% { opacity: 1; transform: scale(1.1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        .noc-zone-pct {
          font-size: 12px;
          font-weight: 700;
        }
        .noc-zone-pct.ok { color: var(--noc-green); }
        .noc-zone-pct.warn { color: var(--noc-amber); }
        .noc-zone-pct.crit { color: var(--noc-red); }

        .noc-zone-row-meta {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: var(--noc-text-faint);
          padding-left: 18px;
        }

        /* Center Column: Hero Center */
        .noc-hero-center {
          padding: 56px 52px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 28px;
          background: rgba(6, 11, 16, 0.6);
        }

        .noc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--noc-green-dim);
          border: 1px solid var(--noc-border);
          padding: 6px 16px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--noc-green);
        }

        .noc-hero-h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 82px;
          line-height: 0.92;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -0.03em;
        }

        .noc-hero-h1 em {
          font-style: normal;
          color: var(--noc-green);
          text-shadow: 0 0 24px var(--noc-green-glow);
        }

        .noc-hero-sub {
          font-size: 14px;
          color: var(--noc-text-muted);
          max-width: 580px;
          line-height: 1.7;
          letter-spacing: 0.03em;
        }

        .noc-cta-rack {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .noc-btn-primary {
          background: var(--noc-green);
          color: #060b10;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 16px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 16px 36px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          box-shadow: 0 0 24px rgba(0, 255, 136, 0.35);
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .noc-btn-primary:hover {
          box-shadow: 0 0 36px rgba(0, 255, 136, 0.6);
          transform: translateY(-2px);
        }

        .noc-btn-secondary {
          background: transparent;
          color: var(--noc-green);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 16px 30px;
          border: 1px solid var(--noc-border);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .noc-btn-secondary:hover {
          background: var(--noc-green-dim);
          border-color: var(--noc-green);
        }

        /* Industrial Metrics Bar */
        .noc-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          width: 100%;
          border: 1px solid var(--noc-border);
          background: rgba(10, 18, 26, 0.8);
          margin-top: 12px;
        }

        .noc-metric-cell {
          padding: 18px 20px;
          border-right: 1px solid var(--noc-border-subtle);
        }

        .noc-metric-cell:last-child {
          border-right: none;
        }

        .noc-metric-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 38px;
          line-height: 1;
          color: var(--noc-green);
          letter-spacing: -0.02em;
        }

        .noc-metric-lbl {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--noc-text-faint);
          margin-top: 6px;
        }

        /* Right Column: Sidebar */
        .noc-right-sidebar {
          border-left: 1px solid var(--noc-border);
          background: rgba(10, 18, 26, 0.7);
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .noc-incident-card {
          padding: 12px 14px;
          background: rgba(6, 11, 16, 0.6);
          border: 1px solid var(--noc-border-subtle);
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-radius: 2px;
        }

        .noc-badge {
          display: inline-block;
          padding: 2px 8px;
          font-size: 9px;
          letter-spacing: 0.16em;
          font-weight: 700;
          text-transform: uppercase;
          width: fit-content;
        }

        .noc-badge.open {
          background: var(--noc-red-dim);
          color: var(--noc-red);
          border: 1px solid rgba(255, 48, 48, 0.35);
        }

        .noc-badge.resolved {
          background: var(--noc-green-dim);
          color: var(--noc-green);
          border: 1px solid var(--noc-border);
        }

        .noc-incident-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--noc-text-bright);
        }

        .noc-incident-meta {
          font-size: 10px;
          color: var(--noc-text-muted);
        }

        .noc-ai-box {
          margin-top: 6px;
          padding: 14px;
          background: rgba(0, 255, 136, 0.03);
          border-left: 3px solid var(--noc-green);
          border-top: 1px solid var(--noc-border-subtle);
          border-right: 1px solid var(--noc-border-subtle);
          border-bottom: 1px solid var(--noc-border-subtle);
          font-size: 11px;
          line-height: 1.65;
          color: var(--noc-text-bright);
        }

        .noc-ai-cursor {
          display: inline-block;
          width: 6px;
          height: 12px;
          background: var(--noc-green);
          margin-left: 4px;
          animation: noc-blink 1s infinite;
          vertical-align: middle;
        }

        /* Section Wrappers */
        .noc-section {
          position: relative;
          z-index: 10;
          padding: 80px 48px;
          border-bottom: 1px solid var(--noc-border);
        }

        .noc-section-tag {
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--noc-green);
          text-transform: uppercase;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .noc-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 48px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .noc-section-sub {
          font-size: 14px;
          color: var(--noc-text-muted);
          max-width: 680px;
          line-height: 1.6;
          margin-bottom: 48px;
        }

        /* Pipeline Steps Grid */
        .noc-pipeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .noc-pipe-card {
          background: rgba(10, 18, 26, 0.7);
          border: 1px solid var(--noc-border);
          padding: 28px 24px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .noc-pipe-step {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 44px;
          font-weight: 900;
          color: rgba(0, 255, 136, 0.2);
          line-height: 1;
        }

        .noc-pipe-badge {
          position: absolute;
          top: 24px;
          right: 20px;
          font-size: 9px;
          letter-spacing: 0.16em;
          padding: 3px 8px;
          background: var(--noc-green-dim);
          color: var(--noc-green);
          border: 1px solid var(--noc-border);
        }

        .noc-pipe-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .noc-pipe-desc {
          font-size: 12px;
          color: var(--noc-text-muted);
          line-height: 1.6;
        }

        /* Capabilities Grid */
        .noc-caps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .noc-cap-card {
          background: rgba(10, 18, 26, 0.8);
          border: 1px solid var(--noc-border);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.2s;
        }

        .noc-cap-card:hover {
          border-color: var(--noc-green);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }

        .noc-cap-tag {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--noc-green);
        }

        .noc-cap-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
        }

        .noc-cap-desc {
          font-size: 12px;
          color: var(--noc-text-muted);
          line-height: 1.65;
        }

        .noc-cap-specs {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--noc-border-subtle);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .noc-cap-spec-item {
          font-size: 10px;
          color: var(--noc-green-text);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Terminal Deployment Strip */
        .noc-terminal-strip {
          background: rgba(4, 7, 11, 0.95);
          border: 1px solid var(--noc-border);
          padding: 32px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .noc-term-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .noc-term-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--noc-green);
          text-transform: uppercase;
        }

        .noc-term-cmd {
          font-family: 'Share Tech Mono', monospace;
          font-size: 16px;
          color: #ffffff;
          background: rgba(0, 255, 136, 0.06);
          border: 1px solid var(--noc-border);
          padding: 10px 18px;
          border-radius: 2px;
          user-select: all;
        }

        /* Footer */
        .noc-footer {
          position: relative;
          z-index: 10;
          padding: 36px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--noc-bg);
          font-size: 11px;
          color: var(--noc-text-faint);
          letter-spacing: 0.1em;
          flex-wrap: wrap;
          gap: 16px;
        }

        .noc-footer-links {
          display: flex;
          gap: 24px;
        }

        .noc-footer-links a {
          color: var(--noc-text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .noc-footer-links a:hover {
          color: var(--noc-green);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .noc-hero-section {
            grid-template-columns: 280px 1fr;
          }
          .noc-right-sidebar {
            display: none;
          }
          .noc-pipeline-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .noc-caps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 860px) {
          .noc-hero-section {
            grid-template-columns: 1fr;
          }
          .noc-zone-panel {
            border-right: none;
            border-bottom: 1px solid var(--noc-border);
          }
          .noc-hero-h1 {
            font-size: 56px;
          }
          .noc-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .noc-pipeline-grid {
            grid-template-columns: 1fr;
          }
          .noc-caps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Retro Hardware FX */}
      <div className="noc-scanlines" />
      <div className="noc-grid" />
      <div className="noc-vignette" />

      {/* Top Hardware Status Bar */}
      <header className="noc-status-bar">
        <div className="noc-brand-group">
          <Link href="/" className="noc-logo">
            <span className="noc-logo-radar" />
            PULSEWATCH
          </Link>
          <span className="noc-divider">|</span>
          <span style={{ color: 'var(--noc-text-faint)' }}>NOC CONSOLE v4.1.2</span>
          <span className="noc-divider">|</span>
          <div className="noc-status-indicator">
            <span className="noc-pulse-dot" />
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
          <span className="noc-divider">|</span>
          <span style={{ color: 'var(--noc-text-muted)' }}>{utcTime}</span>
        </div>

        <div className="noc-nav-actions">
          <Link href="/login" className="noc-btn-login">
            SIGN IN
          </Link>
          <Link href="/dashboard" className="noc-btn-login">
            CONSOLE
          </Link>
          <Link href="/register" className="noc-btn-bezel-sm">
            LAUNCH NOC →
          </Link>
        </div>
      </header>

      {/* 3-Column Mission Control Hero */}
      <main className="noc-hero-section">
        {/* Left Column: Service Zones */}
        <aside className="noc-zone-panel">
          <div className="noc-panel-header">
            <span>ACTIVE SERVICE ZONES</span>
            <span style={{ color: 'var(--noc-green)' }}>7/7 LIVE</span>
          </div>

          <div className="noc-zone-list">
            {zones.map((zone, idx) => (
              <div
                key={zone.name}
                className={`noc-zone-item ${zone.status} ${selectedZone === idx ? 'selected' : ''}`}
                onClick={() => setSelectedZone(idx)}
              >
                <div className="noc-zone-row-top">
                  <div className="noc-zone-name-wrap">
                    <span className={`noc-dot ${zone.status}`} />
                    <span>{zone.name}</span>
                  </div>
                  <span className={`noc-zone-pct ${zone.status}`}>{zone.uptime}</span>
                </div>
                <div className="noc-zone-row-meta">
                  <span>{zone.region}</span>
                  <span>{zone.latency}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--noc-border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--noc-text-faint)', letterSpacing: '0.15em' }}>
              PROBE SAMPLING: 60s INTERVAL
            </div>
            <div style={{ fontSize: '10px', color: 'var(--noc-green-text)', marginTop: '4px' }}>
              AUTO-FAILOVER: ENABLED
            </div>
          </div>
        </aside>

        {/* Center Column: Core Console Proposition */}
        <section className="noc-hero-center">
          <div className="noc-eyebrow">
            <span className="noc-pulse-dot" />
            MISSION CRITICAL UPTIME & TELEMETRY
          </div>

          <h1 className="noc-hero-h1">
            KNOW BEFORE<br />
            YOUR USERS<br />
            <em>DO.</em>
          </h1>

          <p className="noc-hero-sub">
            Sub-second distributed HTTP probes. Flapping-proof 3-failure incident consensus.
            Autonomous AI root-cause postmortems. Instant multi-channel dispatch with zero-auth public status pages.
          </p>

          <div className="noc-cta-rack">
            <Link href="/register" className="noc-btn-primary">
              LAUNCH CONSOLE →
            </Link>
            <Link href="/dashboard" className="noc-btn-secondary">
              OPEN LIVE DASHBOARD
            </Link>
          </div>

          {/* Industrial Hardware Metrics Rack */}
          <div className="noc-metrics-grid">
            <div className="noc-metric-cell">
              <div className="noc-metric-val">38ms</div>
              <div className="noc-metric-lbl">Avg Latency</div>
            </div>
            <div className="noc-metric-cell">
              <div className="noc-metric-val">99.98%</div>
              <div className="noc-metric-lbl">30d Consensus</div>
            </div>
            <div className="noc-metric-cell">
              <div className="noc-metric-val">1,440</div>
              <div className="noc-metric-lbl">Probes / Day</div>
            </div>
            <div className="noc-metric-cell">
              <div className="noc-metric-val">&lt; 3s</div>
              <div className="noc-metric-lbl">Incident TTD</div>
            </div>
          </div>
        </section>

        {/* Right Column: Live Incident Log & AI Summaries */}
        <aside className="noc-right-sidebar">
          <div className="noc-panel-header">
            <span>LIVE INCIDENT STREAM</span>
            <span style={{ color: 'var(--noc-amber)' }}>1 ACTIVE</span>
          </div>

          <div className="noc-incident-card" style={{ borderColor: 'rgba(255, 48, 48, 0.4)' }}>
            <span className="noc-badge open">CRIT / OPEN</span>
            <div className="noc-incident-name">Webhook Relay</div>
            <div className="noc-incident-meta">ECONNREFUSED · 12m duration · 3 failed probes</div>
          </div>

          <div className="noc-incident-card">
            <span className="noc-badge resolved">RESOLVED</span>
            <div className="noc-incident-name">Payment Gateway</div>
            <div className="noc-incident-meta">HTTP 503 Spike · 2h duration · AI postmortem ready</div>
          </div>

          <div className="noc-incident-card">
            <span className="noc-badge resolved">RESOLVED</span>
            <div className="noc-incident-name">Auth Service</div>
            <div className="noc-incident-meta">TLS Cert Renewal · 31m · auto-recovered</div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <div className="noc-panel-header">
              <span>AUTONOMOUS AI POSTMORTEM</span>
              <span style={{ color: 'var(--noc-green)' }}>LLM v2</span>
            </div>

            <div className="noc-ai-box">
              &quot;Payment latency spike traced to upstream PSP rate limit at 14:22 UTC.
              Auto-resolved after 2h 7m. No data loss. Recommend circuit-breaker threshold reduction.&quot;
              <span className="noc-ai-cursor" />
            </div>
          </div>
        </aside>
      </main>

      {/* Transmission Pipeline Section */}
      <section className="noc-section">
        <div className="noc-section-tag">
          <span className="noc-pulse-dot" />
          SYSTEM ARCHITECTURE
        </div>
        <h2 className="noc-section-title">TRANSMISSION PIPELINE</h2>
        <p className="noc-section-sub">
          Engineered for zero false alarms. Every ping travels through a four-stage state machine backed by Redis queues and row-level PostgreSQL locking.
        </p>

        <div className="noc-pipeline-grid">
          {pipeline.map((item) => (
            <div key={item.step} className="noc-pipe-card">
              <span className="noc-pipe-badge">{item.badge}</span>
              <div className="noc-pipe-step">{item.step}</div>
              <h3 className="noc-pipe-title">{item.title}</h3>
              <p className="noc-pipe-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Capabilities Matrix */}
      <section className="noc-section" style={{ background: 'rgba(10, 18, 26, 0.4)' }}>
        <div className="noc-section-tag">
          <span className="noc-pulse-dot" />
          TECHNICAL SPECIFICATIONS
        </div>
        <h2 className="noc-section-title">OPERATIONAL MATRIX</h2>
        <p className="noc-section-sub">
          Direct, zero-compromise developer ergonomics. Hand-crafted components, strict typing, and bulletproof security guards.
        </p>

        <div className="noc-caps-grid">
          {capabilities.map((cap) => (
            <div key={cap.title} className="noc-cap-card">
              <div className="noc-cap-tag">{cap.tag}</div>
              <h3 className="noc-cap-title">{cap.title}</h3>
              <p className="noc-cap-desc">{cap.desc}</p>
              <div className="noc-cap-specs">
                {cap.specs.map((spec) => (
                  <div key={spec} className="noc-cap-spec-item">
                    <span style={{ color: 'var(--noc-green)' }}>›</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Deploy Strip */}
      <section className="noc-section">
        <div className="noc-terminal-strip">
          <div className="noc-term-left">
            <span className="noc-term-label">SELF-HOSTED NOC IN 30 SECONDS</span>
            <span style={{ fontSize: '13px', color: 'var(--noc-text-muted)' }}>
              Spin up the entire Postgres + Redis + API + Worker + Next.js stack with a single command:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <code className="noc-term-cmd">docker compose up -d</code>
            <button
              onClick={handleCopyCmd}
              className="noc-btn-bezel-sm"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              {copiedCmd ? 'COPIED ✓' : 'COPY CMD'}
            </button>
          </div>
        </div>
      </section>

      {/* Console Footer */}
      <footer className="noc-footer">
        <div>
          <span>PULSEWATCH NOC CONSOLE</span>
          <span className="noc-divider" style={{ margin: '0 10px' }}>|</span>
          <span>STATION ID: 0x4F4C</span>
          <span className="noc-divider" style={{ margin: '0 10px' }}>|</span>
          <span>ALL SIGNALS ENCRYPTED</span>
        </div>

        <div className="noc-footer-links">
          <Link href="/dashboard">DASHBOARD</Link>
          <Link href="/login">SIGN IN</Link>
          <Link href="/register">CREATE ACCOUNT</Link>
        </div>
      </footer>
    </div>
  );
}
