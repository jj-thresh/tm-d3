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

### 3.1 Fixed nav (shared across all pages, with auto-contrast + mobile hamburger)
- `position: fixed`, full-bleed, padding `45px 10px 35px`. **No blur/glass effect** (removed
  by request — was `backdrop-filter: blur(15px)`, now plain transparent).
- Inner rail `width: 100%; max-width: 1280px`; logo left, links right.
- Logo: `/img/logo-header.svg` (247×76, colour). Links: `--font-display` 700, 20px, gap 35px.
- Labels/hrefs: **About → about.html · Capabilities → capabilities.html · Work → work.html ·
  Insights → insights.html · Connect → connect.html** (matches the nav row shown in the
  interior-pages source PDF; supersedes an earlier ad-hoc "Services" label).
- **Active-page indicator:** `chrome.js` (`mountChrome`) compares `location.pathname` to each
  link's `href` and adds `.is-active`, which draws a `currentColor` underline (`::after`).
- **Auto-contrast** (`initNavContrast`, runs regardless of reduced-motion): on scroll it
  probes the section behind the nav, computes black-vs-white contrast, and toggles
  `.nav--on-dark` → **white links**, and swaps the logo to `/img/logo-header-media-white.svg`
  (colour logo but the "MEDIA" wordmark turns white). Over light/orange it stays dark + the
  colour logo.
- **Mobile hamburger** (≤1023, `initMobileNav`): `.nav__toggle` shows; tapping toggles
  `.nav--open`, which drops the links down as a white panel with dark text.
- Because the nav is fixed, internal pages need top padding (~157px) or `scroll-margin` so
  headings clear it. `.sec` already carries `scroll-margin-top: 140px` for in-page anchors.
- **Shared markup, not copy-pasted per page:** the nav (and footer) HTML lives once in
  `src/chrome.js` as template strings, injected by `mountChrome()` into every page's
  `<div data-chrome="nav">` / `<div data-chrome="footer">` placeholders. Edit chrome.js, not
  the per-page HTML, to change nav/footer content. Asset paths inside chrome.js are
  **relative** (`img/…`, not `/img/…`) since injected HTML isn't processed by Vite's base-path
  rewriting — this matters if you add more pages.
- **Link colour safety:** the global reset includes `a:visited { color: inherit; }` — without
  it, browsers apply a default visited-link colour (visible as a wrong hue) to any custom link
  class that doesn't explicitly set `:visited`. `.text-link` and friends rely on this reset.

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

### 3.6 Interior-page components (About/Capabilities/Work/Insights/Connect)
Built for the content pages; reuse these rather than inventing new patterns.

**Page intro (kicker + H1 + subhead + body + optional link)** — used at the top of every
interior page:
```html
<section class="sec sec--intro">
  <div class="in in--intro">
    <p class="intro__kicker" data-reveal>Section Name</p>
    <h1 class="h-display intro__title" data-anim="words">Headline.</h1>
    <p class="intro__subhead" data-reveal>Supporting subhead.</p>
    <p class="intro__body" data-reveal>Paragraph copy.</p>
    <a class="text-link" href="#anchor-or-page.html" data-reveal>Link label <i class="fa-solid fa-arrow-right"></i></a>
  </div>
</section>
```
- `.intro__title` is wired into the same responsive font-size list as `.section-head__title`
  etc., so it scales at every breakpoint automatically.
- `.intro__kicker` = orange, uppercase, 14px, tracked. `.intro__subhead` = display font 500,
  32px, `var(--blue)`. `.intro__body` = body font, 20px.
- **Light modifiers** for use on dark/coloured backgrounds: `.intro__title--light`,
  `.intro__subhead--light`, `.intro__body--light` (just flip `color` to `#fff`).
- The same title/subhead/body stack, without the page-hero padding, can be dropped into any
  band via a `.team__intro` wrapper (`display:flex; column; gap:20px; max-width:820px`) inside
  a `.content-band` — used for lighter mid-page or closing statements (see Work/Insights below).

**Text link** (inline CTA used throughout the interior-page copy, e.g. "Learn more →"):
```html
<a class="text-link" href="…">Label <i class="fa-solid fa-arrow-right"></i></a>
```
`--font-body` 700, `var(--blue)` (or `.text-link--on-dark` / `--on-orange` for white on
colour), arrow nudges right on hover. Point it at an on-page `#anchor` when the very next
section covers that topic, or at another page when it's a "next step" CTA.

**Band background utilities** — put a landing-page gradient on ANY section without coupling
to a homepage-specific class name:
```css
.bg-blue   { background: linear-gradient(180deg, var(--blue) 36.6%, var(--blue-cyan) 138%); }
.bg-orange { background: linear-gradient(180deg, var(--orange), var(--orange-b)); }
```
Pair with `.content-band` on the `.in` (padding `100px var(--pad-x) 130px`, flex column, gap
56px) instead of a page-specific `.in--NAME`.

**Cards grid** — N cards in an even row under a `.section-head` (as opposed to `.seat__cards`,
which sits beside its title): `.cards-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }`,
containing plain `.card` elements (`.cards-grid .card` resets the card's fixed width to
`100%`). Responsive: 2 cols ≤1279, 1 col ≤767. Use `.section-head__title--wrap` on the
heading if it's a full sentence rather than a 1–2 word label — the base `.section-head__title`
is `white-space: nowrap`, which overflows long headings.

**Role/topic grid** — icon-in-circle + label tiles (e.g. "Meet the team" roles):
```html
<div class="roles__grid">
  <div class="role"><span class="role__icon"><i class="fa-solid fa-…"></i></span><h3 class="role__label">Label</h3></div>
  …
</div>
```
6 cols desktop → 3 (≤1279) → 2 (≤767). White circle badge, orange icon, white label text (bg
is always a coloured band here).

