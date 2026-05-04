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
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 2px 4px rgba(15, 23, 42, 0.06), 0 16px 40px -12px rgba(15, 23, 42, 0.18)',
        'soft': '0 2px 8px rgba(15, 23, 42, 0.06)',
        'glow-orange': '0 8px 24px -8px rgba(255, 134, 42, 0.55)',
        'glow-navy': '0 8px 24px -8px rgba(0, 49, 88, 0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at top, rgba(255, 134, 42, 0.18), transparent 60%), radial-gradient(ellipse at bottom right, rgba(0, 49, 88, 0.22), transparent 60%)',
      },
    },
  },
  plugins: [],
}
