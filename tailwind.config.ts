import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // "black" is repointed to the same near-black as "ink" so every existing
        // Tailwind black/opacity utility (border-black/10, text-black/40, ...)
        // resolves to the one approved near-black — never a literal #000.
        ink: "#0A0A0A",
        black: "#0A0A0A",
        surface: "#F5F5F5",
        accent: "#38AFD8",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "grid-pulse": "gridPulse 9s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
