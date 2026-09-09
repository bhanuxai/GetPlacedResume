/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          elevated: "#F1F5F9",
          hover: "#E2E8F0",
          border: "#CBD5E1",
          subtle: "#F8FAFC",
          text: "#0F172A",
          muted: "#475569"
        },
        dark: {
          bg: "#000000",
          surface: "#0A0A0A",
          elevated: "#171717",
          hover: "#1f1f1f",
          border: "#262626",
          subtle: "#141414",
          text: "#F8FAFC",
          muted: "#94A3B8"
        },
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          active: "#1E40AF",
          subtle: "#EFF6FF",
          light: "#60A5FA"
        },
        status: {
          strong: "#059669",
          moderate: "#D97706",
          weak: "#EA580C",
          missing: "#DC2626",
          neutral: "#64748B"
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['Inter', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
