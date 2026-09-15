/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sansation': ['Sansation', 'Outfit', 'Inter', 'sans-serif'],
        'albert': ['Albert Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'panel-bg': 'rgba(45, 45, 52, 0.2)',
        'panel-dark': 'rgba(40, 40, 41, 0.15)',
        'panel-border': 'rgba(255, 255, 255, 0.12)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C8BD56',
        'text-live': '#83CE7E',
        'accent-gold': '#C8BD56',
        'accent-gold-glow': 'rgba(200, 189, 86, 0.25)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px -5px rgba(200, 189, 86, 0.35)',
        'glow-green': '0 0 20px -3px rgba(131, 206, 126, 0.4)',
        'panel-soft': '0 14px 40px -10px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(200, 189, 86, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
