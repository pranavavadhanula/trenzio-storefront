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
          // Navy Palette
          navy: '#0B1B3D',        // Deep Midnight Navy (Primary Brand Anchor)
          'navy-dark': '#061024',  // Ultra Deep Obsidian Navy
          'navy-surface': '#12254E', // Elevated Navy Surface
          'navy-border': '#1E3B75', // Navy Border
          'navy-muted': '#3A4E78',  // Secondary Navy Text

          // Cream Palette
          cream: '#F8F5EE',       // Primary Editorial Warm Cream (Canvas)
          'cream-surface': '#FFFFFF', // Clean Product Surface
          'cream-card': '#EFECE4', // Subtle Warm Card
          'cream-border': '#E2DCD1', // Warm Cream Border
          'cream-muted': '#8A8275', // Muted Warm Cream

          // Coral Accent Pop (The "Crazy" High-Fashion Pop)
          coral: '#FF6355',       // Electric Luxury Coral
          'coral-hover': '#FF4A3B',
          'coral-soft': 'rgba(255, 99, 85, 0.12)',

          // Standard semantic mappings for unified theme
          950: '#F8F5EE', // Page Background -> Warm Editorial Cream
          900: '#FFFFFF', // Card Background -> Clean White / Cream
          850: '#EFECE4', // Surface Background
          800: '#E2DCD1', // Border
          700: '#9AA5B8', // Secondary Border/Text
          300: '#5A6B8B', // Muted Text
          200: '#2A3C5E', // Body Text
          100: '#0B1B3D', // Primary Headings & Bold Text -> Deep Navy
          50: '#061024',
          gold: '#FF6355', // Mapped to Coral for instant compatibility
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
