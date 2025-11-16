/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // तुम्हारे सारे components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],       // default body font
        heading: ['Montserrat', 'sans-serif'], // headings
      },
      colors: {
        primary: '#FFD700', // optional golden color for pro look
      }
    },
  },
  plugins: [],
}