**Contact CTAs** (Connect page): `.contact-actions` (flex row, `gap:16px`) wrapping `.btn`
elements with `tel:`/`mailto:` hrefs; `.contact-address` for the plain-text address below.
No submission form is built — see §8.

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

## 5. Page anatomy

### 5.1 Landing page (`index.html`)
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

### 5.2 Interior pages
Content sourced from the "Threshold website interior pages" PDF. Each page: intro (white) →
1–2 content bands → closing CTA → shared footer.

| Page | Intro | Content band(s) | Closing |
|---|---|---|---|
| **about.html** | "Partnership in practice." | Orange `.cards-grid` (4 "when…" cards) → Blue `.roles__grid` (6 roles, "Hi there! / Meet the team.") | Big `.sec--grow` quote CTA → capabilities.html |
| **capabilities.html** | "Everything under one very capable roof." | White `.cap__list` (5 rows, reuses the homepage's *hidden* list component — see below) | Big `.sec--grow` CTA "More show. Less tell." → work.html |
| **work.html** | "The proof's in the portfolio." | Blue `.work__grid` (reuses homepage's Our Work grid verbatim) | Light `.team__intro` statement + `.text-link` → connect.html |
| **insights.html** | "We've learned a thing or two." | Blue `.work__grid` — **placeholder**, see §8 | Light `.team__intro` statement + `.text-link` → connect.html |
| **connect.html** | "Finding the right partner is everything." | — | `.contact-actions` (Email/Call buttons) + address, no form (see §8) |

Note: `capabilities.html` reuses `.in--cap`/`.cap__*` (the list markup), which is safe because
only the `.sec--cap` *wrapper* is `display:none` on the homepage — the component classes
themselves carry no hidden state. The new page wraps them in `.sec--capabilities-list`
(background only) instead.

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
1. Copy an existing interior page (e.g. `about.html`) as a starting point — it already has the
   right `<head>` (Typekit/Inter/Font Awesome/style.css links), `<div data-chrome="nav">` /
   `<div data-chrome="footer">` placeholders, and `<script type="module" src="/src/main.js">`.
   **Do not** hand-write the nav/footer markup — it's shared via `src/chrome.js`.
2. Register the new file in `vite.config.js` → `build.rollupOptions.input` (Vite's multi-page
   build won't include a page it doesn't know about) and add its href/label to the nav list
   in `src/chrome.js`.
3. Use **§3.6 interior-page components** (intro stack, text-link, cards-grid, roles grid,
   `.bg-blue`/`.bg-orange` + `.content-band`) rather than inventing new ones. Fall back to the
   landing-page components (§3.2–3.5) where they fit directly (e.g. `.work__grid`, `.cap__list`).
4. Headings: `class="h-display"` + `data-anim="words"`; chevrons `data-anim="chevron"`;
   supporting content `data-reveal`.
5. Drive horizontal padding from `var(--pad-x)`; the interior components already have
   responsive rules in the breakpoint blocks — extend them the same way if you add new ones.
   Verify **no horizontal overflow** at every breakpoint.
6. Images → WebP at ~2–3× display size.
7. Preview: `npm run dev` (http://localhost:5173) or build + `npx vite preview` (closer to
   production — the dev server's SPA history can occasionally misbehave mid-session; a hard
   `npm run build && npx vite preview` is the more reliable way to sanity-check a new page).
   Deploy: `npm run deploy`.

---

## 8. Known gaps / decisions
- **Effra** and heavier Widescreen weights aren't licensed here — body falls back to Inter; 800→700.
- **Capabilities (homepage):** the orange **columns** version (`.sec--caps2`) is shown; the
  light **list** (`.sec--cap`) and the **"Over 30 years" video** (`.sec--video`) are
  `display: none` (kept in code). The interior `capabilities.html` page reuses the list's
  underlying classes directly (see §5.2) — that page is unaffected by `.sec--cap`'s hidden state.
- **Nav "MEDIA" on orange:** the contrast rule only whitens "MEDIA" on *dark* (blue) bands, so
  on *orange* bands the orange "MEDIA" is low-contrast. Extend the rule if that's unwanted.
- The **Lansdowne** "Our Work" tile is a white placeholder (no clean logo asset yet).
- **Insights page grid is a placeholder.** The source content marks this spot as
  `[work examples]` with no specific articles supplied — it currently reuses the *same* work
  portfolio grid as `work.html` (real projects, not fabricated posts) purely as a stand-in.
  Swap in a real article/post grid once Insights content exists.
- **Connect page has no submission form.** This is a static site with no backend, so a form
  that appeared to "submit" would silently go nowhere — that's a deceptive pattern, so it
  wasn't built. Instead the page has direct, functional `tel:`/`mailto:` CTAs using the real
  phone/email already in the footer. If a working form is wanted, it needs a form-handling
  service (e.g. Formspree, Netlify Forms) or a real backend endpoint — flag which one and it
  can be wired in.
- **No CI:** the `gh` token lacks `workflow` scope, so `.github/workflows` is kept local and
  deploys are manual via `npm run deploy` (source → `main`, built `dist/` → `gh-pages` →
  <https://jj-thresh.github.io/tm-d3/>).
- **Multi-page build:** `vite.config.js` sets `appType: 'mpa'` (no SPA fallback — a
  not-yet-built page correctly 404s instead of silently serving the homepage) and lists every
  page under `build.rollupOptions.input`. New pages must be added to both that list and the
  nav in `src/chrome.js`, or they won't be built / won't be linked.
