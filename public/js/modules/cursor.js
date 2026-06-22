/**
 * cursor.js
 * Custom dot + ring cursor, fine pointers only.
 *  - #cursor-dot follows the raw pointer almost instantly (fast lerp).
 *  - #cursor-ring trails slightly behind (slower lerp) and enlarges with a
 *    text label when hovering anything tagged data-cursor="view"|"text".
 *
 * Gated via matchMedia('(pointer: fine)') so touch devices never pay for it
 * — the .has-fine-cursor class on <html> is what style.css uses to flip
 * `cursor: none` and show the custom elements at all.
 */

const LERP_DOT = 0.45;
const LERP_RING = 0.18;

let dot, ring;
let mouseX = -100;
let mouseY = -100;
let dotX = mouseX;
let dotY = mouseY;
let ringX = mouseX;
let ringY = mouseY;
let rafId = null;

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function tick() {
  dotX += (mouseX - dotX) * LERP_DOT;
  dotY += (mouseY - dotY) * LERP_DOT;
  ringX += (mouseX - ringX) * LERP_RING;
  ringY += (mouseY - ringY) * LERP_RING;

  dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
  ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

  rafId = requestAnimationFrame(tick);
}

function activate(target) {
  ring.classList.add("cursor-active");
  ring.textContent = target.dataset.cursorText || "";
}

function deactivate() {
  ring.classList.remove("cursor-active");
  ring.textContent = "";
}

function onOver(e) {
  const target = e.target.closest("[data-cursor]");
  if (target) activate(target);
}

function onOut(e) {
  const target = e.target.closest("[data-cursor]");
  if (!target) return;
  const related =
    e.relatedTarget && e.relatedTarget.closest
      ? e.relatedTarget.closest("[data-cursor]")
      : null;
  if (related === target) return; // still within the same hover target
  deactivate();
}

export function initCursor() {
  dot = document.getElementById("cursor-dot");
  ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  const fineQuery = window.matchMedia("(pointer: fine)");

  function enable() {
    document.documentElement.classList.add("has-fine-cursor");
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function disable() {
    document.documentElement.classList.remove("has-fine-cursor");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    deactivate();
  }

  if (fineQuery.matches) enable();

  fineQuery.addEventListener?.("change", (e) => {
    if (e.matches) enable();
    else disable();
  });
}
