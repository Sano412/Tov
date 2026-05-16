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
          background: "var(--color-background)",
          surface: "var(--color-surface)",
          surface2: "var(--color-surface-2)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          line: "var(--color-line)",
          orange: "var(--color-orange)",
          yellow: "var(--color-yellow)",
          success: "var(--color-success)",
          booked: "var(--color-booked)",
        },
      },
      borderRadius: {
        card: "28px",
        hero: "48px",
      },
      boxShadow: {
        glow: "0 20px 70px rgba(249, 115, 22, 0.24)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.28)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
