/**
 * nav.js
 * Floating nav behaviour:
 *  - .nav-solid once the page has scrolled past a small threshold
 *  - hide on scroll-down / reappear on scroll-up (only past HIDE_THRESHOLD,
 *    so it never disappears while the hero is still on screen)
 *  - active-link highlighting via IntersectionObserver against the four
 *    top-level sections
 *  - mobile hamburger menu open/close (button, close icon, Escape key)
 *  - in-page anchor links are intercepted and routed through
 *    smoothScroll's scrollToTarget() so they respect the fake-scroll easing
 *    instead of relying on the browser's native hash-jump (unreliable
 *    against a position:fixed content wrapper)
 *  - #scroll-progress hairline width
 */

import { scrollToTarget } from "./smoothScroll.js";

const HIDE_THRESHOLD = 80;
const SOLID_THRESHOLD = 24;
const ANCHOR_OFFSET = 96; // roughly the floating nav's height + breathing room

let nav, navLinks, mobileMenu, menuToggle, menuClose, scrollProgress;
let lastScrollY = 0;
let ticking = false;
let sectionObserver = null;

function updateOnScroll() {
  const y = window.scrollY;

  nav.classList.toggle("nav-solid", y > SOLID_THRESHOLD);

  if (y > HIDE_THRESHOLD && y > lastScrollY) {
    nav.classList.add("nav-hidden");
  } else {
    nav.classList.remove("nav-hidden");
  }
  lastScrollY = y;

  if (scrollProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  ticking = false;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateOnScroll);
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.sectionLink === id);
  });
}

function initSectionObserver() {
  const sections = ["hero", "skills", "works", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function openMobileMenu() {
  mobileMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function handleDocumentClick(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute("href").slice(1);
  const targetEl = id ? document.getElementById(id) : null;
  if (!targetEl) return;

  e.preventDefault();
  if (mobileMenu?.classList.contains("is-open")) closeMobileMenu();

  const dest = targetEl.getBoundingClientRect().top + window.scrollY;
  scrollToTarget(dest, { offset: ANCHOR_OFFSET });
}

export function initNav() {
  nav = document.getElementById("site-nav");
  navLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  mobileMenu = document.getElementById("mobile-menu");
  menuToggle = document.getElementById("menu-toggle");
  menuClose = document.getElementById("menu-close");
  scrollProgress = document.getElementById("scroll-progress");

  if (!nav) return;

  window.addEventListener("scroll", onScroll, { passive: true });
  updateOnScroll();
  initSectionObserver();

  menuToggle?.addEventListener("click", () => {
    if (mobileMenu.classList.contains("is-open")) closeMobileMenu();
    else openMobileMenu();
  });
  menuClose?.addEventListener("click", closeMobileMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", handleDocumentClick);
}
