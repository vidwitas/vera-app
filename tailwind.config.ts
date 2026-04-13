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
        rust: "#E05020",
        sage: "#1A9E87",
        sand: "#F5EFE0",
        cream: "#FDF9F0",
        gold: "#F5A623",
        sky: "#36ADDB",
        "ink-light": "#2C2218",
        "rust-light": "#F06840",
        "rust-dark": "#BC3E10",
        "sage-light": "#22B89D",
        "sage-dark": "#137A68",
        "sand-dark": "#E6DDC8",
        "gold-light": "#FEF0D0",
        "gold-dark": "#D98C10",
        "sky-light": "#D4F0FA",
        "sky-dark": "#1E8BB5",
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
