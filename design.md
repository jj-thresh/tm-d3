# Threshold Media — Design System Reference

A practical reference for building **internal pages** consistent with the landing page.
Source of truth: [`index.html`](index.html), [`src/style.css`](src/style.css), [`src/main.js`](src/main.js),
and the Figma file `tm1` (current landing frame, node `12397-2598`):
<https://www.figma.com/design/xtJnySjbzffG92ehZdsfsx/tm1?node-id=12397-2598>

---

## 1. Foundations

### 1.1 Canvas & layout model
- **Desktop-only, fixed 1512px design.** No responsive reflow. Below 1512px the page
  scrolls horizontally (intentional).
- Every section is a **full-bleed band** that carries its own background, wrapping a
  **centered 1512px content column**. Never put a background straight on the content column.

```html
<section class="sec sec--NAME">
  <div class="in in--NAME"><!-- content + absolutely-positioned decorations --></div>
</section>
```

```css
.sec { width: 100%; min-width: 1512px; display: flex; justify-content: center; position: relative; }
.in  { width: 1512px; position: relative; }
```

- **Section horizontal padding:** `180px` (→ 1152px content width). Apply on `.in--NAME`.
- **Section vertical padding:** `100px` top; `100–130px` bottom.
- Decorations that bleed off-screen (images, arrows) are `position: absolute` relative to
  `.in`, with `overflow: hidden` on the `.sec`.
- Do **not** put `overflow-x: hidden` on `body` — it creates a second scroll container and
  breaks scroll positioning.

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
| `--divider` | `#dbdada` | Hairline dividers (currently unused) |
| Hover fill | `#e5e5e5` | List-row hover pill |

**Signature gradients**
- Blue band: `linear-gradient(180deg, var(--blue) 36.6%, var(--blue-cyan) 138%)`
- Orange band: `linear-gradient(180deg, var(--orange), var(--orange-b))`
- Black band: `#000` (e.g. video / statement sections)

### 1.3 Typography

Font stacks (defined as CSS variables):
```css
--font-display: 'widescreen', 'Archivo', system-ui, sans-serif;  /* Adobe Fonts / Typekit */
--font-body:    'Effra', 'Inter', system-ui, sans-serif;          /* Effra is licensed; Inter fallback */
--font-alt:     '42dot Sans', 'Inter', system-ui, sans-serif;     /* section subtitles */
```

- **Widescreen** (display) loads via Typekit in the `<head>`:
  `<link rel="stylesheet" href="https://use.typekit.net/bny5lnn.css">`.
  Available weights: **400** and **700** only. Use `700` for headings; anything heavier
  (800) maps to 700, `500` maps to 400.
- **Effra** (body) is a licensed font not in the repo — falls back to **Inter**. Drop the
  licensed webfonts into `/public/fonts` and uncomment the `@font-face` block in style.css
  to go pixel-exact.
- **Font Awesome 6 Free** (CDN) for icons.

**Type scale** (all display sizes use `--font-display`, weight 700, line-height 1.05 unless noted):

| Role | Size | Tracking | Notes |
|---|---|---|---|
| Hero H1 | 81px | −5.67px | |
| Section title (h2) | 76px | −3.8px | with chevron; `white-space: nowrap` |
| Statement title | 76px | −3.8px | e.g. black "30 years" band |
| List item title | 32px | −0.96px | line-height 1.2 |
| Card title | 27px | −1.08px | color `--orange-title` |
| Footer headline | 38px | −1.14px | weight **500** |
| Eyebrow | 25px | −1px | weight **500** |
| Nav link | 20px | −0.8px | weight **700** |
| Body copy | 20px | — | `--font-body`, line-height 1.5 |
| List item desc | 22px | −0.44px | color `--grey-desc` |
| Section subtitle | 20px | −0.4px | `--font-alt`, line-height 1.5 |

---

## 2. Components (reuse verbatim)

### 2.1 Fixed nav
- `position: fixed`, full-bleed, `backdrop-filter: blur(15px)`, padding `45px 10px 35px`.
- Inner rail width **1280px**, centered; logo left, links right.
- Logo: `/img/logo-header.svg` (228×77).
- Links: `--font-display` 700, 20px, gap 35px, color `#000`, hover `opacity: .6`.
- Current labels: **About · Services · Work · Insights · Connect** (unlinked placeholders).
- Because the nav is fixed, internal pages should add top padding equal to the nav height
  (~157px) or a scroll-margin so headings clear it.

### 2.2 Section header (chevron + title + subtitle)
```html
<div class="section-head [section-head--light]">
  <div class="section-head__row">
    <img class="chevron" src="/img/chevron-color.svg" alt="" data-reveal />
    <h2 class="h-display section-head__title" data-anim="words">Title</h2>
  </div>
  <p class="section-head__sub" data-reveal>Subtitle line.</p>
</div>
```
- Chevron 43×77. Use `chevron-color.svg` on light backgrounds, `chevron-white.svg` on
  dark/colored. Add `section-head--light` to turn title + subtitle white.

