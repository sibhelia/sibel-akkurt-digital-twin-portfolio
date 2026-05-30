/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0f0f11",
        "card-dark": "#16161a",
        "card-darker": "#111114",
        "purple-accent": "#8b5cf6",
      },
    },
  },
  plugins: [],
}
