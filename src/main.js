import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountChrome } from './chrome.js';

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   MOTION
   ---------------------------------------------------------
   Scroll-driven entrance animations. Everything is opt-in via
   data attributes in index.html, and set up inside a
   reduced-motion guard so nothing is hidden if the user (or JS)
   opts out — the page still renders fully and statically.
   ========================================================= */

// Every text block fades up into place as it enters the viewport.
function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true, // play once, then stays put
      },
    });
  });
}

// Word-by-word reveal: each word starts -30px up at 0 opacity and settles
// into place at 100% opacity, staggered left-to-right. Preserves <br> breaks.
function initWordReveals() {
  document.querySelectorAll('[data-anim="words"]').forEach((el) => {
    const frag = document.createDocumentFragment();
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (tok.trim() === '') {
            frag.appendChild(document.createTextNode(tok));
          } else {
            const w = document.createElement('span');
            w.className = 'word';
            w.textContent = tok;
            frag.appendChild(w);
          }
        });
      } else {
        frag.appendChild(node.cloneNode(true)); // keep <br> etc.
      }
    });
    el.replaceChildren(frag);

    gsap.from(el.querySelectorAll('.word'), {
      y: -30,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    });
  });
}

// "Seat at the table" cards: the 2x2 grid blooms out from the center.
// Each card collapses to the corner nearest the grid center (its anchor /
// transform-origin) and scales up outward from there, so all four unfold
// diagonally away from the middle. HTML order is:
//   0 Accountability (top-left)     -> anchor bottom-right
//   1 Clarity        (top-right)    -> anchor bottom-left
//   2 Responsiveness (bottom-left)  -> anchor top-right
//   3 Experience     (bottom-right) -> anchor top-left
function initSeatCards() {
  // transform-origin (the inner-corner anchor) is set per-card in CSS via
  // nth-child, so GSAP only needs to scale/fade each card around it.
  const cards = gsap.utils.toArray('.seat__cards .card');
  cards.forEach((card) => {
    gsap.from(card, {
      scale: 0,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.sec--seat',
        start: 'top 70%',
        once: true,
      },
    });
  });
}

// Capabilities list rows slide in from the right (100px offset), fading
// 0 -> 100% opacity, staggered top to bottom.
function initCapRows() {
  const rows = gsap.utils.toArray('.cap__list .cap__row');
  if (!rows.length) return;
  gsap.from(rows, {
    x: 100,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.cap__list',
      start: 'top 80%',
      once: true,
    },
  });
}

// "One call" hand/phone: rises up from out of frame (below) to its
// bottom-anchored resting spot, fading 0 -> 100% on the way in.
function initHandRise() {
  const hand = document.querySelector('[data-anim="hand-rise"]');
  if (!hand) return;
  gsap.from(hand, {
    yPercent: 100, // start fully below its resting position (out of frame)
    autoAlpha: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: hand.closest('.sec--onecall'),
      start: 'top 75%',
      once: true,
    },
  });
}

// Title chevrons slide in from the left: x -30 -> 0, opacity 0 -> 100%.
function initChevrons() {
  gsap.utils.toArray('[data-anim="chevron"]').forEach((el) => {
    gsap.from(el, {
      x: -30,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

/* =========================================================
   BACKGROUND LUMINANCE HELPERS
   Shared by NAV CONTRAST and NAV COLLAPSE below — both need to
   know whether a given section reads as "dark" (real WCAG
   contrast test: whichever of black/white text has the higher
   contrast ratio against the background wins).
   ========================================================= */
const chan = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = ([r, g, b]) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
const parseColors = (str) => {
  const out = [];
  const re = /rgba?\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(str))) {
    const p = m[1].split(',').map((s) => parseFloat(s));
    if (p.length >= 3 && (p[3] === undefined || p[3] > 0)) out.push(p);
  }
  return out;
};
// Effective background luminance of a section (solid colour, or the top
// stop of a gradient — which dominates where the nav sits).
const bgLuminance = (el) => {
  let node = el;
  while (node && node.nodeType === 1) {
    const cs = getComputedStyle(node);
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) {
      const cols = parseColors(cs.backgroundImage);
      if (cols.length) return luminance(cols[0]);
    }
    const solid = parseColors(cs.backgroundColor);
    if (solid.length) return luminance(solid[0]);
    node = node.parentElement;
  }
  return 1;
};
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const isDarkBg = (lum) => contrast(1, lum) > contrast(0, lum); // white beats black

/* =========================================================
   NAV CONTRAST (not motion — always on)
   Detects the background behind the fixed nav and flips the
   links (and logo) to white over dark sections, back to the
   dark treatment over light ones.
   ========================================================= */
function initNavContrast() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const logo = nav.querySelector('.nav__logo img');
  // Logo stays in colour on both; on dark sections only the "MEDIA" wordmark
  // flips to white (that variant), so it stays legible on dark.
  const LOGO_DARK = 'img/logo-header.svg'; // full colour, MEDIA orange (light bg)
  const LOGO_LIGHT = 'img/logo-header-media-white.svg'; // colour, MEDIA white (dark bg)

  const update = () => {
    const probeY = nav.getBoundingClientRect().bottom - 6;
    let target = null;
    document.querySelectorAll('.sec').forEach((s) => {
      if (target || getComputedStyle(s).display === 'none') return;
      const r = s.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) target = s;
    });
    const onDark = isDarkBg(target ? bgLuminance(target) : 1);
    nav.classList.toggle('nav--on-dark', onDark);
    if (logo) logo.src = onDark ? LOGO_LIGHT : LOGO_DARK;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* =========================================================
   NAV COLLAPSE (scroll-based, all screen sizes)
   The full link row is only shown while the nav sits over the
   hero. Once the page scrolls far enough that the nav reaches
   the first "dark" (blue) section — the same test used above —
   it condenses to the hamburger for the rest of the page, so it
   never overlaps busy section content. Scrolling back above that
   point restores the full nav. On top of this, small viewports
   always collapse regardless of scroll position.
   ========================================================= */
function initNavCollapse() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (!nav || !toggle) return;
  const smallScreen = window.matchMedia('(max-width: 1023px)');

  let thresholdY = Infinity;
  const measureThreshold = () => {
    const sections = [...document.querySelectorAll('.sec')].filter(
      (s) => getComputedStyle(s).display !== 'none'
    );
    const firstDark = sections.find((s) => isDarkBg(bgLuminance(s)));
    thresholdY = firstDark ? window.scrollY + firstDark.getBoundingClientRect().top : Infinity;
  };

  const update = () => {
    const navHeight = nav.getBoundingClientRect().height;
    const pastThreshold = window.scrollY >= thresholdY - navHeight + 6; // same probe line as contrast
    const collapsed = smallScreen.matches || pastThreshold;
    nav.classList.toggle('nav--collapsed', collapsed);
    if (!collapsed) {
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  measureThreshold();
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    measureThreshold();
    update();
  });
  // Fonts/images loading after first paint can shift section positions.
  window.addEventListener('load', () => {
    measureThreshold();
    update();
  });
}

// Mobile hamburger: toggles the nav links dropdown.
function initMobileNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!nav || !toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

function init() {
  window.ScrollTrigger = ScrollTrigger;
  mountChrome(); // inject shared nav + footer before anything queries them

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    initReveals();
    initWordReveals();
    initSeatCards();
    initCapRows();
    initChevrons();
    initHandRise();
  }

  initNavContrast(); // functional, runs regardless of reduced-motion
  initNavCollapse();
  initMobileNav();

  // Recompute scroll positions once fonts/images settle the layout height.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
