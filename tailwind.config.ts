import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Nomad Horizon palette ─────────────────────────────
        ink: "#0F1923",          // Deep navy — expedition logbook
        rust: "#E8572A",         // Sunset Orange — adventure / action
        sage: "#0A6E6E",         // Deep Teal — brand / reliability
        sand: "#EDD9B4",         // Sand Beige — organic warmth
        cream: "#F7F2E8",        // Parchment — page background
        gold: "#D4820A",         // Warm Amber — supporting accent
        sky: "#5BB5D8",          // Sky Blue — open / horizon
        // ── Variants ──────────────────────────────────────────
        "ink-light": "#1E2D3D",
        "rust-light": "#F07244",
        "rust-dark": "#C04018",
        "sage-light": "#14A0A0",
        "sage-dark": "#075555",
        "sand-dark": "#D9C49A",
        "gold-light": "#F5E8BE",
        "gold-dark": "#A06008",
        "sky-light": "#C0E4F8",
        "sky-dark": "#2890B8",
        muted: "#6B7B8D",        // Blue-gray slate — supporting text
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        app: "420px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
