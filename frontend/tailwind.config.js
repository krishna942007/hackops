/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020510',
          900: '#04071a',
          800: '#070c1e',
          700: '#0d1530',
          600: '#111b3a',
          500: '#1a2550',
        },
        gold: {
          300: '#f5d76e',
          400: '#e8c84a',
          500: '#c9a227',
          600: '#a07c15',
          700: '#7a5d0e',
        },
        ivory: '#f5f0e8',
        'muted-gold': '#a89060',
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"Crimson Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        gold: '0 0 20px rgba(201,162,39,0.25)',
        'gold-lg': '0 0 40px rgba(201,162,39,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer-gold': 'shimmerGold 2.5s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'expand-line': 'expandLine 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmerGold: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 10px rgba(201,162,39,0.3)' }, '50%': { boxShadow: '0 0 30px rgba(201,162,39,0.6)' } },
        rotateSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        expandLine: { from: { width: '0%' }, to: { width: '100%' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
