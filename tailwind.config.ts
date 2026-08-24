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
      boxShadow: {
        glow: "0 0 40px -8px rgba(56,175,216,0.35)",
        "glow-sm": "0 0 20px -6px rgba(56,175,216,0.4)",
        "glass-lift": "0 20px 45px -16px rgba(10,10,10,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "grid-pulse": "gridPulse 9s ease-in-out infinite",
        "orb-drift": "orbDrift 16s ease-in-out infinite",
        "orb-drift-slow": "orbDrift 22s ease-in-out infinite reverse",
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
        orbDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate(4%, -6%) scale(1.12)", opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
