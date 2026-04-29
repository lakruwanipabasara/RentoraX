/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          700: '#0f766e',
          800: '#115e59',
        }
      }
    },
  },
  plugins: [],
}