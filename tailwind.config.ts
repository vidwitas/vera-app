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
        ink: "#1C1410",
        rust: "#C8411B",
        sage: "#0E7A64",
        sand: "#EDE3CE",
        cream: "#F8F2E5",
        gold: "#C08010",
        sky: "#1E90C8",
        "ink-light": "#2E201A",
        "rust-light": "#E05A34",
        "rust-dark": "#9E3214",
        "sage-light": "#14A085",
        "sage-dark": "#0A5547",
        "sand-dark": "#DED0B4",
        "gold-light": "#F5E8BE",
        "gold-dark": "#8A5C08",
        "sky-light": "#C0E4F8",
        "sky-dark": "#1468A0",
        muted: "#7A6B58",
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
