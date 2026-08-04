# TopTier Xperienz — Design System

> Extracted from the **TopTier Xperienz Digital Platform** Stitch project (`projects/15319261775713912335`).  
> Last updated: 2026-07-31

---

## Brand & Style

The design system focuses on **exclusivity, precision, and high-end hospitality**, targeting an affluent audience seeking seamless, high-touch event management. The visual language balances **Minimalism** with **Glassmorphism**, creating a digital environment that feels like a luxury concierge service.

The emotional response should be one of **calm confidence and prestige**. High-quality imagery, generous whitespace, and restrained use of gold accents establish a premium aesthetic. Translucent layers and soft background blurs suggest depth and sophistication without overwhelming the user.

**Color Mode:** Light  
**Device Type:** Desktop  
**Roundness:** 8px (Round Eight)

---

## Color Palette

### Brand Override Colors

| Role | Hex |
|------|-----|
| Primary Black | `#111111` |
| Luxury Gold | `#D4AF37` |

> **Usage:** Primary Black is used for typography, navigation backgrounds, and high-impact buttons. Luxury Gold is reserved for interactive elements, focus states, and premium highlights — use sparingly to prevent visual fatigue.

### Core Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#fdf8f8` | Main application background |
| `surface-dim` | `#ddd9d8` | Dimmed/muted surface |
| `surface-bright` | `#fdf8f8` | Bright surface variant |
| `surface-container-lowest` | `#ffffff` | Lowest elevation container |
| `surface-container-low` | `#f7f3f2` | Low elevation container |
| `surface-container` | `#f1edec` | Standard container |
| `surface-container-high` | `#ebe7e6` | High elevation container |
| `surface-container-highest` | `#e5e2e1` | Highest elevation container |
| `background` | `#fdf8f8` | Page background (alias of surface) |
| `surface-variant` | `#e5e2e1` | Alternative surface tint |
| `surface-tint` | `#5f5e5e` | Tint overlay color |

### On-Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#1c1b1b` | Primary text on surfaces |
| `on-surface-variant` | `#444748` | Secondary text on surfaces |
| `on-background` | `#1c1b1b` | Primary text on background |
| `inverse-surface` | `#313030` | Inverse (dark) surface |
| `inverse-on-surface` | `#f4f0ef` | Text on inverse surface |
| `inverse-primary` | `#c8c6c5` | Inverse primary accent |

### Primary Colors (Black/Charcoal)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#000000` | Primary brand color (Black) |
| `on-primary` | `#ffffff` | Text/icons on primary |
| `primary-container` | `#1c1b1b` | Primary container background |
| `on-primary-container` | `#858383` | Content on primary container |
| `primary-fixed` | `#e5e2e1` | Fixed primary tonal |
| `primary-fixed-dim` | `#c8c6c5` | Dimmed fixed primary |
| `on-primary-fixed` | `#1c1b1b` | Text on primary-fixed |
| `on-primary-fixed-variant` | `#474646` | Variant text on primary-fixed |

### Secondary Colors (Gold/Amber)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#735c00` | Secondary brand color (Dark Gold) |
| `on-secondary` | `#ffffff` | Text/icons on secondary |
| `secondary-container` | `#fed65b` | Secondary container (Bright Gold) |
| `on-secondary-container` | `#745c00` | Content on secondary container |
| `secondary-fixed` | `#ffe088` | Fixed secondary tonal |
| `secondary-fixed-dim` | `#e9c349` | Dimmed fixed secondary |
| `on-secondary-fixed` | `#241a00` | Text on secondary-fixed |
| `on-secondary-fixed-variant` | `#574500` | Variant text on secondary-fixed |

### Tertiary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | `#000000` | Tertiary brand color |
| `on-tertiary` | `#ffffff` | Text/icons on tertiary |
| `tertiary-container` | `#1d1b1a` | Tertiary container background |
| `on-tertiary-container` | `#868381` | Content on tertiary container |
| `tertiary-fixed` | `#e6e1df` | Fixed tertiary tonal |
| `tertiary-fixed-dim` | `#cac6c3` | Dimmed fixed tertiary |
| `on-tertiary-fixed` | `#1d1b1a` | Text on tertiary-fixed |
| `on-tertiary-fixed-variant` | `#484645` | Variant text on tertiary-fixed |

### Outline Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#747878` | Default border/outline |
| `outline-variant` | `#c4c7c7` | Subtle dividers and borders |

### Semantic / State Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ba1a1a` | Error states, destructive actions |
| `on-error` | `#ffffff` | Text/icons on error |
| `error-container` | `#ffdad6` | Error container background |
| `on-error-container` | `#93000a` | Content on error container |

### Gradient

For primary actions use a subtle linear gradient:

```css
background: linear-gradient(135deg, #111111 0%, #222222 100%);
```

---

## Typography

**Font Pairing Strategy:** Traditional serif headline + systematic sans-serif body — bridging "Luxury" and "Technology."