### 2.3 Buttons
- One shared shape: `padding: 17px 24px; border-radius: 1000px; font-size: 20px;`
  `--font-body` weight 500, white text.
- Variants: `.btn--blue` (blue gradient), `.btn--orange` (solid `--orange`).
- **Hover:** `transform: scale(1.1); filter: brightness(1.06);`

```html
<a class="btn btn--blue" href="#">Label</a>
<a class="btn btn--orange" href="#">Label</a>
```

### 2.4 Service card
- White, `border-radius: 32px`, padding `51px 32px 32px`, `gap: 16px`.
- Icon: Font Awesome, 36px, `--grey-icon`. Title: display 27px `--orange-title`. Body: 20px.

### 2.5 List row (Capabilities pattern)
- `[thumbnail 120×120 r24] [title 32px] + [desc 22px #666]`, gap 32px.
- No dividers. Rounded **#e5e5e5 hover pill** via `.cap__row::before` (opacity 0 → 1).
- `48px` gap between the section header and the list.

### 2.6 Footer
- `--blue` background, inner padding `80px 96px`, gap 90px.
- Top row: logo lockup (white chevron `chevron-white.svg` + white wordmark
  `logo-foot-word.svg`) left; "Let's connect." headline (38px) + social icons right.
- Legal row: address + policy links, Inter 16px, white.

---

## 3. Motion (GSAP + ScrollTrigger)

All animations live in `src/main.js`, initialised inside a
`prefers-reduced-motion` guard (skipped entirely if the user opts out — content stays
fully visible). Everything is opt-in via `data-` attributes.

| Attribute / target | Effect | Params |
|---|---|---|
| `[data-reveal]` | Fade-up on enter | `y: 32 → 0`, autoAlpha, 0.8s, power3.out, once |
| `[data-anim="words"]` | Per-word reveal (all section titles) | each word `y: -30 → 0`, opacity, stagger 0.08 |
| `.seat__cards .card` | Bloom from center | `scale: 0 → 1`; `transform-origin` = inner corner, **set in CSS** per nth-child (not in GSAP) |
| `.cap__list .cap__row` | Slide in from right | `x: 100 → 0`, autoAlpha, stagger 0.12 |
| `[data-anim="hand-rise"]` | Rises from below | `yPercent: 100 → 0`, autoAlpha, 1.2s |

**Conventions for internal pages**
- Wrap supporting text/blocks in `[data-reveal]` for a consistent fade-up.
- Give every section **title** `data-anim="words"` (and class `h-display`) for the word reveal.
- When animating `scale` from a corner, set `transform-origin` in CSS — GSAP resolves a
  tween-level `transformOrigin` to center on completion.
- Use `once: true`; never leave a trigger that can strand content at opacity 0.

---

## 4. Assets

- **Brand marks** (`/public/img/`, SVG): `logo-header.svg` (nav lockup),
  `chevron-color.svg` / `chevron-white.svg` (section chevrons), `arrow-big.svg` (CTA),
  `logo-foot-word.svg` (footer wordmark).
- **Photographs / video:** exported to **WebP**, sized ~2–3× display size, quality ~80
  (`cwebp -q 80 -resize <w> 0 in.png -o out.webp`). Keep alpha where needed (`hand`,
  `work-root`, `work-vhc`). This cut the landing images from ~84MB to ~0.5MB.
- Raw Figma export lives in `/public/assets` (git-ignored, not shipped).

---

## 5. Building a new internal page — checklist

1. Start from the `.sec` / `.in` band + column structure; reuse the fixed **nav** and
   **footer** markup verbatim (add top padding to clear the fixed nav).
2. Use the **color tokens** and **gradients** above; alternate white / blue / orange /
   black bands as the landing page does.
3. Headings: `class="h-display"` + `data-anim="words"`; supporting content: `data-reveal`.
4. Buttons and section headers: reuse the shared components — don't restyle.
5. Images → WebP at ~2–3× display size.
6. Preview locally with `npm run dev`; deploy with `npm run deploy`
   (publishes `dist/` to the `gh-pages` branch → <https://jj-thresh.github.io/tm-d3/>).

---

## 6. Known gaps / decisions
- **Effra** and heavier Widescreen weights aren't licensed here — body falls back to Inter;
  800 → 700.
- The orange "Capabilities (columns)" section (`.sec--caps2`) is kept in code but
  `display: none` (the light Capabilities list replaces it).
- The Lansdowne "Our Work" tile is a white placeholder (no clean logo asset yet).
- No CI: the `gh` token lacks `workflow` scope, so `.github/workflows` is kept local and
  deploys are manual via `npm run deploy`.
