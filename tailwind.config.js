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
          // Pure Orchid Palette
          orchid: '#DA70D6',           // Radiant Orchid
          'orchid-vivid': '#E056FD',   // Vivid Electric Orchid
          'orchid-light': '#F39CFF',   // Luminous Light Orchid
          'orchid-medium': '#BA55D3',  // Medium Orchid
          'orchid-deep': '#9932CC',    // Dark Rich Orchid
          'orchid-night': '#0B0512',   // Midnight Orchid Canvas
          'orchid-dark': '#06030A',    // Void Dark Orchid
          'orchid-surface': '#140A21', // Velvet Orchid Surface
          'orchid-card': '#1B0E2C',    // Card Elevation
          'orchid-border': 'rgba(218, 112, 214, 0.22)', // Orchid Glass Edge
          'orchid-soft': 'rgba(218, 112, 214, 0.14)',  // Soft Orchid Tint
          'orchid-silk': '#FAF5FF',    // Frost Orchid Silky White
          'orchid-mist': '#D8B4FE',    // Muted Lavender Orchid

          // Semantic backwards-compatible mappings
          ink: '#0B0512',
          'ink-dark': '#06030A',
          'ink-surface': '#140A21',
          'ink-card': '#1B0E2C',
          silver: '#FAF5FF',
          'silver-muted': '#D8B4FE',
          'silver-glass': 'rgba(218, 112, 214, 0.06)',
          'silver-border': 'rgba(218, 112, 214, 0.22)',
          lime: '#DA70D6',
          'lime-hover': '#F39CFF',
          'lime-soft': 'rgba(218, 112, 214, 0.14)',
          navy: '#140A21',
          'navy-dark': '#0B0512',
          'navy-surface': '#1B0E2C',
          'navy-border': 'rgba(218, 112, 214, 0.22)',
          'navy-muted': '#D8B4FE',
          cream: '#0B0512',
          coral: '#DA70D6',
          'coral-hover': '#F39CFF',
          'coral-soft': 'rgba(218, 112, 214, 0.14)',

          // Standard semantic numbers for unified theme
          950: '#0B0512', // Canvas
          900: '#140A21', // Cards
          850: '#1B0E2C', // Surface
          800: 'rgba(218, 112, 214, 0.22)', // Borders
          700: '#D8B4FE', // Secondary
          300: '#8E7A9F', // Muted
          200: '#D8B4FE', // Body
          100: '#FAF5FF', // Primary Heading
          50: '#FFFFFF',
          gold: '#DA70D6',
          sand: '#1B0E2C',
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
