/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#444444',
        'secondary':'#7B29FF',
        'secondary-bg': '#383838',
      },
      spacing: {
        '5px': '5px',
        '10px' : '10px',
        '15px' : '15px',
        '20px': '20px',
        '25px' : '25px',
        '30px' : '30px',
        '50px' : '50px',
        '60px' : '60px',
        '80px' : '80px',
      },
      fontFamily: {
        'primary': [ 'Montserrat', 'serif'],
        'secondary': [ 'Inter', 'serif'],
      },
    },
  },
  plugins: [],
}