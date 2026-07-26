/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#11100e',
        surface: '#1a1815',
        primary: '#e0a83e',
        accent: '#e0a83e',
        secondary: '#2a2620',
        text: '#f5f0e8',
        muted: '#aaa196',
        terracotta: '#c65b3d',
        sand: '#d7c39a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
