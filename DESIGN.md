# Design System: Brutalist-Lite B2C SaaS (Anton & Golden Yellow)

<!-- impeccable:design-schema 1 -->

## Visual World: Brutalist-Lite High-Contrast SaaS

A bold, modern B2C SaaS experience with a high-contrast editorial feel. The design pairs aggressive display typography (**Anton**) with clean, sophisticated sans-serif body copy (**Satoshi**), powered by a striking color palette of **Golden Yellow (#ffe17c)** highlights against **Charcoal (#171e19)** and **Pure White (#ffffff)** backgrounds.

### Core DNA
- **Aggressive Display Typography**: Headlines set in **Anton** (uppercase, `leading-[0.9]`, font sizes scaling from `text-6xl` to `text-9xl`).
- **Clean Body Sans**: Paragraphs, labels, and UI controls set in **Satoshi** (weights 400, 500, 700).
- **Golden Yellow Highlights**: `#ffe17c` primary accent used for high-impact CTAs, badge dots, stars, and 15-degree rotated headline highlight backplates.
- **Alternating Sections**: High-contrast rhythm alternating between Pure White (`#ffffff`), Deep Charcoal (`#171e19`), Dark Gray (`#272727`), and radiant Golden Yellow (`#ffe17c`).
- **40px Grid Pattern**: `background-size: 40px 40px` linear gradient using `#b7c6c220`.
- **Micro-Interactions**: Smooth 300ms `cubic-bezier(0.4, 0, 0.2, 1)` transitions on cards, buttons, and mockup elements.

---

## Palette Tokens

| Token | Hex / Value | Usage |
|---|---|---|
| **Golden Yellow** | `#ffe17c` | Primary CTAs, headline accents, rating stars, active indicators, final CTA bg |
| **Charcoal** | `#171e19` | Dark section background, problem card, pill buttons, primary text in light mode |
| **Dark Gray** | `#272727` | Solution card background, dark panel accents |
| **Sage** | `#b7c6c2` | Grid hairlines, secondary dark-section text, border accents |
| **White** | `#ffffff` | Light section background, cards, input backgrounds |
| **Light Gray** | `#f8f9fa` | Bento feature card backgrounds |

---

## Key Section Blueprints

### 1. Navigation
- Fixed header (`h-20`) with `#ffffff/90%` backdrop blur.
- Logo: 'Anton' (`text-3xl`, uppercase) with a `#ffe17c` golden period (`PULSEWATCH.`).
- Center: Clean Satoshi navigation links with hover color shifts.
- Right: Text-only Login link and pill-shaped Charcoal button (`rounded-full px-6`).

### 2. Grid-Patterned Hero
- Centered layout on 40px linear-gradient grid.
- Pill badge with yellow dot indicator.
- Anton 9xl headline with an angled 15-degree Golden Yellow highlight plate.
- Side-by-side waitlist/trial input and massive Anton button.
- Abstract 3-panel UI browser frame mockup with macOS traffic lights, active canvas, and properties inspector.

### 3. Problem vs Solution Split
- Full-width two-tone block:
  - **Left (Problem / The Old Way)**: `#171e19` charcoal with red `X` icons and sage text.
  - **Right (Solution / The PulseWatch Way)**: `#272727` dark gray with `#ffe17c` check icons and glowing border accent.

### 4. 3-Column Bento Grid
- Auto-row bento layout with 2-column hero spans.
- Animated pulse telemetry, dark terminal code blocks, avatar stacks.

### 5. Numerical Step-by-Step ("How It Works")
- Sticky Anton headline (`text-7xl` to `text-8xl`).
- 3 vertical step cards featuring massive `text-8xl` numerals in `#ffe17c/20%` that shift to 100% golden opacity on hover.

### 6. High-Impact Final CTA
- Full `#ffe17c` background with 10% opacity Anton watermark typography (`UPTIME NEVER SLEEPS`).
- Charcoal CTA input and button with `hover:scale-105` transition.