### Font Families

| Role | Family | Source |
|------|--------|--------|
| **Headline** | Playfair Display | Google Fonts |
| **Body** | Inter | Google Fonts |
| **Label** | Inter | Google Fonts |

```html
<!-- Google Fonts import -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|--------|------|--------|-------------|----------------|-------|
| `headline-xl` | Playfair Display | 48px | 700 | 1.2 | -0.02em | Hero sections, event titles (Desktop) |
| `headline-xl-mobile` | Playfair Display | 32px | 700 | 1.2 | — | Hero sections (Mobile) |
| `headline-lg` | Playfair Display | 32px | 600 | 1.3 | — | Section headings |
| `headline-md` | Playfair Display | 24px | 600 | 1.4 | — | Subsection headings |
| `body-lg` | Inter | 18px | 400 | 1.6 | — | Primary body copy |
| `body-md` | Inter | 16px | 400 | 1.6 | — | Standard body text |
| `label-sm` | Inter | 12px | 600 | 1.2 | 0.1em | Uppercase metadata labels |

### Typography Guidelines

- **Headlines:** Apply tight letter-spacing (`-0.02em`) for a modern, high-fashion editorial look.
- **Body:** Generous line-heights (1.6) for comfort and legibility on mobile devices.
- **Labels:** Always uppercase with `0.1em` letter-spacing for metadata such as `DATE`, `VENUE`, `TICKET CATEGORY`.

---

## Spacing

**Base Unit:** `8px` — All spacing values should be multiples of this unit to maintain mathematical harmony.

| Token | Value | Usage |
|-------|-------|-------|
| `unit` | 8px | Base spacing unit |
| `gutter` | 24px | Column gutter |
| `margin-mobile` | 20px | Mobile side margins |
| `margin-desktop` | 64px | Desktop side margins |
| `container-max` | 1280px | Maximum content width |

### Spacing Scale (8px multiples)

```
 4px  → micro  (internal icon padding)
 8px  → xs     (tight component spacing)
16px  → sm     (component internal spacing)
24px  → md     (gutter / between elements)
32px  → lg     (between sections)
48px  → xl     (section breathing room)
64px  → 2xl    (large section margins)
80–120px        (hero / between major sections)
```

### Layout Grid

| Breakpoint | Columns | Gutter | Margins |
|------------|---------|--------|---------|
| Desktop | 12 | 24px | 64px |
| Mobile | 4 | 16px | 20px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 0.25rem (4px) | Micro elements |
| `rounded` (DEFAULT) | 0.5rem (8px) | Standard — inputs, small buttons, tags |
| `rounded-md` | 0.75rem (12px) | Mid-size components |
| `rounded-lg` | 1rem (16px) | Event cards, featured containers |
| `rounded-xl` | 1.5rem (24px) | Search bars, pill CTA buttons |
| `rounded-full` | 9999px | Fully circular elements |

---

## Elevation & Depth

Depth is achieved through **Glassmorphism** and soft ambient shadows — not heavy borders.

### Surface Layers

| Layer | Background | Effect |
|-------|------------|--------|
| Base | `#fdf8f8` | Canvas |
| Cards / Surface | White / light gray | `0px 10px 40px rgba(0, 0, 0, 0.04)` |
| Overlays (modals, nav, dropdowns) | `rgba(255, 255, 255, 0.8)` | `backdrop-filter: blur(12px)` |

### Glassmorphism Pattern

```css
/* Navigation / Modal overlay */
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);

/* Card ambient shadow */
box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.04);
```

### Hover Transitions

```css
transition: box-shadow 300ms ease-in-out, transform 300ms ease-in-out;
```

---

## Component Guidelines

### Buttons

| Type | Background | Text | Border |
|------|------------|------|--------|
| Primary | `#111111` gradient | White | None |
| Secondary (Ghost) | Transparent | `#111111` | 1px solid `#747878` |
| CTA (Pill) | `#111111` → `#222222` | White | `rounded-xl` |

```css
.btn-primary {
  background: linear-gradient(135deg, #111111, #222222);
  color: #ffffff;
  border-radius: 1.5rem;
  padding: 12px 24px;
  transition: all 300ms ease-in-out;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #222222, #333333);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}
```

### Cards (Event Cards)

```css
.event-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.04);
  transition: box-shadow 300ms ease-in-out;
}

.event-card:hover {
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.08);
}

.event-card__image-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
}
```

### Input Fields

```css
.input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #c4c7c7;
  padding: 8px 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1c1b1b;
  transition: border-color 200ms ease;
}

.input:focus {
  outline: none;
  border-bottom-color: #D4AF37;
}
```

### Chips / Tags

- Background: `#f1edec`
- Typography: `label-sm` — Inter 12px/600, 0.1em tracking, uppercase
- Border radius: 8px

### Navigation

