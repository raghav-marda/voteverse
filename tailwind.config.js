/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f0f14",
          secondary: "#16161d",
          tertiary: "#1e1e28",
        },
        accent: {
          DEFAULT: "#7c5cfc",
          light: "#9b82fc",
        },
        muted: "#8888a0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
