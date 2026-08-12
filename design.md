# Threshold Media — Design System Reference

A practical reference for building **internal pages** consistent with the landing page.
Source of truth: [`index.html`](index.html), [`src/style.css`](src/style.css), [`src/main.js`](src/main.js),
and the Figma file `tm1` (current landing frame, node `12397-2598`):
<https://www.figma.com/design/xtJnySjbzffG92ehZdsfsx/tm1?node-id=12397-2598>

> When you cite a Figma node in code or docs, make sure the coded page matches that
> node. If the design and code diverge, note it here under §8 (Known gaps).

---

## 1. Foundations

### 1.1 Canvas & layout model
The design is authored at **1512px** but is **responsive** across five breakpoints
(see §2). Every section is a **full-bleed band** carrying its own background, wrapping a
**centered content column** capped at 1512px. Never put a background straight on the column.

```html
<section class="sec sec--NAME">
  <div class="in in--NAME"><!-- content + absolutely-positioned decorations --></div>
</section>
```

```css
.sec { width: 100%; display: flex; justify-content: center; position: relative; }
.in  { width: 100%; max-width: var(--design-w); position: relative; } /* --design-w: 1512px */
body { overflow-x: clip; } /* backstop; no min-width — the layout reflows */
```

- **Section horizontal padding** is driven by `--pad-x` (see the breakpoint table). At
  desktop-large it's `180px`. Apply it on `.in--NAME` (e.g. `padding: 100px var(--pad-x)`).
- **Section vertical padding:** `100px` top; `100–130px` bottom (trimmed on mobile).
- Decorations that bleed off-screen (hand, arrow) are `position: absolute` relative to `.in`,
  with `overflow: hidden` on the `.sec`. Reflow or hide them on small screens.
- Do **not** put `overflow-x: hidden` on `body` — it makes `body` a second scroll container
  and breaks scroll positioning. Use `overflow-x: clip`.

### 1.2 Color tokens (`:root` in style.css)
| Token | Value | Use |
|---|---|---|
| `--blue` | `#0b519d` | Primary blue; blue section top, footer |
| `--blue-cyan` | `#379dcc` | Bottom of blue gradients |
| `--blue-btn-a` / `--blue-btn-b` | `#075486` / `#0c5983` | Blue button gradient |
| `--orange` | `#ff6201` | Primary orange; orange section top, orange button |
| `--orange-b` | `#ffba53` | Bottom of orange gradients |
| `--orange-title` | `#b54600` | Card titles on orange |
| `--ink` | `#000` | Body/heading text on light |
| `--grey-desc` | `#666` | Secondary/description text |
| `--grey-icon` | `#7d7c79` | Card icons |
| Hover fill | `#e5e5e5` | List-row hover pill |

**Signature bands**
- Hero / CTA / statement backgrounds: **plain `#fff`** (the hero has no gradient/wash).
- Blue band: `linear-gradient(180deg, var(--blue) 36.6%, var(--blue-cyan) 138%)`
- Orange band: `linear-gradient(180deg, var(--orange), var(--orange-b))`

### 1.3 Typography

Two font roles (CSS variables):
```css
--font-display: 'widescreen', 'Archivo', system-ui, sans-serif;  /* Adobe Fonts / Typekit */
--font-body:    'Effra', 'Inter', system-ui, sans-serif;          /* Effra licensed; Inter fallback */
```
There is **no `--font-alt`** — all non-display text (subheads, footer, body) uses `--font-body`.

- **Widescreen** (display) loads via Typekit in `<head>`:
  `<link rel="stylesheet" href="https://use.typekit.net/bny5lnn.css">`. Family name is
  `"widescreen"` (lowercase). Available weights: **400 & 700 only** (800→700, 500→400).
- **Effra** (body) is licensed and not in the repo → falls back to **Inter**. Drop the
  webfonts into `/public/fonts` and uncomment the `@font-face` block in style.css to go exact.
- **Font Awesome 6 Free** (CDN) for icons.

**Type scale** — desktop-large sizes (display = `--font-display` 700, line-height 1.05).
The big headings scale down per breakpoint (see §2).

| Role | Desktop size | Tracking | Notes |
|---|---|---|---|
| Hero H1 | 81px | −5.67px | `.hero__title` |
| Section / statement title | 76px | −3.8px | with chevron; `white-space: nowrap` |
| List item title | 32px | −0.96px | line-height 1.2 (hidden list section) |
| Card title | 27px | −1.08px | color `--orange-title` |
| Capabilities column title | 28px | −0.84px | |
| Footer headline | 38px | −1.14px | weight 500 |
| Eyebrow | 25px | −1px | weight 500 |
| Nav link | 20px | −0.8px | weight 700 |
| Body copy | 20px | — | `--font-body`, line-height 1.5 |
| Section subtitle | 20px | −0.4px | `--font-body` |

---

## 2. Responsive system

