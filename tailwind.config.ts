import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      colors: {
        forest: "#065a45",
        "forest-light": "#0a7a5f",
        "neon-lime": "#b8e986",
        surface: "#f9fafb",
        coral: "#FF7F50",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(6, 90, 69, 0.14)",
        "soft-lg": "0 8px 30px rgba(6, 90, 69, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
