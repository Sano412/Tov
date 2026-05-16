import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tovlo: {
          background: "rgb(var(--color-background-rgb) / <alpha-value>)",
          darker: "rgb(var(--color-darker-rgb) / <alpha-value>)",
          surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
          surface2: "rgb(var(--color-surface-2-rgb) / <alpha-value>)",
          text: "rgb(var(--color-text-rgb) / <alpha-value>)",
          muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
          subtle: "rgb(var(--color-subtle-rgb) / <alpha-value>)",
          line: "rgb(var(--color-line-rgb) / <alpha-value>)",
          glass: "rgb(var(--color-glass-rgb) / <alpha-value>)",
          glassStrong: "rgb(var(--color-glass-strong-rgb) / <alpha-value>)",
          orange: "rgb(var(--color-orange-rgb) / <alpha-value>)",
          softOrange: "rgb(var(--color-soft-orange-rgb) / <alpha-value>)",
          yellow: "rgb(var(--color-yellow-rgb) / <alpha-value>)",
          amber: "rgb(var(--color-amber-rgb) / <alpha-value>)",
          success: "rgb(var(--color-success-rgb) / <alpha-value>)",
          booked: "rgb(var(--color-booked-rgb) / <alpha-value>)",
        },
      },
      borderRadius: {
        card: "28px",
        hero: "48px",
      },
      boxShadow: {
        glow: "0 22px 80px rgba(249, 115, 22, 0.28)",
        glass: "0 26px 90px rgba(0, 0, 0, 0.34)",
        innerGlow: "inset 0 1px 0 rgba(255, 247, 237, 0.14)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
