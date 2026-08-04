/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#111111',
          gold: '#D4AF37',
          'gold-light': '#E9C349',
        },
        surface: '#fdf8f8',
        'surface-dim': '#ddd9d8',
        'surface-bright': '#fdf8f8',
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#444748',
        'outline-variant': '#c4c7c7',
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 10px 40px rgba(0, 0, 0, 0.04)',
        'card-hover': '0px 20px 60px rgba(0, 0, 0, 0.08)',
        'gold-glow': '0 0 0 3px rgba(212, 175, 55, 0.3)',
      },
      backdropBlur: {
        glass: '12px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}
