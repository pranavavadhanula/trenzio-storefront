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
          // Forest Green & Sand Beige Palette
          forest: '#112319',           // Rich Forest Green
          'forest-deep': '#0A160F',    // Midnight Forest Canvas
          'forest-surface': '#162E21', // Forest Container Surface
          'forest-card': '#112319',    // Card Elevation
          'forest-accent': '#2D6E49',  // Vibrant Pine Green Accent
          'forest-border': 'rgba(212, 195, 163, 0.22)',

          sand: '#E6D7C3',             // Warm Sand Beige
          'sand-light': '#F4ECE1',     // Soft Sand Beige Light
          'sand-medium': '#D4C3A3',    // Classic Sand Beige Accent
          'sand-muted': '#A39277',     // Muted Sand Beige Subtext
          'sand-dark': '#0A160F',      // Contrast Forest Green Text
          'sand-border': 'rgba(212, 195, 163, 0.25)',

          // Semantic backwards-compatible mappings
          ink: '#0A160F',
          'ink-dark': '#07100B',
          'ink-surface': '#112319',
          'ink-card': '#162E21',
          silver: '#F4ECE1',
          'silver-muted': '#D4C3A3',
          'silver-glass': 'rgba(212, 195, 163, 0.06)',
          'silver-border': 'rgba(212, 195, 163, 0.22)',
          lime: '#D4C3A3',
          'lime-hover': '#F4ECE1',
          'lime-soft': 'rgba(212, 195, 163, 0.14)',
          navy: '#112319',
          'navy-dark': '#0A160F',
          'navy-surface': '#162E21',
          'navy-border': 'rgba(212, 195, 163, 0.22)',
          'navy-muted': '#D4C3A3',
          cream: '#0A160F',
          coral: '#D4C3A3',
          'coral-hover': '#F4ECE1',
          'coral-soft': 'rgba(212, 195, 163, 0.14)',

          // Standard semantic numbers for unified theme
          950: '#0A160F', // Canvas
          900: '#112319', // Cards
          850: '#162E21', // Surface
          800: 'rgba(212, 195, 163, 0.22)', // Borders
          700: '#D4C3A3', // Secondary
          300: '#A39277', // Muted
          200: '#D4C3A3', // Body
          100: '#F4ECE1', // Primary Heading
        },
      },
    },
  },
  plugins: [],
}