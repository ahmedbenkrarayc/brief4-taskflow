/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'sm': '767px',
        'md': '1023px',
        'lg': '1279px',
        'xl': '1280px'
      }
    },
  },
  plugins: [],
}

