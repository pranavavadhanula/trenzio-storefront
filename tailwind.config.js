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
          // Deep Luxury Chocolate Brown Palette
          brown: '#2A1810',          // Deep Chocolate Espresso (Primary Brand Anchor)
          'brown-dark': '#1A0E08',   // Deepest Obsidian Roast
          'brown-surface': '#362016',// Elevated Rich Cocoa Surface
          'brown-border': '#4E3022', // Warm Cocoa Border
          'brown-muted': '#6E4733',  // Secondary Muted Cocoa

          // Warm Editorial Cream Palette
          cream: '#F9F6F0',          // Primary Editorial Warm Linen Cream (Canvas)
          'cream-surface': '#FFFFFF',
          'cream-card': '#EFE9DC',   // Warm Parchment Card
          'cream-border': '#DFD7C7', // Linen Border
          'cream-muted': '#8E8271',  // Muted Warm Linen

          // Baby Blue Accent (The Chic High-Fashion Pop)
          babyblue: '#7BB8E8',       // Elegant Powder / Baby Blue
          'babyblue-hover': '#5E9ED5',
          'babyblue-soft': 'rgba(123, 184, 232, 0.16)',

          // Backward-compatible semantic mappings
          navy: '#2A1810',           // Mapped to Chocolate Brown
          'navy-dark': '#1A0E08',
          'navy-surface': '#362016',
          'navy-border': '#4E3022',
          'navy-muted': '#6E4733',
          coral: '#7BB8E8',          // Mapped to Baby Blue for instant compatibility
          'coral-hover': '#5E9ED5',
          'coral-soft': 'rgba(123, 184, 232, 0.16)',

          // Standard semantic mappings for unified theme
          950: '#F9F6F0', // Page Background -> Warm Linen Cream
          900: '#2A1810', // Deep Chocolate Brown
          850: '#362016', // Cocoa Surface
          800: '#DFD7C7', // Linen Border
          700: '#A49887', // Secondary Border/Text
          300: '#6E4733', // Muted Text
          200: '#3D2418', // Body Text Brown
          100: '#2A1810', // Primary Headings & Bold Text -> Deep Brown
          50: '#1A0E08',
          gold: '#7BB8E8', // Baby Blue
          sand: '#EFE9DC',
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