Desktop-first; each smaller breakpoint layers overrides. `--pad-x` and the big-heading
sizes step down; multi-column sections reflow. The block lives at the **bottom of
style.css** under "RESPONSIVE BREAKPOINTS".

| Breakpoint | Range | `--pad-x` | Hero / big heading | Key reflows |
|---|---|---|---|---|
| **Desktop large** | ≥ 1512 | 180px | 81 / 76 | native design (unchanged) |
| **Desktop medium** | 1280–1511 | 100px | 72 / 66 | type scales; overlap layouts intact |
| **Desktop small** | 1024–1279 | 72px | 60 / 54 | **one-call stacks** (hand on top); CTA arrow shrinks |
| **Tablet** | 768–1023 | 48px | 46 / 42 | **hamburger nav**; seat & footer stack; columns wrap; CTA arrow hidden |
| **Mobile** | ≤ 767 | 20px | 34 / 30 | everything single-column; **Our Work → 2-col squares**; trimmed padding |

Reflow patterns to reuse:
- **Fluid grid:** give a fixed grid `width: 100%; max-width: Npx; aspect-ratio: W/H` (instead
  of a fixed height) so it scales; drop to fewer columns + `aspect-ratio: 1` tiles on mobile
  (reset explicit `grid-column/row` with `auto !important`).
- **Fixed-width content** (`width: Npx`) → override to `width: auto; max-width: …` at small
  breakpoints.
- **Absolute decorations** → make `position: relative` and in-flow, or `display: none`.

---

## 3. Components (reuse verbatim)

### 3.1 Fixed nav (with auto-contrast + mobile hamburger)
- `position: fixed`, full-bleed, `backdrop-filter: blur(15px)`, padding `45px 10px 35px`.
- Inner rail `width: 100%; max-width: 1280px`; logo left, links right.
- Logo: `/img/logo-header.svg` (247×76, colour). Links: `--font-display` 700, 20px, gap 35px.
- Labels: **About · Services · Work · Insights · Connect** (unlinked placeholders).
- **Auto-contrast** (`initNavContrast`, runs regardless of reduced-motion): on scroll it
  probes the section behind the nav, computes black-vs-white contrast, and toggles
  `.nav--on-dark` → **white links**, and swaps the logo to `/img/logo-header-media-white.svg`
  (colour logo but the "MEDIA" wordmark turns white). Over light/orange it stays dark + the
  colour logo.
- **Mobile hamburger** (≤1023, `initMobileNav`): `.nav__toggle` shows; tapping toggles
  `.nav--open`, which drops the links down as a white panel with dark text.
- Because the nav is fixed, internal pages need top padding (~157px) or `scroll-margin` so
  headings clear it.

### 3.2 Section header (chevron + title + subtitle)
```html
<div class="section-head [section-head--light]">
  <div class="section-head__row">
    <img class="chevron" src="/img/chevron-white.svg" alt="" data-anim="chevron" />
    <h2 class="h-display section-head__title" data-anim="words">Title</h2>
  </div>
  <p class="section-head__sub" data-reveal>Subtitle line.</p>
</div>
```
- Chevron is the v2 3-segment mark (`height: 77px; width: auto`). Use `chevron-white.svg` on
  dark/colored bands (add `section-head--light` for white text); `chevron-color.svg` on light.
- The chevron animates in with `data-anim="chevron"` (x −30 → 0, fade).

### 3.3 Buttons
- One shared shape: `padding: 17px 24px; border-radius: 1000px; font-size: 20px;`
  `--font-body` weight 500, white text. **Hover:** `transform: scale(1.1); filter: brightness(1.06);`
- Variants: `.btn--blue` (blue gradient), `.btn--orange` (solid `--orange`).

### 3.4 Service card
- White, `border-radius: 32px`, padding `51px 32px 32px`, `gap: 16px`.
- Icon: Font Awesome 36px `--grey-icon`; title: display 27px `--orange-title`; body: 20px.

### 3.5 Footer
- `--blue` background, inner padding `100px 90px`.
- **Layout:** logo (`/img/logo-footer-white.svg`, all-white, `height: 84px` = 150%) far-left;
  a right-aligned block `.footer__right` (`width: 712px; margin-left: auto`) holding:
  - `.footer__connect` — "Let's connect." headline (38px) + social icons, `space-between`.
  - `.footer__bottom` — services list | address (with `www…`) | Privacy/Terms, `space-between`.
- "Let's connect" left-aligns with the services column. On tablet/mobile the whole footer
  stacks (logo → connect → columns).

---

## 4. Motion (GSAP + ScrollTrigger)

Entrance animations are in `src/main.js` inside a `prefers-reduced-motion` guard (skipped if
the user opts out — content stays visible). Opt-in via `data-` attributes.

