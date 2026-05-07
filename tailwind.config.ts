import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        forest: "#065a45",
        "forest-light": "#0a7a5f",
        "neon-lime": "#b8e986",
        surface: "#f9fafb",
        coral: "#FF7F50",
        /** shadcn‑kompatibel palette (kopplad Nexosols grönt och ytor) */
        border: "#e8ede9",
        input: "#e8ede9",
        ring: "#065a45",
        background: "#ffffff",
        foreground: "#065a45",
        primary: {
          DEFAULT: "#065a45",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e8eee9",
          foreground: "#065a45",
        },
        muted: {
          DEFAULT: "#f4f6f5",
          foreground: "#4a7365",
        },
        accent: {
          DEFAULT: "#e8ecea",
          foreground: "#065a45",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#065a45",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(6, 90, 69, 0.14)",
        "soft-lg": "0 8px 30px rgba(6, 90, 69, 0.18)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
