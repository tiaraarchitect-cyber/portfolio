# Anika Rao Studio — Portfolio

A single-page architecture portfolio. Vanilla JS (ES modules), HTML5, Tailwind CSS, served by a small Express static server. No React, no animation libraries — all motion (fake-smooth scroll, staggered reveals, magnetic skill rows, custom cursor) is hand-rolled with `requestAnimationFrame` and `IntersectionObserver`.

## Run it

```bash
npm install
npm start
```

`npm start` automatically compiles the Tailwind stylesheet first (via a `prestart` hook that runs `npm run build:css`), then launches the server. Open `http://localhost:3000`.

While actively editing styles, run `npm run watch:css` in a second terminal — it rebuilds `public/css/tailwind.css` on every save without you needing to restart the server.

## Structure

```
tailwind.config.js          Design tokens (palette, fonts, letter-spacing) — single source of truth for all pages
postcss.config.js           Wires Tailwind + Autoprefixer
src/tailwind-input.css      Tailwind's three @tailwind directives — compiled into public/css/tailwind.css
server.js                  Express static server (+ themed 404)
public/
  index.html                The single page
  404.html
  css/
    tailwind.css              Generated — do not hand-edit (npm run build:css regenerates it)
    style.css                  All custom, hand-written styles (motion, the blueprint motif, etc.)
  js/
    main.js                  Entry point, wires up the modules below
    modules/
      smoothScroll.js         Fake-scroll engine (fixed content + lerp), disabled on touch / reduced-motion
      reveal.js                IntersectionObserver reveal system + on-load hero reveal
      magnetic.js              Cursor-reactive spotlight + pull on the skills matrix
      cursor.js                Custom dot/ring cursor (fine pointers only)
      nav.js                   Floating nav show/hide, active-section highlight, mobile menu, anchor routing
  works/
    thesis.html                Detail page for the academic thesis (Block 01)
    project-meridian.html       NDA briefing page (Block 02)
    project-aurelia.html        NDA briefing page (Block 03)
    project-kintsugi.html       NDA briefing page (Block 04)
```

## Things worth knowing before deploying

- **Tailwind is now a real local build**, not the CDN script — `tailwindcss`, `postcss`, and `autoprefixer` are dev dependencies, compiled by `npm run build:css` into `public/css/tailwind.css`, which every page links directly. This means the site no longer depends on an external CDN at runtime, and ships a small, purged stylesheet (only the classes actually used in the markup) instead of compiling JIT in every visitor's browser. The trade-off: until you run `npm install` once, `public/css/tailwind.css` doesn't exist yet, so opening any HTML file directly (without running the server) will look unstyled — `npm start` handles the build automatically, but a plain double-click on `index.html` won't.
- I wasn't able to actually run `npm install` or `npm run build:css` myself in this sandbox (no network access to the npm registry), so the build pipeline is written and config-validated but not end-to-end verified on a real machine. Everything follows the standard Tailwind v3 CLI setup, so it should work as-is — but if `npm run build:css` errors for you, let me know what it says and I'll fix it.
- **All imagery is placeholder** — the hero portrait, the thesis watercolor, and the footer sketch are deterministic [Picsum](https://picsum.photos) photos run through CSS grayscale/sepia filters so they read as moody architectural sketches in the meantime. Each `<img>` has an `onerror` fallback that shows a small "Replace with final photography" label if a placeholder ever fails to load, so nothing breaks visually — but they're all meant to be swapped for real photography, the thesis scans, and a real studio sketch before this goes live. Search for `picsum.photos` across `public/` to find every instance.
- The custom cursor, magnetic rows, and fake-smooth scroll are all gated to `(pointer: fine)` and automatically fall back to native behavior on touch devices and when `prefers-reduced-motion: reduce` is set.
