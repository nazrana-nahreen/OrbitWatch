/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#070a13',
          900: '#0b1120',
          850: '#0f172a',
          800: '#151e36',
          700: '#1e294b',
        },
        orbit: {
          cyan: '#38bdf8',
          blue: '#3b82f6',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
