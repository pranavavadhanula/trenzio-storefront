/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        atelier: {
          950: '#0b1938', // Deep Midnight Navy (Noticeable rich luxury dark blue)
          900: '#10224a', // Rich Obsidian Navy (Cards, Drawers & Modals)
          850: '#173066', // Midnight Navy Surface
          800: '#1f4088', // Navy Border
          700: '#2b57b5', // Soft Navy Border
          300: '#DDD3C0', // Muted Editorial Cream
          200: '#ECE4D4', // Soft Warm Cream
          100: '#F8F4EB', // Pure Editorial Cream (Primary Typography)
          50: '#FDFBF7',  // Bright Cream Highlight
          gold: '#FF6355', // Electric Coral Accent Pop
          coral: '#FF6355', // Electric Luxury Coral
          'coral-hover': '#FF4A3B',
          navy: '#0b1938',
          cream: '#F8F4EB',
          sand: '#ECE4D4',
        }
      },
      letterSpacing: {
        'widest-luxury': '0.25em',
        'ultra': '0.35em',
      }
    },
  },
  plugins: [],
}
