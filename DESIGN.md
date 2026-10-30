---
name: MonkeyProof
description: A technical blog that shares the visual world of DaveOS 2 "Aurora Glass" (davidemaggi.dev), built for reading.
colors:
  wallpaper-base: "#06070d"
  aurora-violet: "#6d4aff"
  aurora-cyan: "#00c2ff"
  aurora-pink: "#ff3d9a"
  aurora-teal: "#12d6a6"
  accent: "#8b7bff"
  accent-2: "#3ee6ff"
  accent-text: "#a99dff"
  link: "#8ef1ff"
  window-bg: "#0c0e17"
  window-text: "#e6e8f2"
  surface-2: "#121522"
  surface-3: "#1b1f30"
  line: "#262b3f"
  muted: "#9aa1b9"
  prose: "#c9cede"
  prose-strong: "#f3f4fa"
  code-bg: "#0a0c14"
  ground-text: "#f5f6fb"
  light-accent: "#6a52ff"
  light-accent-2: "#0891b2"
  light-window-bg: "#fbfbfe"
  light-window-text: "#141724"
  light-surface-2: "#f2f3f9"
  light-line: "#d8dbe8"
  light-muted: "#565c72"
  darkside-accent: "#ef4444"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 8rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 5.2vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Sriracha, cursive"
    fontSize: "16px"
    fontWeight: 400
  hand:
    fontFamily: "Sriracha, cursive"
    fontSize: "1.06em"
    fontWeight: 400
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.86rem"
    lineHeight: 1.7
rounded:
  menu-item: "6px"
  chip: "999px"
  control: "16px"
  action: "999px"
  panel: "26px"
  popover: "22px"
  widget: "26px"
spacing:
  menubar: "32px"
  gutter: "clamp(0.75rem, 3vw, 2rem)"
  content-max: "1180px"
  measure: "68ch"
components:
  action-primary:
    backgroundColor: "linear-gradient(120deg, {colors.accent}, {colors.accent-2})"
    textColor: "#ffffff"
    rounded: "{rounded.action}"
    height: "44px"
  panel:
    backgroundColor: "{colors.window-bg}"
    textColor: "{colors.window-text}"
    rounded: "{rounded.panel}"
  tag:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
  code-block:
    backgroundColor: "{colors.code-bg}"
    rounded: "{rounded.control}"
---

# Design System: MonkeyProof

## Overview

**Creative North Star: "Same world as DaveOS, built for reading"**

MonkeyProof shares the visual world of DaveOS 2 "Aurora Glass", the desktop-in-the-browser at davidemaggi.dev: same wallpaper and presets, glass menu bar, palette, type, and light/dark themes, so moving between the two sites feels seamless. It is **not** an app inside DaveOS: no window chrome, traffic lights, or fake file paths. Pages are ordinary, reading-first web pages that happen to live on the same ground. Theme and wallpaper travel with the visitor via `?theme=&wallpaper=`.

The voice is playful, never corporate: a handwritten Sriracha layer (labels, captions, emphasis, asides, sign-off), the Monkey🍌Proof wordmark with a banana that wiggles on hover, soft pill-shaped controls with a springy hover, banana section breaks, and jokey microcopy. Technical content stays accurate; the jokes live around it.

The world owns the frame; the reading column stays calm. Expressive material (drifting aurora blobs, stars, glass, outlined display type) lives in the hero, menu bar, and widgets. Article text sits on a solid panel at a 68ch measure with real contrast.

**Key Characteristics:**
- Near-black wallpaper with drifting violet/cyan/pink/teal radial blobs, stars, masked grid, grain, vignette.
- Glass only for chrome that floats on the wallpaper (menu bar, widgets, popovers, footer dock). Reading surfaces are solid panels.
- One accent gradient (violet → cyan), used for the primary action, reading progress, and list markers.
- Mono only for code, keyboard keys, and the `~/go-bananas $` prompt. Dates are human ("12 Apr 2026").
- Handwritten Sriracha for labels and asides instead of tracked caps; `<em>` and `.spicy` render in it inside articles.

## Colors

Wallpaper-driven ground, solid neutral panels, one gradient accent.

- Wallpaper tokens (`--wp-*`) come from the active preset: aurora (default), darkside, graphite, cobalt, ember, prism, pearl. Dark Side also takes over the accent (red/orange), exactly as in DaveOS.
- `--ground-text` is the color of anything drawn directly on the wallpaper; it follows the wallpaper (light on dark presets, ink on Pearl), not the theme.
- Theme tokens (`--window-*`, `--surface-*`, `--prose*`, `--muted`, `--line`) follow light/dark.
- Links in prose use `--link` (cyan family) with a 40% underline; accent text uses `--accent-text`, a lighter accent tuned for ≥4.5:1 on the window.

## Typography

Space Grotesk for display and headings (tight tracking, -0.025 to -0.045em), Inter for body and UI, Sriracha (handwritten, from the original MonkeyProof theme) for labels, captions, emphasis, and jokes, JetBrains Mono for code. Self-hosted from Fontsource via Astro's font API. Home hero repeats DaveOS's signature: solid word on line one, outlined word on line two.

## Layout

- Fixed 32px menu bar; content max 1180px plus fluid gutters.
- Each route is one solid panel on the wallpaper with a plain header (title + lede). Listings are rows inside the panel, separated by hairlines, not cards.
- Articles: header (tags, title, lede, byline), wide cover, then a 68ch column with a sticky 220px "On this page" rail at ≥1100px; below that the contents collapse above the article.
- Focus mode hides the rail, centres a 72ch column, and dims the wallpaper.

## Elevation & Depth

Two layers only. Panels lift off the wallpaper with a deep soft shadow plus a faint accent ring (the same material as DaveOS windows, without their chrome). Glass chrome uses an inset top highlight and a soft drop shadow. Nothing inside a panel is elevated except code blocks (soft shadow) and hover lift (-2px) on controls.

## Shapes

Soft and friendly: pill buttons, tags, and share icons; 16px code blocks and images; 22px popovers; 26px panels and widgets. List rows are separated by dashed rules; prose section breaks are a banana between two lines. Hover motion is springy (small lift and a few degrees of tilt).

## Components

- **Menu bar:** DaveOS mark (link back to DaveOS with theme hand-off), bold blog name, navigation, then lofi, Search (⌘K), control center, clock. Denser background once content scrolls beneath.
- **Panel:** solid surface for each page; optional footer strip (counts, pagination). Articles get a "← All posts" link above the panel and a 2px gradient reading-progress line under the menu bar.
- **Control center:** theme segmented control, seven wallpaper swatches, focus-mode switch.
- **Search:** modal dialog over a blurred page, Pagefind results with highlighted excerpts, arrow-key navigation.
- **Code block:** Shiki output with a header strip (file name or language, Copy).
- **Footer dock:** DaveOS link, socials, RSS.

## Do's and Don'ts

- Do keep tokens in sync with `~/Repos/davidemaggi.dev/src/App.css` when DaveOS changes.
- Do put new pages on a `Panel` with a plain heading.
- Don't add window chrome (title bars, traffic lights, `~/paths`) — the blog shares DaveOS's look, it does not live inside it.
- Do keep the reading column solid, calm, and at measure.
- Don't put glass, blobs, or gradients behind body text.
- Don't use cards as page structure; use rows inside the window.
- Don't use mono for prose or headings.
- Don't add eyebrow labels above headings (the hero prompt line is the one DaveOS signature).
- Do keep the microcopy playful ("Fresh from the monkey cage", "Back to the pile"); don't let UI copy turn corporate.
- Don't use uppercase tracked mono labels; use the handwritten label style.
