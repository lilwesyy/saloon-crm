module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#ffbfd6',
          300: '#ff8fb4',
          400: '#ff5c8a',
          500: '#ff2b62',
          600: '#ef0a42',
          700: '#d70038',
          800: '#b10030',
          900: '#94032b',
          950: '#520014',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
