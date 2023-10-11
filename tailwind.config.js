/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        merri: ["Merriweather", "serif"],
        comf: ["Comfortaa", "cursive"],
        right: ["Righteous", "cursive"],
      },
    },
  },
  plugins: [],
};
