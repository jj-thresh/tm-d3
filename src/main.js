import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

function init() {
  window.ScrollTrigger = ScrollTrigger;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    initReveals();
    initWordReveals();
    initSeatCards();
    initCapRows();
    initHandRise();
  }

  // Recompute scroll positions once fonts/images settle the layout height.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
