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
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"Inter"', 'monospace'],
      },
      colors: {
        // Official TREVORI Luxury Editorial Color Palette
        trevori: {
          bg: '#F4F1EA',          // Primary background: Warm Ivory
          text: '#171717',        // Primary text: Deep Charcoal / Black
          secondary: '#706B64',   // Secondary text: Refined Warm Taupe-Grey
          accent: '#B9AA96',      // Accent: Warm Architectural Taupe
          'accent-hover': '#9F8F79',
          card: '#DDD8CE',        // Card background: Subtle Stone / Warm Card
          surface: '#FFFFFF',     // Product surfaces: Crisp White
          border: 'rgba(23, 23, 23, 0.08)',
          'border-dark': 'rgba(23, 23, 23, 0.16)',
        },
        // Backwards compatibility mappings mapped to official luxury palette
        atelier: {
          forest: '#171717',
          'forest-deep': '#171717',
          'forest-surface': '#F4F1EA',
          'forest-border': '#DDD8CE',
          'forest-accent': '#B9AA96',
          blue: '#171717',
          'blue-night': '#F4F1EA',
          'blue-deep': '#F4F1EA',
          'blue-surface': '#DDD8CE',
          'blue-card': '#DDD8CE',
          'blue-border': 'rgba(23, 23, 23, 0.1)',
          'blue-vivid': '#171717',
          'blue-electric': '#B9AA96',
          'blue-slate': '#706B64',
          'blue-light': '#FFFFFF',
          ink: '#171717',
          'ink-dark': '#171717',
          'ink-surface': '#F4F1EA',
          'ink-card': '#DDD8CE',
          silver: '#171717',
          'silver-muted': '#706B64',
          'silver-glass': 'rgba(23, 23, 23, 0.04)',
          'silver-border': 'rgba(23, 23, 23, 0.1)',
          lime: '#171717',
          'lime-hover': '#333333',
          'lime-soft': '#DDD8CE',
          navy: '#171717',
          'navy-dark': '#171717',
          'navy-surface': '#DDD8CE',
          'navy-border': 'rgba(23, 23, 23, 0.1)',
          'navy-muted': '#706B64',
          coral: '#171717',
          'coral-hover': '#333333',
          'coral-soft': '#DDD8CE',
          950: '#F4F1EA',
          900: '#DDD8CE',
          850: '#FFFFFF',
          800: 'rgba(23, 23, 23, 0.1)',
          700: '#706B64',
          300: '#B9AA96',
          200: '#706B64',
          100: '#171717',
        },
      },
    },
  },
  plugins: [],
}
