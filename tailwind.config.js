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
          950: '#070d1e', // Deep Midnight Navy (Primary Background)
          900: '#0d172e', // Rich Obsidian Navy (Cards & Drawers)
          850: '#142243', // Midnight Navy Surface
          800: '#1c2d56', // Navy Border
          700: '#2a3f72', // Soft Navy Border
          300: '#DDD3C0', // Muted Editorial Cream
          200: '#ECE4D4', // Soft Warm Cream
          100: '#F8F4EB', // Pure Editorial Cream (Primary Typography)
          50: '#FDFBF7',  // Bright Cream Highlight
          gold: '#FF6355', // Electric Coral Accent Pop
          coral: '#FF6355', // Electric Luxury Coral
          'coral-hover': '#FF4A3B',
          navy: '#070d1e',
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
