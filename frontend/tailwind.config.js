/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        space: {
          950: '#0a0319',
          900: '#110729',
          850: '#180b38',
          800: '#23114f',
          700: '#341a72',
          600: '#4a259c',
          500: '#6d36e3',
        },
        neon: {
          pink: '#ff2a85',
          magenta: '#e11d48',
          rose: '#f43f5e',
          coral: '#ff5c6a',
          orange: '#ff8a3d',
          amber: '#ffbe1a',
          yellow: '#fde047',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          purple: '#b057fc',
          violet: '#8b5cf6',
          blue: '#3b82f6',
        }
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse-slow': 'spinReverse 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255, 42, 133, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(255, 42, 133, 0.8))' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
