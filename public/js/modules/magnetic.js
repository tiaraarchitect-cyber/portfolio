/**
 * magnetic.js
 * Cursor-reactive skill rows:
 *  - --mx / --my drive the radial-gradient spotlight in .skill-row::before
 *  - --magnetic-x adds a small extra horizontal pull on .skill-name,
 *    proportional to how far left/right the cursor sits within the row,
 *    layered on top of the row's base 6px hover shift (see style.css).
 *
 * Fine pointers only — touch devices never fire mousemove this way, but we
 * bail out early anyway so no listeners are attached needlessly.
 */

const PULL_STRENGTH = 10; // max extra px of horizontal pull, either direction

function handleMove(e, row) {
  const rect = row.getBoundingClientRect();
  const relX = ((e.clientX - rect.left) / rect.width) * 100;
  const relY = ((e.clientY - rect.top) / rect.height) * 100;

  row.style.setProperty("--mx", `${relX.toFixed(2)}%`);
  row.style.setProperty("--my", `${relY.toFixed(2)}%`);

  const centered = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
  const pull = centered * PULL_STRENGTH * 2;
  row.style.setProperty("--magnetic-x", `${pull.toFixed(1)}px`);
}

function resetRow(row) {
  row.style.setProperty("--mx", "50%");
  row.style.setProperty("--my", "50%");
  row.style.setProperty("--magnetic-x", "0px");
}

export function initMagnetic() {
  const rows = document.querySelectorAll("[data-magnetic-row]");
  if (!rows.length) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  rows.forEach((row) => {
    let queued = false;
    let lastEvent = null;

    row.addEventListener(
      "mousemove",
      (e) => {
        lastEvent = e;
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          handleMove(lastEvent, row);
          queued = false;
        });
      },
      { passive: true }
    );

    row.addEventListener("mouseleave", () => resetRow(row), { passive: true });
  });
}
