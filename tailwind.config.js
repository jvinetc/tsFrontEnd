/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}',
    './node_modules/@jvinetc/front-api-circuit/src/**/*.{ts,tsx}'],
  darkMode: 'class', // Activamos modo oscuro por clase
  theme: {
    extend: {},
  },
  plugins: [],
}

