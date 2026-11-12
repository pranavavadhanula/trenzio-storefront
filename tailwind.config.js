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
          // "The Above": Forest Green Palette
          forest: '#0E2619',
          'forest-deep': '#08170F',
          'forest-surface': '#133320',
          'forest-border': '#1E452E',
          'forest-accent': '#22C55E',

          // "The Other Thing": Blue Only Palette
          blue: '#2563EB',
          'blue-night': '#060C1A',
          'blue-deep': '#081026',
          'blue-surface': '#0D1B3A',
          'blue-card': '#10224A',
          'blue-border': 'rgba(37, 99, 235, 0.25)',
          'blue-vivid': '#3B82F6',
          'blue-electric': '#00D2FF',
          'blue-slate': '#94A3B8',
          'blue-light': '#F8FAFC',

          // Semantic backwards-compatible mappings
          ink: '#060C1A',
          'ink-dark': '#040812',
          'ink-surface': '#0D1B3A',
          'ink-card': '#10224A',
          silver: '#F8FAFC',
          'silver-muted': '#94A3B8',
          'silver-glass': 'rgba(37, 99, 235, 0.08)',
          'silver-border': 'rgba(37, 99, 235, 0.25)',
          lime: '#2563EB',
          'lime-hover': '#3B82F6',
          'lime-soft': 'rgba(37, 99, 235, 0.15)',
          navy: '#0D1B3A',
          'navy-dark': '#060C1A',
          'navy-surface': '#10224A',
          'navy-border': 'rgba(37, 99, 235, 0.25)',
          'navy-muted': '#94A3B8',
          coral: '#2563EB',
          'coral-hover': '#3B82F6',
          'coral-soft': 'rgba(37, 99, 235, 0.15)',

          // Standard semantic numbers for unified theme
          950: '#060C1A', // Canvas
          900: '#0D1B3A', // Cards
          850: '#10224A', // Surface
          800: 'rgba(37, 99, 235, 0.25)', // Borders
          700: '#94A3B8', // Secondary
          300: '#64748B', // Muted
          200: '#CBD5E1', // Body
          100: '#F8FAFC', // Primary Heading
        },
      },
    },
  },
  plugins: [],
}