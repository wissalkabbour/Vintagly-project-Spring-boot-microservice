/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          50: '#faf8f3',
          100: '#f5f0e6',
          200: '#e8dcc4',
          300: '#dbc8a2',
          400: '#c8a87a',
          500: '#b58a5c',
          600: '#9a7049',
          700: '#7d5a3c',
          800: '#664a33',
          900: '#543d2b',
        }
      },
    },
  },
  plugins: [],
}