/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#17110d',
        surface: '#211914',
        primary: '#d9822b',
        accent: '#e0a83e',
        secondary: '#38251a',
        text: '#f6efe4',
        muted: '#b9a999',
        terracotta: '#b94f32',
        sand: '#d9bd8a',
        clay: '#8f3f2d',
        charcoal: '#17110d',
        ivory: '#f6efe4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        cinematic: '0 20px 60px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
