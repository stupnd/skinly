/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(251, 113, 133, 0.4), 0 0 40px rgba(251, 113, 133, 0.2), 0 0 60px rgba(192, 132, 252, 0.1), inset 0 0 20px rgba(251, 113, 133, 0.1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(251, 113, 133, 0.6), 0 0 80px rgba(251, 113, 133, 0.35), 0 0 120px rgba(192, 132, 252, 0.2), inset 0 0 30px rgba(251, 113, 133, 0.15)',
          },
        },
      },
    },
  },
  plugins: [],
}