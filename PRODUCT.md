# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Monorepo (`/frontend`, `/backend`, `docker-compose.yml`):
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form + Zod, Recharts
- **Backend**: Node.js, Express, TypeScript, Prisma ORM (PostgreSQL / Neon), BullMQ v5 (Redis Cloud), Zod, Pino structured logger, Vitest + Supertest
- **Infrastructure / Deployment**: Docker Compose (local), Vercel (frontend), Render / VM (backend & worker), GitHub Actions CI/CD

## Users

- **Indie Developers ("Riya")**: Solo creators running multiple side projects/APIs who need instant, low-noise alerts (Discord/Slack/webhook/email) when services fail or recover without paying for heavy enterprise tools.
- **Small Startup Founders ("Arjun")**: Founders who need an unauthenticated, zero-friction public status page (`/status/:slug`) with uptime history to reduce support inquiries during downtime.
- **Hiring Managers & Technical Interviewers ("Persona C")**: Recruiters and engineering leads reviewing the live demo in 2–3 minutes; requires instant comprehension, realistic demo telemetry, and transparent architecture.

## Product Purpose

PulseWatch provides automated HTTP/HTTPS uptime monitoring, automated incident detection and recovery, plain-English AI incident summaries, and public status pages. It exists to solve the gap between expensive enterprise monitoring suites (Better Stack, Datadog, Statuspage) and unmaintained scripts, delivering production engineering habits on free-tier infrastructure.

Success means:
- A user can register, configure monitors with custom intervals (≥60s), and inspect live uptime % and p95 latency.
- Consecutive failure threshold (3 fails) triggers an incident and dispatches alerts; 2 consecutive successes auto-resolve and trigger AI/template summaries.
- Public status page loads without auth with 30-second ISR/caching.

## Positioning

A lightweight, developer-first uptime and incident platform that combines scheduled queue-driven HTTP probes with automated AI-synthesized root-cause narratives and public status pages—built with strict production hygiene (SSRF defense, row-level locking, idempotent retries, AES-256-GCM secret encryption) designed to run entirely on free-tier services.

## Operating Context

- **Web browser**: Responsive desktop and mobile browsers for monitoring dashboards and public status pages.
- **Alert channels**: Discord incoming webhooks, Slack incoming webhooks, email (SMTP / Brevo / Resend), and generic HTTP webhooks.
- **Probe environment**: BullMQ scheduled worker jobs performing outward HTTP/HTTPS health checks with strict timeouts (10s default) and redirect limits (max 5).
- **Public viewing**: Unauthenticated visitors inspecting public status pages to check operational status and incident history.

## Capabilities and Constraints

- **Capabilities**:
  - Monitor CRUD (URL, GET/HEAD, interval 60s–300s, timeout, expected status code ranges).
  - Incident state machine: 3 consecutive failures to open DOWN; 2 consecutive successes to resolve UP (managed with `SELECT FOR UPDATE` and DB partial unique index `WHERE status = 'OPEN'`).
  - Alert dispatch with deterministic IDs (`incidentId:channelId:event`) and exponential backoff retry.
  - AI incident summaries via Google Gemini / Groq with deterministic template fallback.
  - Uptime statistics: 24h, 7d, 30d uptime percentages and p95/average latency.
  - Dedicated public status page (`/status/[slug]`) with privacy isolation (URLs and webhook configs are never exposed).
- **Constraints**:
  - Free-tier safety bounds: max 10 monitors per user, min interval 60s, max 5 alert channels per user, max 10 AI summaries per user/day.
  - 30-day data retention: automatic batch cleanup of old check records.
  - Single-user accounts in MVP (no team invites or multi-tenant RBAC).
  - Single check origin (no multi-region checks).
  - HTTP/HTTPS checks only (no TCP, ICMP ping, or DNS checks).
  - Strict SSRF protection: reject RFC 1918 private IPs, loopback, link-local, cloud metadata IP (169.254.169.254), and non-HTTP protocols; re-verify resolved DNS IP.
  - Channel secrets encrypted at rest via AES-256-GCM.

## Brand Commitments

- **Name**: PulseWatch
- **Visual Benchmark**: Category Standard in the tradition of UptimeRobot and Pingdom (familiar, pragmatic, straightforward tabular uptime monitoring ergonomics).
- **Tone & Voice**: Crisp, dependable, developer-centric, transparent, and calm. High signal-to-noise ratio.
- **Status Semantics**: Consistent status coloring (Green = UP, Red = DOWN, Yellow = PENDING, Gray = PAUSED); color is never the solitary indicator (always paired with icon and accessible text).

## Evidence on Hand

- Complete 15-page Product Requirements Document (PRD v1.0 by Gaurav Debnath).
- Exact database schema and API specifications defined.
- State machine rules, retry policies, and architecture diagrams confirmed.
- Absent: Pre-existing visual mockups or design tokens (to be shaped/crafted in next phase).

## Product Principles

1. **A failed check is telemetry, not a system error**: Monitored endpoints returning 5xx or timing out are valid business observations; BullMQ retries are reserved strictly for infrastructure/delivery failures.
2. **Prevent alert storms and flapping**: Rigorous consecutive thresholds (3 fails to trigger, 2 passes to recover) and idempotent alert job IDs ensure high-signal, zero-duplication alerting.
3. **Privacy and security by default**: Public status pages never leak internal URLs, headers, or query parameters; probe engines aggressively block SSRF and internal network access.
4. **Resilient with deterministic fallbacks**: If external AI or third-party notification APIs fail or time out, deterministic template summaries and exponential backoff retries guarantee platform continuity.
5. **Zero-friction clarity for recruiters and users**: The interface communicates health and infrastructure metrics instantly with zero ambiguity or clutter.

## Accessibility & Inclusion

- Keyboard navigability across all dialogs, forms, and data tables.
- Dual visual encoding: all status indicators pair color with explicit icons and text labels to support colorblind users.
- Accessible form fields with explicit labels and field-level inline error states.
- High-contrast, scannable data visualization for uptime and latency charts.
