/** @type {import('tailwindcss').Config} */
module.exports = {
  content:
  [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bege' : '#fff8dc',
        'bege2' : '#fff8e7',
        'bege3' : '#ffd7b5',
        'bege4' :'#e2946f',
      }
    },
  },
  plugins: [],
}
