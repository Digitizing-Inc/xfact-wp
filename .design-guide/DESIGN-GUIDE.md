---
title: xFact Design System
author: xFact
---

<div class="cover-page">
  <div class="cover-content">
    <h1>xFact Design System</h1>
    <p class="subtitle">Brand Guidelines, Typography, and Component Architecture</p>
    <div class="version-info">
      <span>Version 2.0</span> | <span>WordPress Integration</span>
    </div>
  </div>
</div>

<div class="page-break"></div>

## 1. Design Philosophy

The xFact Design System is engineered to project authority, reliability, and modern technical excellence. It emphasizes **content clarity, precise typography, and a deliberate structural hierarchy** using fluid layouts. Built as a foundation for both the Next.js frontend and the WordPress Block Theme, this system ensures 1:1 parity across environments.

---

## 2. Design Tokens: Color System

Our color system leverages CSS custom properties to seamlessly adapt between **Light Mode** and **Dark Mode**. We utilize a restrained palette of deep navy blues, stark whites, and accessible grays, accented by an energetic brand blue.

### Surface & Background Tokens

| Token | Light Mode | Dark Mode | Usage Context |
| :--- | :--- | :--- | :--- |
| `--xfact-bg` | <span class="swatch" style="background-color:#f5f7fa"></span> `#F5F7FA` | <span class="swatch" style="background-color:#09172f"></span> `#09172F` | Default page background |
| `--xfact-bg-alt` | <span class="swatch" style="background-color:#ffffff; border: 1px solid #e2e8f0;"></span> `#FFFFFF` | <span class="swatch" style="background-color:#022038"></span> `#022038` | Alternating sections (Case Studies, Industries) |
| `--xfact-bg-card` | <span class="swatch" style="background-color:#ffffff; border: 1px solid #e2e8f0;"></span> `#FFFFFF` | <span class="swatch" style="background-color:#06384f"></span> `#06384F` | Card and modular component surfaces |
| `--xfact-border` | <span class="swatch" style="background-color:#e2e8f0"></span> `#E2E8F0` | <span class="swatch" style="background-color:rgba(255, 255, 255, 0.1)"></span> `rgba(255, 255, 255, 0.1)` | Subtle structural dividers and borders |

### Typography & Content Tokens

| Token | Light Mode | Dark Mode | Usage Context |
| :--- | :--- | :--- | :--- |
| `--xfact-text` | <span class="swatch" style="background-color:#1a202c"></span> `#1A202C` | <span class="swatch" style="background-color:#ffffff; border: 1px solid #1a202c;"></span> `#FFFFFF` | Primary headings and body copy |
| `--xfact-text-secondary` | <span class="swatch" style="background-color:#4a5568"></span> `#4A5568` | <span class="swatch" style="background-color:rgba(255, 255, 255, 0.6)"></span> `rgba(255, 255, 255, 0.6)` | Subtitles, summaries, and meta data |
| `--xfact-text-muted` | <span class="swatch" style="background-color:#718096"></span> `#718096` | <span class="swatch" style="background-color:rgba(255, 255, 255, 0.45)"></span> `rgba(255, 255, 255, 0.45)` | Tertiary information, captions, breadcrumbs |

### Brand & Interactive Accents

| Token | Color | Usage Context |
| :--- | :--- | :--- |
| `--xfact-accent` | <span class="swatch" style="background-color:#5c8ae6"></span> `#5C8AE6` | Primary interactive elements, links, active states |
| `--xfact-accent-dark` | <span class="swatch" style="background-color:#3a6bd4"></span> `#3A6BD4` | Hover states, focused elements |
| `--xfact-accent-darkest` | <span class="swatch" style="background-color:#123e99"></span> `#123E99` | Primary button backgrounds |
| `--xfact-dark-section` | <span class="swatch" style="background-color:#0d2d6b"></span> `#0D2D6B` | High-impact hero sections, structural headers |

