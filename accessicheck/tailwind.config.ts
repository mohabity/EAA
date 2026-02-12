import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FAFAF8",
        foreground: "#1E293B",
        "sidebar-bg": "#0F172A",
        "sidebar-text": "#94A3B8",
        "sidebar-active": "#FFFFFF",
        accent: {
          DEFAULT: "#047857",
          hover: "#065F46",
        },
      },
    },
  },
  plugins: [],
};
export default config;
