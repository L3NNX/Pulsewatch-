# Design System: PulseWatch (NOC War Room Console)

<!-- impeccable:design-schema 1 -->

## Visual World: NOC War Room Console

The interface is a mission-critical network operations center console—phosphor green on cathode-ray near-black, zone status panels flanking a bold condensed display headline, and hardware-beveled chamfered action controls. It rejects generic SaaS AI slop in favor of authentic telecommunications and aerospace monitoring aesthetics.

### Core Principles
1. **Mission-Critical Realism**:
   - The page is not a marketing brochure; it is an active operations console.
   - Live hardware status indicators, pulsing radar indicators, real-time UTC clock.
   - Dual-encoding accessibility across all status indicators (color + distinct textual state + icon).
2. **Typography with Gravitas**:
   - **Display Headings**: `Barlow Condensed` (Bold/Black, uppercase, tight tracking `-0.02em` to `-0.03em`).
   - **Terminal & Telemetry**: `Share Tech Mono` (monospace, crisp scanline readability, tabular figures).
3. **Phosphor Material Palette**:
   - **Cathode Ground (`--noc-bg`)**: `#060b10` (deep CRT cathode black).
   - **Surface Card (`--noc-bg-surface`)**: `#0a121a` (deep slate navy console chassis).
   - **Primary Phosphor (`--noc-green`)**: `#00ff88` (high-voltage phosphor green with subtle glow).
   - **Warning Amber (`--noc-amber`)**: `#ffa000` (cautionary signal for degraded latency/503).
   - **Critical Red (`--noc-red`)**: `#ff3030` (pulsing critical alarm for outages/timeouts).
   - **Borders (`--noc-border`)**: `rgba(0, 255, 136, 0.16)` (subtle phosphor trace lines).
4. **Physical Textures**:
   - **Scanlines**: Repeating horizontal scanlines overlay (`rgba(0, 0, 0, 0.22)`).
   - **Cathode Grid**: 48px phosphor grid lines (`rgba(0, 255, 136, 0.035)`).
   - **Vignette**: Radial cathode decay around screen perimeter.
   - **Hardware Bezel**: 45-degree chamfered polygon clip-paths on primary action buttons.

---

## Palette Tokens

| Token | Hex / Value | Usage |
|---|---|---|
| `--noc-bg` | `#060b10` | App background canvas |
| `--noc-bg-surface` | `#0a121a` | Console panels and sidebar racks |
| `--noc-green` | `#00ff88` | Operational state (UP), primary CTAs, radar pulse |
| `--noc-amber` | `#ffa000` | Warning state (SLOW/503), degraded performance |
| `--noc-red` | `#ff3030` | Outage state (CRIT/DOWN), incident badges |
| `--noc-border` | `rgba(0, 255, 136, 0.16)` | Hardware bezel borders and dividers |
| `--noc-text-bright` | `#e0f0e8` | Primary text and headings |
| `--noc-text-muted` | `rgba(224, 240, 232, 0.55)` | Secondary labels and descriptions |
| `--noc-text-faint` | `rgba(224, 240, 232, 0.35)` | Metadata, coordinates, and version tags |

---

## Component Layout Standards

### Top Hardware Status Bar
- Sticky 48px status bar with brand radar logo, version tag (`NOC CONSOLE v4.1.2`), global health pulse (`● ALL SYSTEMS NOMINAL`), live UTC clock, and quick navigation.

### 3-Column Mission Control Console
1. **Left Panel: Service Zones**:
   - Live service list (Production API, Auth, Payment Gateway, CDN, Webhook Relay, Database, Search).
   - RAG (Red/Amber/Green) status indicators with live uptime percentages and response times.
2. **Center Stage: Core Hook**:
   - Monospace eyebrow tag with pulsing green beacon.
   - 82px Barlow Condensed headline: `KNOW BEFORE YOUR USERS DO.`
   - Chamfered hardware bezel CTAs (`LAUNCH CONSOLE →`, `OPEN LIVE DASHBOARD`).
   - 4-cell industrial metrics rack (38ms Avg Latency, 99.98% 30d Consensus, 1,440 Probes/Day, < 3s Incident TTD).
3. **Right Panel: Live Incident Log & AI Postmortem**:
   - Real-time incident alert cards (CRIT/OPEN and RESOLVED).
   - Autonomous AI incident analysis box with terminal cursor.

### Tactical Sections Below Hero
- **Transmission Pipeline**: 4-stage architecture pipeline (BullMQ Dispatcher → SSRF-Isolated Probe → Consensus Matrix → Omni-Channel Alert).
- **Operational Matrix**: 6-card technical specification grid with zero fluff.
- **Rapid Deployment**: Quick-start terminal command (`docker compose up -d`) with instant clipboard copy.
