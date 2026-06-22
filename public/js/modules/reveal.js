/**
 * reveal.js
 * Two reveal paths sharing one staggering rule:
 *
 *  1. Hero (#hero) is above the fold, so its [data-reveal] / [data-hero-line]
 *     elements fire on page load, not on scroll.
 *  2. Everything else fires once via IntersectionObserver as it enters the
 *     viewport (one-shot — elements are unobserved after their first reveal).
 *
 * Stagger: each element's delay is based on its DOM index among the
 * siblings that share its parent (text-mask lines wrapped in .reveal-mask
 * are special-cased so the two stacked headline lines stagger against each
 * other, not against their own single child).
 */

const STEP_MS = 90;
const MAX_STEPS = 8;

function staggerParent(el) {
  const parent = el.parentElement;
  if (parent && parent.classList.contains("reveal-mask")) {
    return parent.parentElement;
  }
  return parent;
}

function staggerSelf(el) {
  const parent = el.parentElement;
  if (parent && parent.classList.contains("reveal-mask")) {
    return parent;
  }
  return el;
}

function assignDelay(el) {
  if (el.dataset.revealStaggered) return;
  const parent = staggerParent(el);
  const self = staggerSelf(el);
  let index = 0;
  if (parent) {
    index = Array.prototype.indexOf.call(parent.children, self);
    if (index < 0) index = 0;
  }
  index = Math.min(index, MAX_STEPS);
  el.style.setProperty("--reveal-delay", `${index * STEP_MS}ms`);
  el.dataset.revealStaggered = "true";
}

function fire(el) {
  assignDelay(el);
  el.classList.add("is-visible");
}

function revealHeroOnLoad() {
  const els = document.querySelectorAll(
    "#hero [data-reveal], #hero [data-hero-line]"
  );
  if (!els.length) return;

  // Double rAF: let the browser paint the initial (hidden) state first so
  // the transition actually has somewhere to animate from.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      els.forEach(fire);
    });
  });
}

function initScrollReveal() {
  const candidates = document.querySelectorAll(
    "[data-reveal], [data-hero-line]"
  );
  const targets = Array.prototype.filter.call(
    candidates,
    (el) => !el.closest("#hero")
  );

  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(fire);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fire(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

export function initReveal() {
  revealHeroOnLoad();
  initScrollReveal();
}
