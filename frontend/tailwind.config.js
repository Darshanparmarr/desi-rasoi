/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6edf2',
          100: '#bdcedd',
          200: '#94afc7',
          300: '#6a8fb1',
          400: '#43719c',
          500: '#1d5483',
          600: '#003158',
          700: '#00264a',
          800: '#001b3c',
          900: '#00112e',
        },
        secondary: {
          50: '#fff4ea',
          100: '#ffe0c4',
          200: '#ffc99c',
          300: '#ffb273',
          400: '#ffa050',
          500: '#ff8a30',
          600: '#ff862a',
          700: '#e0691a',
          800: '#b35314',
          900: '#7d3a0e',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        brand: {
          green: {
            50: '#e6edf2',
            100: '#bdcedd',
            200: '#94afc7',
            300: '#6a8fb1',
            400: '#43719c',
            500: '#1d5483',
            600: '#003158',
            700: '#00264a',
            800: '#001b3c',
            900: '#00112e',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
