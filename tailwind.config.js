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
          950: '#0a0a0a',
          900: '#121212',
          850: '#1a1a1a',
          800: '#262626',
          700: '#404040',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f4',
          50: '#fafaf9',
          gold: '#c5a880',
          sand: '#e8e2d8'
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
