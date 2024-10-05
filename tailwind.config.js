/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-border': "#3D3D3D",
        "dark-green": "#30502D",
        "back": "#151617"
      }
    },
  },
  plugins: [],
}

