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
        ink: "#1A1410",
        rust: "#C4622D",
        sage: "#4A7C6F",
        sand: "#F5F0E8",
        cream: "#FDFAF5",
        "ink-light": "#2C2218",
        "rust-light": "#D4744A",
        "rust-dark": "#A85225",
        "sage-light": "#5A9080",
        "sand-dark": "#E8E0D0",
        muted: "#8A7968",
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