<div class="page-break"></div>

## 3. Typography Hierarchy

The system utilizes **Inter** as its singular typeface, chosen for its exceptional legibility, precise letterforms, and variable weight capabilities that ensure optimal rendering across all viewports.

### Global Configuration
* **Font Family**: `Inter`, sans-serif
* **Base Size**: `1rem` (16px) mapping with `1.7` line-height for body copy.
* **Fluid Scaling**: Typography scales dynamically based on viewport width (`clamp()` functions defined via `theme.json`).

### Hierarchy

#### H1 Hero Heading
**Bold (700)** · High-impact, page-level hierarchy.
Utilizes `--wp--preset--font-size--hero`

#### H2 Section Heading
**Bold (700)** · Defines major content regions.
Utilizes `--wp--preset--font-size--xx-large`

#### H3 Subsection Heading
**Bold (700)** · Titles for cards, grid items, and subsections.
Utilizes `--wp--preset--font-size--x-large`

#### Body Copy
**Regular (400) / Medium (500)** · General paragraph text.
Utilizes `--wp--preset--font-size--medium` (`1rem`)

---

## 4. Spacing & Spatial Rhythm

Consistent spatial rhythm is critical to the xFact aesthetic. We use a standardized rem-based scale for component padding and a distinct scale for structural sections.

* **Base Section Padding (`--xfact-spacing-section`)**: `5.625rem` (90px) — Standard top/bottom padding for most blocks.
* **Large Section Padding (`--xfact-spacing-section-lg`)**: `7rem` (112px) — Extended padding for Hero elements or highly dense content.
* **Component Gaps**: Elements typically utilize standard multi-rem increments (e.g., `1.5rem` internal card padding, `1rem` CSS grid gaps).

<div class="page-break"></div>

## 5. Component Library

### Interactive Cards
Cards are the primary vehicle for modular content (Industries, Capabilities, Features).
* **Surface**: `var(--xfact-surface)` transitioning to slightly elevated states on interaction.
* **Border**: `1px solid var(--xfact-border)` outlining the perimeter.
* **Hover State**: Cards utilize `.xfact-card-interactive` to deploy a subtle drop shadow `box-shadow: 0 4px 6px -1px rgba(...)` and shift the border color to `--xfact-accent` at 40% opacity.

### Call-to-Action Buttons
Buttons communicate action through high-contrast gradients and definitive boundaries.
* **Primary**: Linear gradient transitioning from `--xfact-btn-from` to `--xfact-btn-to`.
* **Hover**: The gradient shifts smoothly to `--xfact-btn-hover-from` providing tactile feedback.
* **Secondary**: Transparent background with a subtle border, inverting to accent colors upon hover.

### Block Alignments
* **Case Study Grid**: Wrapped in `--xfact-bg-alt` to separate from primary flows. Features grid-based alignment scaling from 1 column on mobile to 2/3 on desktop.
* **Logo Strip**: Continuous horizontal marquee. Images are desaturated via CSS `filter: grayscale(1)` and transition to full color upon hover, minimizing visual noise while retaining brand identity.

---

## 6. Dark Mode Architecture

The theme ships with a native, zero-flicker dark mode.

### Implementation Strategy
Dark mode is initiated by the `[data-theme="dark"]` attribute on the root HTML element, triggered by either the user's OS preference (`prefers-color-scheme: dark`) or manual toggling via the `dark-mode.js` controller.

### Token Inversion
When activated, the system dynamically swaps the root CSS variables:
* Backgrounds drop to deep `#09172F` and `#022038`.
* Borders become translucent `rgba(255, 255, 255, 0.1)`, removing harsh delineations.
* Secondary/Muted text drops to `0.6` and `0.45` opacity whites, maintaining contrast without causing eye strain.

These tokens are directly wired into WordPress's `theme.json` preset values via `enqueue.php`, ensuring complete parity whether viewing the frontend or editing within the Gutenberg interface.
