/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'master-dark': '#1E3A5F', // Bleu foncé Master Maths
        'master-blue': '#2C5F8D', // Bleu moyen
        'master-turquoise': '#00BCD4', // Turquoise Master Maths
        'master-turquoise-light': '#4DD0E1',
        'master-turquoise-dark': '#0097A7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

