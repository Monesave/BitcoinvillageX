/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde4b8',
          200: '#fbcb7e',
          300: '#f9a842',
          400: '#f78c1f',
          500: '#f97316',
          600: '#ea5a0e',
          700: '#c2440e',
          800: '#9a3614',
          900: '#7c2f14',
        },
        bitcoin: {
          DEFAULT: '#f7931a',
          dark: '#e8821e',
          light: '#ffa64d',
        },
        slate: {
          850: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'blockchain-pattern': 'linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(247, 147, 26, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(247, 147, 26, 0.8), 0 0 30px rgba(247, 147, 26, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}

