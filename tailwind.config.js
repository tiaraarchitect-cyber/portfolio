/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { DEFAULT: "#111112", 2: "#19191b", 3: "#222224" },
        beige: { DEFAULT: "#D4C5B9", dim: "#A89A8C" },
        olive: { DEFAULT: "#3B413C", dark: "#2C312D" },
        stone: { 400: "#9A9388" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        widest2: ".25em",
      },
    },
  },
  plugins: [],
};