| Attribute / target | Effect | Params |
|---|---|---|
| `[data-reveal]` | Fade-up on enter | `y: 32 → 0`, autoAlpha, 0.8s, once |
| `[data-anim="words"]` | Per-word reveal (all section titles) | word `y: -30 → 0`, stagger 0.08 |
| `[data-anim="chevron"]` | Title chevron slides in | `x: -30 → 0`, autoAlpha |
| `.seat__cards .card` | Bloom from center | `scale: 0 → 1`; `transform-origin` = inner corner **set in CSS** per nth-child (NOT in GSAP) |
| `.cap__list .cap__row` | Slide in from right | `x: 100 → 0`, stagger 0.12 (hidden list section) |
| `[data-anim="hand-rise"]` | Rises from below | `yPercent: 100 → 0`, 1.2s |

`initNavContrast` and `initMobileNav` run **outside** the reduced-motion guard (they're
functional, not decorative).

**Conventions:** give every section title `data-anim="words"` + `h-display`; wrap supporting
text in `[data-reveal]`; use `once: true`; when scaling from a corner set `transform-origin`
in CSS (GSAP resolves a tween-level `transformOrigin` to center on completion).

---

## 5. Page anatomy (current landing page)

Top → bottom, matching Figma v2. Two sections are intentionally hidden (kept in code):

1. **Hero** — eyebrow, `hero__title`, subtitle, orange CTA ("See what real partnership looks like →").
2. **One call** — title, body, blue button ("Partner With Us"), bottom-anchored hand (`data-anim="hand-rise"`).
3. **Seat at the table** — title + four service cards (bloom animation).
4. *Video "Over 30 years"* — **`display: none`** (not in v2; kept in code).
5. *Capabilities list* — **`display: none`** (replaced by the columns version below).
6. **Our Work** — bento grid; top-right tile is an autoplaying muted `<video>` (Kim Brattain).
7. **Capabilities (columns)** — orange band, 5 columns, no team photo (this is the visible one).
8. **Want growth (CTA)** — title, body, orange button, big two-tone arrow graphic (right).
9. **Footer**.

---

## 6. Assets (`/public/img/`)
- **Logos:** `logo-header.svg` (nav, colour, MEDIA orange), `logo-header-media-white.svg`
  (nav on dark — colour but MEDIA white), `logo-footer-white.svg` (footer, all white).
  `logo-foot-word.svg` / `logo-foot-mark.svg` are legacy and no longer referenced.
- **Chevrons:** `chevron-white.svg` (v2 3-segment, used on visible sections),
  `chevron-color.svg` (older, used only by the hidden list section).
- **Arrow:** `arrow-big.svg` — a **hand-authored** 2-path two-tone chevron (orange top /
  blue bottom). The Figma export rendered wrong (overlapping shapes), so it's authored.
- **Photos / video:** WebP, ~2–3× display size, quality ~80
  (`cwebp -q 80 -resize <w> 0 in.png -o out.webp`). Keep alpha for `hero-hand`, `work-root`,
  `work-vhc`. This cut landing images from ~84MB → ~0.5MB. Video: `/public/video/kbedit2.mp4`.
- Raw Figma export lives in `/public/assets` (git-ignored, not shipped).

---

## 7. Building a new internal page — checklist
1. Start from the `.sec` / `.in` band + column structure; reuse the **nav** and **footer**
   markup verbatim (add top padding to clear the fixed nav).
2. Use the **color tokens** / bands; alternate white / blue / orange as the landing page does.
3. Headings: `class="h-display"` + `data-anim="words"`; chevrons `data-anim="chevron"`;
   supporting content `data-reveal`. Reuse buttons and section headers unchanged.
4. Drive horizontal padding from `var(--pad-x)`; add the same breakpoint reflows (stack
   multi-column sections, make fixed grids fluid via `aspect-ratio`, hide/relayout absolute
   decorations). Verify **no horizontal overflow** at every breakpoint.
5. Images → WebP at ~2–3× display size.
6. Preview: `npm run dev` (http://localhost:5173). Deploy: `npm run deploy`.

---

## 8. Known gaps / decisions
- **Effra** and heavier Widescreen weights aren't licensed here — body falls back to Inter; 800→700.
- **Capabilities:** the orange **columns** version (`.sec--caps2`) is shown; the light **list**
  (`.sec--cap`) and the **"Over 30 years" video** (`.sec--video`) are `display: none` (kept in code).
- **Nav "MEDIA" on orange:** the contrast rule only whitens "MEDIA" on *dark* (blue) bands, so
  on *orange* bands the orange "MEDIA" is low-contrast. Extend the rule if that's unwanted.
- The **Lansdowne** "Our Work" tile is a white placeholder (no clean logo asset yet).
- **No CI:** the `gh` token lacks `workflow` scope, so `.github/workflows` is kept local and
  deploys are manual via `npm run deploy` (source → `main`, built `dist/` → `gh-pages` →
  <https://jj-thresh.github.io/tm-d3/>).
