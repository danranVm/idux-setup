/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    // from idux Breakpoint
    screens: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1720px',
    },
    minWidth: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      page: '1280px',
    },
  },
  plugins: [],
}