- Persistent top bar with glassmorphism (`backdrop-filter: blur(12px)`)
- Blur intensity increases on scroll for legibility

### Progress Indicators (Booking Flow)

- Thin Gold lines (`#D4AF37`) indicate step completion
- Elegant, minimalist — avoid bulky step circles

---

## CSS Custom Properties

```css
:root {
  /* ── COLORS ─────────────────────────────────────── */

  /* Surfaces */
  --color-surface: #fdf8f8;
  --color-surface-dim: #ddd9d8;
  --color-surface-bright: #fdf8f8;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f7f3f2;
  --color-surface-container: #f1edec;
  --color-surface-container-high: #ebe7e6;
  --color-surface-container-highest: #e5e2e1;
  --color-background: #fdf8f8;
  --color-surface-variant: #e5e2e1;
  --color-surface-tint: #5f5e5e;

  /* On-Surface */
  --color-on-surface: #1c1b1b;
  --color-on-surface-variant: #444748;
  --color-on-background: #1c1b1b;
  --color-inverse-surface: #313030;
  --color-inverse-on-surface: #f4f0ef;

  /* Primary */
  --color-primary: #000000;
  --color-on-primary: #ffffff;
  --color-primary-container: #1c1b1b;
  --color-on-primary-container: #858383;
  --color-inverse-primary: #c8c6c5;
  --color-primary-fixed: #e5e2e1;
  --color-primary-fixed-dim: #c8c6c5;
  --color-on-primary-fixed: #1c1b1b;
  --color-on-primary-fixed-variant: #474646;

  /* Secondary (Gold) */
  --color-secondary: #735c00;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #fed65b;
  --color-on-secondary-container: #745c00;
  --color-secondary-fixed: #ffe088;
  --color-secondary-fixed-dim: #e9c349;
  --color-on-secondary-fixed: #241a00;
  --color-on-secondary-fixed-variant: #574500;

  /* Tertiary */
  --color-tertiary: #000000;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #1d1b1a;
  --color-on-tertiary-container: #868381;

  /* Outline */
  --color-outline: #747878;
  --color-outline-variant: #c4c7c7;

  /* Semantic */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  /* Brand Overrides */
  --color-brand-black: #111111;
  --color-brand-gold: #D4AF37;

  /* ── TYPOGRAPHY ──────────────────────────────────── */
  --font-headline: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-label: 'Inter', system-ui, sans-serif;

  --text-headline-xl-size: 48px;
  --text-headline-xl-weight: 700;
  --text-headline-xl-lh: 1.2;
  --text-headline-xl-ls: -0.02em;

  --text-headline-xl-mobile-size: 32px;
  --text-headline-xl-mobile-weight: 700;
  --text-headline-xl-mobile-lh: 1.2;

  --text-headline-lg-size: 32px;
  --text-headline-lg-weight: 600;
  --text-headline-lg-lh: 1.3;

  --text-headline-md-size: 24px;
  --text-headline-md-weight: 600;
  --text-headline-md-lh: 1.4;

  --text-body-lg-size: 18px;
  --text-body-lg-weight: 400;
  --text-body-lg-lh: 1.6;

  --text-body-md-size: 16px;
  --text-body-md-weight: 400;
  --text-body-md-lh: 1.6;

  --text-label-sm-size: 12px;
  --text-label-sm-weight: 600;
  --text-label-sm-lh: 1.2;
  --text-label-sm-ls: 0.1em;

  /* ── SPACING ─────────────────────────────────────── */
  --spacing-unit: 8px;
  --spacing-gutter: 24px;
  --spacing-margin-mobile: 20px;
  --spacing-margin-desktop: 64px;
  --container-max: 1280px;

  /* ── BORDER RADIUS ───────────────────────────────── */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* ── ELEVATION ───────────────────────────────────── */
  --shadow-card: 0px 10px 40px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0px 20px 60px rgba(0, 0, 0, 0.08);
  --blur-overlay: blur(12px);
  --bg-overlay: rgba(255, 255, 255, 0.8);
}
```

---

## Design Principles

1. **Minimalism with Depth** — Use whitespace generously. Let content breathe with 80–120px vertical padding between sections.
2. **Restrained Gold** — `#D4AF37` is an accent, not a primary. Use only for focus states, interactive highlights, and premium CTAs.
3. **Glassmorphism Overlays** — Modals, dropdowns, and the navigation bar use `backdrop-filter: blur(12px)`.
4. **8px Rhythm** — All spacing, padding, and margins must be multiples of `8px`.
5. **Smooth Transitions** — All interactive state changes use `300ms ease-in-out`. No abrupt jumps.
6. **Typography Hierarchy** — Headlines are always Playfair Display. Functional UI text is always Inter.
7. **Shadows as Light** — Shadows simulate light catching surfaces (`0px 10px 40px rgba(0, 0, 0, 0.04)`), never dark outlines.
