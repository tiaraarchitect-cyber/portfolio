/**
 * server.js
 * Minimal Express static server for the portfolio.
 * No templating, no API — the front end is plain HTML/CSS/JS.
 */
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Serve everything in /public as-is (index.html, /css, /js, /works/*.html)
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ["html"],
    setHeaders: (res, filePath) => {
      // Keep markup fresh while caching nothing aggressively during dev.
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// Explicit root route (covered by express.static, but kept for clarity).
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Friendly 404 that matches the site's visual language.
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Studio portfolio running → http://localhost:${PORT}`);
});
