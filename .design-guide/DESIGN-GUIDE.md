---
title: xFact Design System
author: xFact
---

<div class="cover-page">
  <div class="cover-content">
    <h1>xFact Design System</h1>
    <p class="subtitle">Brand Guidelines, Typography, and Component Architecture</p>
    <div class="version-info">
      <span>Version 3.0</span> | <span>WordPress Integration & Semantic Tokens</span>
    </div>
  </div>
</div>

<div class="page-break"></div>

## 1. Design Philosophy & Brand Guidelines

The xFact Design System is engineered to project authority, reliability, and modern technical excellence. It emphasizes **content clarity, precise typography, and a deliberate structural hierarchy** using fluid layouts. 

The brand exudes a sense of **technological superiority** through the use of deep, structured blues, contrasted against crisp whites and vibrant blue gradients. The introduction of the "Systems Window" (Glassmorphism) aesthetic allows the interface to feel layered, dynamic, and inherently modern, without sacrificing legibility or accessibility.

---

## 2. Design Tokens: Semantic Color System

Our color system leverages CSS custom properties (`var(--xfact-semantic-*)`) mapped directly into `theme.json`. This ensures seamless adaptation between **Light Mode** and **Dark Mode** natively without requiring manual overrides in the editor.

### Core Semantic Palette (Mapped to `theme.json`)

| Token | CSS Variable | Usage Context |
| :--- | :--- | :--- |
| `primary` | `var(--xfact-semantic-primary)` | Primary brand color, CTA backgrounds |
| `primary-dark` | `var(--xfact-semantic-primary-dark)` | Hover states, active elements |
| `primary-light` | `var(--xfact-semantic-primary-light)` | Subtle backgrounds, active borders |
| `text-primary` | `var(--xfact-semantic-text-primary)` | Main headings and body copy |
| `text-secondary` | `var(--xfact-semantic-text-secondary)` | Subtitles, summaries, meta data |
| `surface` | `var(--xfact-semantic-surface)` | Default page and container background |
| `surface-alt` | `var(--xfact-semantic-surface-alt)` | Raised cards and alternating sections |

### Gradients

| Token | CSS Variable | Usage Context |
| :--- | :--- | :--- |
| `primary-1` | `var(--xfact-gradient-primary-1)` | High-impact hero headings and CTAs |
| `primary-2` | `var(--xfact-gradient-primary-2)` | Hover states for primary gradients |

<div class="page-break"></div>

## 3. Typography Hierarchy

The system utilizes a dual-typeface approach to balance technical precision with modern authority. **IBM Plex Mono** serves as the primary body typeface, conveying an engineered, data-driven feel. **Inter** is utilized exclusively for headings and structural UI elements, providing exceptional legibility and high-impact hierarchy.

### Global Configuration
* **Body Font**: `IBM Plex Mono`, `JetBrains Mono`, monospace
* **Heading Font**: `Inter`, sans-serif
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

## 4. Systems Window & Glassmorphism UI

A core pillar of the v3 design system is the "Systems Window" aesthetic, which leverages glassmorphism to create a sense of depth, focus, and technical sophistication. 

### Implementation Standards
* **Background Blur**: `backdrop-filter: blur(12px)`
* **Surface Translucency**: `background: var(--xfact-glass-bg)` (Typically `rgba(255, 255, 255, 0.05)` in dark mode, adjusted for light mode).
* **Borders**: `1px solid var(--xfact-glass-border)`
* **Shadows**: `box-shadow: 0 8px 32px 0 var(--xfact-glass-shadow)`
* **Border Radius**: Defined globally via `var(--xfact-glass-radius)`.

### Usage Scenarios
* **Desktop Header Navigation**: The header floats above the page content. As the user scrolls, the hero gradient remains visible underneath the frosted glass header, creating a dynamic parallax effect.
* **Interactive Cards**: High-value cards (e.g., Case Studies) utilize the Systems Window aesthetic when hovering or when positioned over dynamic backgrounds.
* **Buttons in Dark Contexts**: Primary buttons *always* utilize glassmorphism when placed inside dark containers (`.xfact-dark-section`) or the header navigation, overriding standard primitive backgrounds to maintain the premium translucent aesthetic.
* **Mobile Overlays**: Dropdowns and mobile menus use solid, high-contrast dark sections (`var(--xfact-dark-section)`) to ensure legibility while matching the technical aesthetic.

---

## 5. Component Library

### Interactive Cards
Cards are the primary vehicle for modular content (Industries, Capabilities, Features).
* **Surface**: `var(--xfact-semantic-surface-alt)` transitioning to elevated states.
* **Border**: `1px solid var(--xfact-semantic-border)` outlining the perimeter.
* **Hover State**: Cards utilize a subtle drop shadow and shift the border color to `var(--xfact-semantic-primary)` to indicate interactivity.

### Call-to-Action Buttons
Buttons communicate action through high-contrast gradients and definitive boundaries.
* **Primary**: Linear gradient transitioning utilizing `var(--xfact-gradient-primary-1)`.
* **Hover**: Smooth transition to a darker/adjusted gradient with an expanded drop shadow.
* **Mobile Sync**: Mobile CTA buttons within the navigation mirror the exact "glass" token set used on desktop for perfect parity.

### Block Alignments
* **Case Study Grid**: Features grid-based alignment scaling from 1 column on mobile to 2/3 on desktop.
* **Logo Strip**: Continuous horizontal marquee. Images transition gracefully, minimizing visual noise while retaining brand identity.

---

## 6. Dark Mode Architecture

The theme ships with a native, zero-flicker dark mode integrated entirely via CSS variables.

### Implementation Strategy
Dark mode is initiated by the `[data-theme="dark"]` attribute on the root HTML element, triggered by either the user's OS preference (`prefers-color-scheme: dark`) or manual toggling via the `dark-mode.js` controller.

### Token Inversion
When activated, the system dynamically swaps the root semantic CSS variables:
* Backgrounds drop to deep navy variations.
* Borders become translucent whites, removing harsh delineations.
* Text colors invert seamlessly.
* The "Systems Window" glass variables increase opacity to stand out against the darker backgrounds.

These tokens are directly wired into WordPress's `theme.json` preset values, ensuring complete parity whether viewing the frontend or editing within the Gutenberg interface.
