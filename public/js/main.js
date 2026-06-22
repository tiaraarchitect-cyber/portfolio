/**
 * main.js
 * Entry point. Import order matters a little: smooth scroll first (so
 * js-smooth-ready is set before anything measures layout), then the visual
 * systems that don't depend on each other.
 */

import { initSmoothScroll } from "./modules/smoothScroll.js";
import { initReveal } from "./modules/reveal.js";
import { initMagnetic } from "./modules/magnetic.js";
import { initCursor } from "./modules/cursor.js";
import { initNav } from "./modules/nav.js";

function init() {
  initSmoothScroll();
  initReveal();
  initMagnetic();
  initCursor();
  initNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
