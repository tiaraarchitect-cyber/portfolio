/**
 * smoothScroll.js
 * A small, dependency-free "fake scroll" engine:
 *  - #scroll-spacer sits in normal document flow and is sized to match the
 *    real content height, so the browser still owns a native, accessible
 *    scrollbar and dispatches real scroll/wheel/keyboard events.
 *  - #smooth-content is fixed to the viewport and is translated via
 *    requestAnimationFrame, lerping toward window.scrollY each frame.
 *
 * Disabled automatically for touch/coarse pointers and prefers-reduced-motion,
 * where the page just scrolls natively (see the CSS fallback rules).
 */

const LERP = 0.085;
const STOP_THRESHOLD = 0.05;

let content;
let spacer;
let current = 0;
let target = 0;
let rafId = null;
let active = false;

function shouldEnable() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduced;
}

function updateSpacerHeight() {
  if (!content || !spacer) return;
  spacer.style.height = `${content.scrollHeight}px`;
}

function tick() {
  target = window.scrollY;
  current += (target - current) * LERP;

  if (Math.abs(target - current) < STOP_THRESHOLD) {
    current = target;
  }

  content.style.transform = `translate3d(0, ${-current}px, 0)`;
  rafId = requestAnimationFrame(tick);
}

export function scrollToTarget(y, { offset = 0 } = {}) {
  const dest = Math.max(0, y - offset);
  if (active) {
    // Instant native scrollY change — the RAF loop above supplies the easing.
    window.scrollTo(0, dest);
  } else {
    window.scrollTo({ top: dest, behavior: "smooth" });
  }
}

export function isSmoothScrollActive() {
  return active;
}

export function refresh() {
  updateSpacerHeight();
}

export function initSmoothScroll() {
  content = document.getElementById("smooth-content");
  spacer = document.getElementById("scroll-spacer");
  if (!content || !spacer) return;

  if (!shouldEnable()) {
    active = false;
    return;
  }

  active = true;
  document.documentElement.classList.add("js-smooth-ready");

  current = window.scrollY;
  updateSpacerHeight();

  // Keep the spacer accurate as images/fonts load or layout shifts.
  const ro = new ResizeObserver(() => updateSpacerHeight());
  ro.observe(content);
  window.addEventListener("load", updateSpacerHeight);
  window.addEventListener("resize", updateSpacerHeight);

  rafId = requestAnimationFrame(tick);

  // If the viewport crosses the pointer/reduced-motion boundary (e.g. dev
  // tools device toolbar toggled), bail out cleanly rather than fight it.
  window.matchMedia("(pointer: fine)").addEventListener?.("change", (e) => {
    if (!e.matches) destroy();
  });
}

function destroy() {
  if (rafId) cancelAnimationFrame(rafId);
  active = false;
  document.documentElement.classList.remove("js-smooth-ready");
  if (content) content.style.transform = "";
}
