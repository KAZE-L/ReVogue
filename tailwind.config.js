module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,css}', 
    './components/**/*.{js,ts,jsx,tsx,css}',
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
