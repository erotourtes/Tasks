/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'left': '-00px 0px 21px 6px rgba(0,0,0,0.62)',
      },
      colors: {
        'dark-drop': 'rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}

