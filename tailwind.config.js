/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sansation': ['Sansation', 'sans-serif'],
        'albert': ['Albert Sans', 'sans-serif'],
      },
      colors: {
        'panel-bg': 'rgba(45, 45, 52, 0.2)',
        'panel-dark': 'rgba(40, 40, 41, 0.15)',
        'panel-border': '#FFFFFF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C8BD56',
        'text-live': '#83CE7E',
      },
    },
  },
  plugins: [],
}

