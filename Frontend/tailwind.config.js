/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#444444',
        'secondary':'#7B29FF',
        'secondary-bg-dark': '#383838',
        'chat-bg-dark':'#2525259c',
        'reason-dark':'#2c2d2c',
        'line-breaks':'#848484',
        'line-texts':'#b5b5b5',
        // 'primary': '#f8f5fc',
        'primary': '#fdfdff',
        // 'primary': '#f4ecffb4',
        'secondary-bg': '#fdfdff',
        'chat-bg':'#f4ecffb4',
        'reason':'#f6f0fe'
      },
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.1) 0px 0px 15px 0px, rgba(0, 0, 0, 0.05) 0px 4px 6px 0px',
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
        'primary2' : ['Poppins', 'sans-serif'],
        'primary': [ 'Montserrat', 'sans-serif'],
        'secondary': [ 'Inter', 'sans-serif'],
        'secondary2': [ "Open Sans", "sans-serif"],
        'tertiary2': ["Lato", "sans-serif"],
        'hindiText' : ['Mukta', 'sans-serif']
      },
    },
  },
  plugins: [],
}