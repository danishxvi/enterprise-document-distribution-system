/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // The whole interface is built from one blue and white. Every value
        // below is a tint or shade of the same corporate blue, so headings,
        // borders and backgrounds all stay inside the two colour rule.
        brand: {
          50: '#F2F8FC',
          100: '#E1EFF8',
          200: '#BFDDF0',
          300: '#8CC3E6',
          500: '#007CC3',
          600: '#006AA8',
          700: '#00578A',
          900: '#0B2A47',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // A soft blue lift used on hover, never a grey drop shadow.
        card: '0 12px 32px -14px rgba(0, 124, 195, 0.35)',
        panel: '0 24px 60px -24px rgba(11, 42, 71, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
