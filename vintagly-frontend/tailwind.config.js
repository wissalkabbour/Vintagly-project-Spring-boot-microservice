/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
extend: {
      colors: {
          dark: "#2C241D",
          green: "#386860",
          brown: "#C28A5A",
          gray: "#A3B0AA",
          beige: "#CDB8A4",
      },
    },  },
  plugins: [],
}
