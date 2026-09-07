/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        // "Bleu ocean" primary palette - deep navy anchors with vivid sky/cyan mid-tones,
        // used for gradients and accents across the whole app.
        brand: {
          50: '#eefaff',
          100: '#d6f3ff',
          200: '#b0e7ff',
          300: '#79d6ff',
          400: '#3cbdfb',
          500: '#129eea',
          600: '#0678c2',
          700: '#0a5f9e',
          800: '#0f4d7f',
          900: '#0d3358',
          950: '#081d38',
        },
        accent: {
          300: '#7ee8e0',
          400: '#38ded1',
          500: '#14b8ab',
          600: '#0d9488',
        },
      },
      boxShadow: {
        soft: '0 8px 30px -8px rgba(6, 120, 194, 0.4)',
        card: '0 4px 20px -4px rgba(13, 51, 88, 0.12)',
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 12px 45px -10px rgba(6, 120, 194, 0.5)',
        'glow-lg': '0 20px 60px -12px rgba(6, 120, 194, 0.55)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #081d38 0%, #0a5f9e 45%, #129eea 85%, #38ded1 100%)',
        'ocean-gradient': 'linear-gradient(120deg, #0d3358 0%, #0678c2 50%, #14b8ab 100%)',
        'navy-radial': 'radial-gradient(circle at 20% 20%, rgba(56,222,209,0.3), transparent 40%), radial-gradient(circle at 85% 75%, rgba(18,158,234,0.35), transparent 45%)',
        'mesh-radial': 'radial-gradient(at 0% 0%, rgba(18,158,234,0.18) 0, transparent 50%), radial-gradient(at 98% 100%, rgba(20,184,171,0.18) 0, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'fade-in-down': 'fadeInDown 0.7s ease-out both',
        'scale-in': 'scaleIn 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.6s ease-out both',
        'slide-in-left': 'slideInLeft 0.6s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: 0, transform: 'translateY(-24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.92)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(3deg)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(32px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: 0, transform: 'translateX(-32px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
