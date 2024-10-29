/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'sm': '0px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px'
      },
      fontFamily: {
        poppins: ["Poppins", "serif"]
      },
      colors: {
        primary: '#202144'
      }
    },
  },
  plugins: [],
}

