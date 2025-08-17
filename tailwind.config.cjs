/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#B2EBF2',
          DEFAULT: '#00BCD4',
          dark: '#0097A7'
        },
        secondary: {
          DEFAULT: '#007A89',
          dark: '#005A5F'
        },
        accent: '#FF9800',
        background: '#FFFFFF',
        text: {
          primary: '#000000',
          secondary: '#757575',
          tertiary: '#BDBDBD'
        },
        divider: '#BDBDBD'
      }
    },
  },
  plugins: [],
}
