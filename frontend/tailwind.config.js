/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Neumorphic base surface. Everything shares this tone so the
        // light and dark shadows read as a single sculpted material.
        surface: '#F0F5F9',
        ink: {
          DEFAULT: '#2D3748', // primary text, deep slate
          muted: '#718096', // secondary text, cool gray
        },
        accent: {
          blue: '#3182CE',
          teal: '#38B2AC',
          amber: '#DD6B20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Extruded: cards, containers, resting buttons.
        neu: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
        // A tighter extrusion used on hover so an element feels lightly touched.
        'neu-sm': '5px 5px 10px rgba(163,177,198,0.55), -5px -5px 10px rgba(255,255,255,0.6)',
        // Pressed: inputs, active toggles, anything that should look sunken.
        'neu-inset':
          'inset 6px 6px 10px rgba(163,177,198,0.7), inset -6px -6px 10px rgba(255,255,255,0.8)',
        // A soft pressed state for buttons on click.
        'neu-inset-sm':
          'inset 4px 4px 8px rgba(163,177,198,0.65), inset -4px -4px 8px rgba(255,255,255,0.75)',
      },
      borderRadius: {
        neu: '16px',
        'neu-sm': '12px',
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
