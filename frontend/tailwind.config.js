/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // "Bleu marine" (navy) primary palette - replaces the previous indigo/violet theme.
        brand: {
          50: '#eef4fb',
          100: '#d9e6f5',
          200: '#b3cceb',
          300: '#82a9d9',
          400: '#5583c2',
          500: '#3a67a8',
          600: '#284b85',
          700: '#1f3c6b',
          800: '#182f54',
          900: '#0c1a33',
          950: '#081222',
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      boxShadow: {
        soft: '0 8px 30px -8px rgba(15, 42, 86, 0.35)',
        card: '0 4px 20px -4px rgba(12, 26, 51, 0.1)',
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px -8px rgba(12, 26, 51, 0.55)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0c1a33 0%, #1f3c6b 45%, #0284c7 100%)',
        'navy-radial': 'radial-gradient(circle at 30% 20%, rgba(56,189,248,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(31,60,107,0.5), transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'scale-in': 'scaleIn 0.4s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out both',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(24px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
